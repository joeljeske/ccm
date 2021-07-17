import path from "path";

export default ({
  extension = ".ccm.css",
  buildRoot = process.cwd(),
  ccmOutputRoot = ".ccm",
  transformedExtension = ".js",
} = {}) => ({
  name: "ccm",
  async resolveId(source, importer) {
    if (source.endsWith(extension)) {
      // Resolve the file as if it existed in the src tree
      const resolved = await this.resolve(source, importer, {
        skipSelf: true,
      });
      // Find the relative path from the root, in order to find the expected location in the output
      const relImport = path.relative(buildRoot, resolved.id);
      // Join the paths back together to find the expected output tree
      return path.resolve(
        buildRoot,
        ccmOutputRoot,
        relImport + transformedExtension
      );
    }
    return null;
  },
});
