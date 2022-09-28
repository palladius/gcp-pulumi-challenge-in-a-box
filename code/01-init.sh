#!/bin/bash

DIRNAME="pulumi-challenge"

# step 1 (not sure if it makes sense to keep this part now that the folder exists and is populated)
mkdir -p "$DIRNAME" &&
    cd "$DIRNAME" &&
        pulumi new gcp-typescript

# step 3
npm install mime @types/mime
