#!/usr/bin/env bash

. ~/.nvm/nvm.sh

NODE_VERSIONS="
6
stable
"

for node_version in $NODE_VERSIONS
do
    nvm use $node_version
    rm -rf node_modules
    npm i
    npm run cover -- --reporter=cobertura
    mv xml-2-json-results*.xml ../results
done
