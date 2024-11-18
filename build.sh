#!/usr/bin/env bash

echo "--- Building kb (reminder: run docker login first!!)"

ARCH=$(uname -m)
BUILD_DATE=`date -u +"%Y-%m-%dT%H:%M:%SZ"`
IMAGE_TAG="mbari/kbeditor"
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
VCS_REF=`git tag | sort -V | tail -1`

yarn build

if [[ $ARCH == 'arm64' ]]; then
    docker buildx build \
                  -f Dockerfile \
                  --build-arg BUILD_DATE=$BUILD_DATE \
                  --build-arg VCS_REF=$VCS_REF \
                  --platform linux/amd64,linux/arm64 \
                   -t $IMAGE_TAG:${VCS_REF} \
                   -t $IMAGE_TAG:latest \
                  --push . \
      && docker pull $IMAGE_TAG:latest
else
    docker build -f Dockerfile \
                 --build-arg BUILD_DATE=$BUILD_DATE \
                 --build-arg VCS_REF=$VCS_REF \
                  -t $IMAGE_TAG:${VCS_REF} \
                  -t $IMAGE_TAG:latest . \
      && docker push $IMAGE_TAG:latest
fi