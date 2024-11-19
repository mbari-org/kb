!/usr/bin/env bash

echo "--- Building kbeditor (reminder: run docker login first!!)"

BUILD_DATE=`date -u +"%Y-%m-%dT%H:%M:%SZ"`
VCS_REF=`git tag | sort -V | tail -1`
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

yarn build

ARCH=$(uname -m)
IMAGE_TAG="mbari/kbeditor"

if [[ $ARCH == 'arm64' ]]; then
    # https://betterprogramming.pub/how-to-actually-deploy-docker-images-built-on-a-m1-macs-with-apple-silicon-a35e39318e97
   
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