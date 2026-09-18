#!/bin/bash

set -e
set -x

yarn install
yarn test
yarn test:int
yarn test:e2e
yarn lint
