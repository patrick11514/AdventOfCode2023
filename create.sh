#!/bin/bash
if [ -z $1 ]; then
    echo "Please enter folder name"
    exit
fi

npm create @patrick115/app@latest $1

cd $1
mkdir src
cp ../lib.ts ../index.ts ./src
touch src/input.txt
touch src/testInput.txt 
