#!/bin/bash
set -e

grunt crx
grunt bump
cp imgur-to-gfycat.pem Source/key.pem
zip -r Upload.zip Source
rm Source/key.pem

echo "CRX & Zip ready."
