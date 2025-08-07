#!/bin/bash

set -e

function check() {
  curl -s "localhost:3000/sumar?a=$2&b=$3" | grep "$4" && echo "$1:ok" || echo "$1:error"
}


check 'caso_01: 1 +1 = 2' 1 1 2
check 'caso_02: 10 + 23 = 33' 10 23 33
