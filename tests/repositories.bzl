load("@build_bazel_rules_nodejs//:index.bzl", "yarn_install")

def test_repositories():
    yarn_install(
        name = "test_cra_npm_deps",
        yarn_lock = "//tests/cra:yarn.lock",
        package_json = "//tests/cra:package.json",
        links = {
            "@css-components/react": "//packages/react:npm",
            "@css-components/webpack": "//packages/webpack:npm",
        },
    )
