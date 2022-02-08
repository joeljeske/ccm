import type { Compiler } from 'webpack';
import * as path from 'path';

interface PluginOptions {
  runtime: string;
  templates: string;
  generateScopedName: 'optimized' | 'default';
  test: RegExp;
}

export class CCMPlugin {
  constructor(private readonly options: Partial<PluginOptions> = {}) {}

  apply(compiler: Compiler): void {
    const {
      generateScopedName = process.env.NODE_ENV === 'production'
        ? 'optimized'
        : 'default',
      templates = 'js',
      runtime = 'packages/react',
      test = /\.ccm\.css$/,
    } = this.options;

    compiler.options.module?.rules.unshift({
      test,
      enforce: 'post',
      use: [
        {
          loader: require.resolve(path.resolve(__dirname, '../loader/loader')),
          options: { runtime, templates, generateScopedName },
        },
      ],
    });
  }
}
