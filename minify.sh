#!/bin/bash
LIB_FILES=`find libs -name "*.js"`
SRC_FILES=`find src -name "*.js" | grep -v "^src/Initialize"`
echo $SRC_FILES
uglifyjs -o centrifuge.min.js $LIB_FILES $SRC_FILES src/Initialize.js

