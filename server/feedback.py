"""Feedback endpoint for the Sandhyāvandanam app and site: POST /api/feedback → a GitHub issue.

Runs on the Hetzner server behind nginx (sandhya.pragnyalabs.com/api/feedback → 127.0.0.1:PORT).
Needs GITHUB_TOKEN (fine-grained, Issues: read and write on this repo only) in ~/apps/sandhya-feedback/.env.
The issue is public, so the sender's optional contact is NOT put in it: it goes to contacts.jsonl next to this
file (private, on the server), keyed by the issue number.
Standard library only. Self-check: `python3 feedback.py --check`.
"""
import json, os, sys, threading, time, urllib.request
from collections import defaultdict, deque
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

REPO = os.environ.get("GITHUB_REPO", "sreenivasanac/sandhyavandanam")
PORT = int(os.environ.get("PORT", "8060"))
CONTACTS = Path(__file__).with_name("contacts.jsonl")
# Browser origins allowed to post: the site, and the iOS / Android app web views.
ORIGINS = {"https://sandhya.pragnyalabs.com", "capacitor://localhost", "https://localhost", "http://localhost:5173"}
KINDS = {"bug": ("Bug", "bug"), "idea": ("Idea", "enhancement"), "correction": ("Correction", "content"), "other": ("Feedback", "feedback")}
LIMIT, WINDOW = 5, 3600  # per IP per hour
MAX_BODY = 20_000
hits: dict[str, deque] = defaultdict(deque)
lock = threading.Lock()  # the server is threaded: check-and-reserve a slot atomically


def clean(v, n: int) -> str:
    return str(v or "").replace("\r", "").strip()[:n]


def build(d: dict) -> tuple[str, str, list[str]]:
    """(title, body, labels) for a validated payload. Raises ValueError on bad input."""
    kind = str(d.get("kind")) if d.get("kind") in KINDS else "other"
    msg = clean(d.get("message"), 5000)
    if len(msg) < 5:
        raise ValueError("Please write a few words.")
    word, label = KINDS[kind]
    first = msg.splitlines()[0]
    title = f"{word}: {first[:70]}{'…' if len(first) > 70 else ''}"
    ctx = {k: clean(d.get(k), 120) for k in ("page", "app", "platform", "tradition", "script")}
    lines = "\n".join(f"- {k}: `{v}`" for k, v in ctx.items() if v)
    body = f"{msg}\n\n---\nSent from the in-app feedback form.\n{lines}\n"
    if clean(d.get("contact"), 200):
        body += "- contact: given (kept private on the server)\n"
    return title, body, ["feedback", label] if label != "feedback" else ["feedback"]


def file_issue(title: str, body: str, labels: list[str]) -> int:
    req = urllib.request.Request(
        f"https://api.github.com/repos/{REPO}/issues",
        data=json.dumps({"title": title, "body": body, "labels": labels}).encode(),
        headers={"Authorization": f"Bearer {os.environ['GITHUB_TOKEN']}", "Accept": "application/vnd.github+json",
                 "X-GitHub-Api-Version": "2022-11-28", "User-Agent": "sandhya-feedback"},
        method="POST")
    with urllib.request.urlopen(req, timeout=15) as r:
        return json.load(r)["number"]


class H(BaseHTTPRequestHandler):
    def cors(self):
        o = self.headers.get("Origin", "")
        if o in ORIGINS:
            self.send_header("Access-Control-Allow-Origin", o)
            self.send_header("Vary", "Origin")

    def reply(self, code: int, obj: dict):
        b = json.dumps(obj).encode()
        self.send_response(code)
        self.cors()
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(b)))
        self.end_headers()
        self.wfile.write(b)

    def do_OPTIONS(self):
        self.send_response(204)
        self.cors()
        self.send_header("Access-Control-Allow-Methods", "POST")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Max-Age", "86400")
        self.end_headers()

    def do_POST(self):
        if self.path != "/api/feedback":
            return self.reply(404, {"error": "not found"})
        ip = self.headers.get("X-Real-IP") or self.client_address[0]
        n = int(self.headers.get("Content-Length") or 0)
        if not 0 < n <= MAX_BODY:
            return self.reply(413, {"error": "Message too long."})
        try:
            d = json.loads(self.rfile.read(n))
            if d.get("website"):  # honeypot field, hidden from people; bots fill it
                return self.reply(200, {"ok": True})
            title, body, labels = build(d)
        except ValueError as e:
            return self.reply(400, {"error": str(e) if str(e).startswith("Please") else "Bad request."})
        now = time.time()
        with lock:
            q = hits[ip]
            while q and q[0] < now - WINDOW:
                q.popleft()
            if len(q) >= LIMIT:
                return self.reply(429, {"error": "Too many messages from here in the last hour. Please try again later."})
            q.append(now)  # reserve before the GitHub call
        try:
            num = file_issue(title, body, labels)
        except Exception as e:  # GitHub down or token expired: tell the person, log for the owner
            print("github error:", repr(e), file=sys.stderr, flush=True)
            with lock:
                hits[ip].remove(now)  # failed sends don't use up the quota
            return self.reply(502, {"error": "Couldn't send just now. Please try again later."})
        if contact := clean(d.get("contact"), 200):
            try:
                with CONTACTS.open("a") as f:
                    f.write(json.dumps({"issue": num, "contact": contact, "at": int(now)}) + "\n")
            except OSError as e:  # the issue exists: still report success, so a retry doesn't file it twice
                print(f"issue #{num}: could not save contact: {e!r}", file=sys.stderr, flush=True)
        print(f"issue #{num} {labels}", flush=True)
        self.reply(200, {"ok": True, "issue": num})

    def log_message(self, format, *args):  # keep IPs out of the journal
        pass


if __name__ == "__main__":
    if sys.argv[1:] == ["--check"]:
        t, b, l = build({"kind": "bug", "message": "Chant does not play\nOn step 3", "contact": "x@y.z", "script": "tamil"})
        assert t == "Bug: Chant does not play" and "x@y.z" not in b and "`tamil`" in b and l == ["feedback", "bug"], (t, b, l)
        assert build({"kind": "nope", "message": "hello there"})[2] == ["feedback"]
        try:
            build({"message": "hi"}); assert False
        except ValueError:
            pass
        print("ok")
    else:
        ThreadingHTTPServer(("127.0.0.1", PORT), H).serve_forever()
