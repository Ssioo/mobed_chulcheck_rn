#!/bin/bash

CODE_BUNDLE_ID="$1"
BUNDLE_DIR="bundle"
BUNDLE_FILE_PATH="$BUNDLE_DIR/ios-release.bundle"
BUNDLE_MAP_FILE_PATH="$BUNDLE_DIR/ios-release.bundle.map"

if [[ $CODE_BUNDLE_ID =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  mkdir -p $BUNDLE_DIR \
  && rm -f $BUNDLE_FILE_PATH $BUNDLE_MAP_FILE_PATH \
  && react-native bundle \
    --platform ios \
    --dev false \
    --entry-file index.js \
    --bundle-output $BUNDLE_FILE_PATH \
    --sourcemap-output $BUNDLE_MAP_FILE_PATH \
  && curl --http1.1 https://upload.bugsnag.com/react-native-source-map \
    -F apiKey=463bcf98bfb45dce3a49e1974d3eb231 \
    -F codeBundleId="$CODE_BUNDLE_ID" \
    -F dev=false \
    -F platform=ios \
    -F bundle=@$BUNDLE_FILE_PATH \
    -F sourceMap=@$BUNDLE_MAP_FILE_PATH \
    -F projectRoot="$(pwd)" \
  && printf "\nDone uploading source map for iOS v%s!\n" "$CODE_BUNDLE_ID"
else
  echo "Wrong CodePush version!"
  exit 1
fi
