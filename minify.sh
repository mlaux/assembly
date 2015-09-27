#!/bin/bash
SRC_FILES=`find src -name "*.js" | grep -v Initialize`
uglifyjs -o centrifuge.min.js $SRC_FILES src/Initialize.js

