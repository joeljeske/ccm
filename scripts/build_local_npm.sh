#!/usr/bin/env bash

ibazel build --config=ci  $(bazel query 'attr(tags, "\bnpm_public\b", //packages/...)')
     