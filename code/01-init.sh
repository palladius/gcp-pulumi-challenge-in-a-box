#!/bin/bash

DIRNAME="pulumi-challenge"

mkdir -p "$DIRNAME" &&
    cd "$DIRNAME" &&
        pulumi new gcp-typescript
