#!/usr/bin/env bash

VERSION_SUFFIX=""
git diff-index --quiet HEAD
if [ "$?" != "0" ]; then
  VERSION_SUFFIX="-DIRTY"
fi

GIT_VERSION=$(git describe --always --tags --abbrev=12 | sed 's/^v//') # remove leading v from tags v1.2.4-abc

echo "STABLE_GIT_VERSION ${GIT_VERSION}${VERSION_SUFFIX}"
