#!/bin/bash
SRC_FILES=`find src -name "*.js" | grep -v "^src/Initialize"`
echo $SRC_FILES
uglifyjs -o centrifuge.min.js $SRC_FILES src/Initialize.js

