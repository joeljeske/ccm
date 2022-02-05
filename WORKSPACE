load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")

http_archive(
    name = "build_bazel_rules_nodejs",
    sha256 = "0fa2d443571c9e02fcb7363a74ae591bdcce2dd76af8677a95965edf329d778a",
    urls = ["https://github.com/bazelbuild/rules_nodejs/releases/download/3.6.0/rules_nodejs-3.6.0.tar.gz"],
)

load("@build_bazel_rules_nodejs//:index.bzl", "node_repositories", "yarn_install")

node_repositories(
    node_version = "16.3.0",
    yarn_version = "1.22.10",
)

yarn_install(
    name = "npm",
    environment = {
        # Don't need to have a real token when just pulling
        "NPM_TOKEN": "",
    },
    package_json = "//:package.json",
    yarn_lock = "//:yarn.lock",
)
