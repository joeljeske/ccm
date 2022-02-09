// To change the output path, we need to use this env var, but we cannot
// easily set this generated path in env var in this type of bazel rule,
// so we set it here instead
process.env.BUILD_PATH = process.argv.pop();
