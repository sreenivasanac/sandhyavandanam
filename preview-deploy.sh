#!/usr/bin/env bash
# Deploy this branch's build to a preview subdomain for comparison: ./preview-deploy.sh <sub>   (e.g. sandhya-a)
# Previews are marked noindex and blocked in robots.txt; analytics does not run on them (it is tied to the production host).
set -euo pipefail
SUB="$1"; cd "$(dirname "$0")/app"
pnpm build >/dev/null
python3 - "$SUB" <<'PY'
import sys,re
sub=sys.argv[1]; p='dist/index.html'; t=open(p).read()
t=re.sub(r'<link rel="canonical"[^>]*>\s*','',t)
t=t.replace('<meta name="viewport"','<meta name="robots" content="noindex, nofollow" />\n    <meta name="viewport"',1)
t=t.replace('https://sandhya.pragnyalabs.com/',f'https://{sub}.pragnyalabs.com/')
open(p,'w').write(t)
open('dist/robots.txt','w').write('User-agent: *\nDisallow: /\n')
PY
rm -f dist/sitemap.xml
ssh -o BatchMode=yes hetzner-agent "sudo mkdir -p /var/www/$SUB && sudo chown agent:www-data /var/www/$SUB"
rsync -az --delete dist/ hetzner-agent:/var/www/$SUB/
ssh -o BatchMode=yes hetzner-agent "test -f /etc/nginx/sites-enabled/$SUB.pragnyalabs.com.conf || sudo new-site $SUB /var/www/$SUB 2>&1 | tail -1"
curl -s -o /dev/null -w "%{http_code} https://$SUB.pragnyalabs.com/\n" "https://$SUB.pragnyalabs.com/"
