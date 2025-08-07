#!/bin/bash

set -e
set -x

# export NODE_OPTIONS="$NODE_OPTIONS --experimental-vm-modules"
corepack enable

for dir in */ ; do
  cd $dir
  ./build.sh
  cd ..
done
