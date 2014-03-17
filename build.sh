#!/bin/bash
set -e

grunt crx
cp imgur-to-gfycat.pem Source/key.pem
zip -r Upload.zip Source
rm Source/key.pem
grunt bump

echo "CRX & Zip ready."
