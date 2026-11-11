"""hear.py manifest.json out.json — transcribe [{f, ref, ...}] with Su-śrotā; adds hyp + cer (akṣara-level, spaces/dandas ignored)."""
import json, os, sys, subprocess, re, unicodedata
import numpy as np, torch
import nemo.collections.asr as na
M = na.models.EncDecHybridRNNTCTCBPEModel.restore_from(os.environ.get('SUSHROTA','sushrota_sanskrit_asr_v13b.nemo'), map_location="cpu", override_config_path=os.path.join(os.path.dirname(os.path.abspath(__file__)),'sushrota_cfg_stock_nemo.yaml'), strict=False).eval()
OFF, V, BLANK = 4096, 256, 5632
def greedy(wav):
    sig = torch.tensor(wav).unsqueeze(0); sl = torch.tensor([len(wav)])
    with torch.no_grad():
        enc, _ = M.forward(input_signal=sig, input_signal_length=sl)
        lp = M.ctc_decoder(encoder_output=enc)[0].cpu().numpy()
    ids = lp[:, [BLANK] + list(range(OFF, OFF + V))].argmax(1)
    sub = M.tokenizer.tokenizers_dict["sa"]; out, prev = [], -1
    for i in ids:
        i = int(i)
        if i != prev and i != 0: out.append(sub.ids_to_tokens([i - 1])[0])
        prev = i
    return "".join(out).replace("▁", " ").strip()
def load(path):
    raw = subprocess.run(["ffmpeg","-loglevel","error","-i",path,"-ar","16000","-ac","1","-f","f32le","-"],capture_output=True).stdout
    return np.frombuffer(raw, dtype=np.float32).copy()
def norm(s):
    s = unicodedata.normalize("NFC", s).replace("ॐ","ओम्").replace("ओं","ओम्")
    s = re.sub(r"[\s।॥|'ऽ\-.,॒॑᳚]", "", s)
    return re.sub("ं(?=[पफबभम]|$)","म्",s)  # anusvāra before labials/at end ≡ m
def lev(a,b):
    d=list(range(len(b)+1))
    for i,ca in enumerate(a,1):
        p=d[:]; d[0]=i
        for j,cb in enumerate(b,1): d[j]=min(p[j]+1,d[j-1]+1,p[j-1]+(ca!=cb))
    return d[-1]
man = json.load(open(sys.argv[1]))
for m in man:
    w = load(m["f"]); m["hyp"] = greedy(w) if len(w) > 1600 else ""
    m["cer"] = round(lev(norm(m["ref"]), norm(m["hyp"]))/max(1,len(norm(m["ref"]))),3)
    print(f'{m["cer"]:.2f} {m.get("var","")} | {m["ref"][:40]} => {m["hyp"][:60]}', flush=True)
json.dump(man, open(sys.argv[2],"w"), ensure_ascii=False, indent=1)
