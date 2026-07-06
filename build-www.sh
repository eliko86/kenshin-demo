#!/bin/bash
set -e
cd "$(dirname "$0")"
rm -rf www && mkdir -p www/characters/soft www/art
cp index.html www/
cp *.jsx www/
cp characters/soft/*.png www/characters/soft/
cp art/star-hero.png art/adventure-map.png art/star-quest.png \
   art/room-day.jpeg art/room-sunset.jpeg art/room-night.jpeg www/art/
echo "www/ built: $(find www -type f | wc -l | tr -d ' ') files, $(du -sh www | cut -f1)"
npx cap copy ios >/dev/null 2>&1 && echo "synced to iOS app"
