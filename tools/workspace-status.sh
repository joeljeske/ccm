#!/usr/bin/env bash

# Lookup the most recent tag from git if we are not told
# what the version should be from .github/workflows/release.yaml
if [ -z ${NEXT_VERSION+x} ]; then
  VERSION_SUFFIX=""
  git diff-index --quiet HEAD
  if [ "$?" != "0" ]; then
    VERSION_SUFFIX="-DIRTY"
  fi

  GIT_VERSION=$(git describe --always --tags --abbrev=12 | sed 's/^v//') # remove leading v from tags v1.2.4-abc
  NEXT_VERSION="${GIT_VERSION}${VERSION_SUFFIX}"
fi

echo "STABLE_GIT_VERSION ${NEXT_VERSION}"
