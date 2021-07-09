load("@build_bazel_rules_nodejs//:index.bzl", "npm_package_bin")

def create_npm_json(
        name,
        partial_package_json = "partial-package.json",
        parent_package_json = "//:package.json",
        out = "package.json"):
    npm_package_bin(
        name = name,
        outs = [out],
        args = [
            "$@",
            "$(location %s)" % parent_package_json,
            "$(location %s)" % partial_package_json,
        ],
        data = [
            partial_package_json,
            parent_package_json,
        ],
        tool = "//tools/create-npm-json",
    )
