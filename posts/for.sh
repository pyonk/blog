#!/bin/sh

for dir in *; do
    if [ -d ${dir} ]; then
        mkdir ${dir}/images
    fi
done
