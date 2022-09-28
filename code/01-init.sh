#!/bin/bash

DIRNAME="pulumi-challenge"

# step 1
mkdir -p "$DIRNAME" &&
    cd "$DIRNAME" &&
        pulumi new gcp-typescript

# step 3
npm install mime @types/mime
