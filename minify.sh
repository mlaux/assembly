#!/bin/bash
SRC_FILES=`find src -name "*.js" | grep -v Initialize`
uglifyjs -o assembly.min.js $SRC_FILES src/Initialize.js

