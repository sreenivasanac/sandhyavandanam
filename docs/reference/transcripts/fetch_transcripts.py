import json, sys
from youtube_transcript_api import YouTubeTranscriptApi
api = YouTubeTranscriptApi()
for vid in ["yNXz54qLoIM", "srMGBBFV9aY"]:
    try:
        tl = api.list(vid)
        langs = [(t.language_code, t.is_generated) for t in tl]
        print(vid, "available:", langs)
        t = next(iter(tl))
        data = t.fetch()
        text = " ".join(s.text for s in data)
        open(f"yt_{vid}_{t.language_code}.txt", "w").write(text)
        print(vid, "saved", len(text), "chars, lang", t.language_code)
    except Exception as e:
        print(vid, "ERROR", type(e).__name__, str(e)[:300])
