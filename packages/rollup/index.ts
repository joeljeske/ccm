import type { Plugin } from 'rollup';
import { createFilter, FilterPattern } from '@rollup/pluginutils';

import { processCCM, RuntimeArgs } from 'packages/node-api';
import path from 'path/posix';

export interface PluginOptions {
  include?: FilterPattern;
  exclude?: FilterPattern;

  generateScopedName?: RuntimeArgs['generateScopedName'];
  templates?: RuntimeArgs['templates'];
  runtime?: RuntimeArgs['runtime'];
}
export default (options: PluginOptions = {}): Plugin => {
  const {
    include = '**/*.ccm.css',
    exclude,
    generateScopedName = process.env.NODE_ENV === 'production'
      ? 'optimized'
      : 'default',
    runtime = 'packages/react',
    templates = 'js',
  } = options;
  const filter = createFilter(include, exclude);

  const root = process.cwd();

  let virtualAssets = new Map();
  return {
    name: 'ccm',

    buildStart(opts) {
      virtualAssets = new Map();
    },

    resolveId(source, importer) {
      if (!importer) return null;

      const id = path.join(path.dirname(importer), source);
      if (virtualAssets.has(id)) {
        return id;
      }
    },

    load(id) {
      if (virtualAssets.has(id)) {
        return virtualAssets.get(id);
      }
    },

    async transform(code, id) {
      if (!filter(id)) {
        return null;
      }

      const rel = path.relative(root, id);

      const files = await processCCM({
        filename: rel,
        inputCSS: code,
        generateScopedName,
        templates,
        runtime,
      });

      for (const { filename, contents } of files) {
        const asset = path.join(path.dirname(id), filename);
        virtualAssets.set(asset, contents);
      }

      // Re-export from the main asset. This allows it to be picked up by normal loaders
      return `export * from './${files[0].filename}';`;
    },
  };
};
