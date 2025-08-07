#!/bin/bash

set -e

function check() {
  yarn start "$2" "$3" | grep "$4" >/dev/null && echo "$1:ok" || echo "$1:error"
}


check 'caso_01' 1 1 2
check 'caso_02' 1 2 3
