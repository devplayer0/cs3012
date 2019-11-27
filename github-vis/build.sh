#!/bin/bash
set -ex
mkdir -p public/

cp -r index.html static/ api/ public/

# Don't use production Vue.js in development!
if [ "$NOW_REGION" != "dev1" ]; then
    sed -i 's:vue/dist/vue.js:vue@2.6.10:g' public/index.html
fi
