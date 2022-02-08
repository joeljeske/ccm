import path from 'path';
import type { LoaderContext } from 'webpack';

//@ts-expect-error: not present at build time
import loaderUtils from 'loader-utils';
import { processCCM, RuntimeArgs } from 'packages/node-api';

export interface LoaderOptions {
  runtime: RuntimeArgs['runtime'];
  templates: RuntimeArgs['templates'];
  generateScopedName: RuntimeArgs['generateScopedName'];
}

export default function (this: LoaderContext<any>, source: string) {
  this.cacheable(true);

  const opts = loaderUtils.getOptions(this);

  const {
    runtime = 'packages/react',
    templates = 'js',
    generateScopedName = process.env.NODE_ENV === 'production'
      ? 'optimized'
      : 'default',
  } = opts as LoaderOptions;

  const [root = process.cwd()] = this._compiler?.options.resolve.roots || [];
  const relPath = path.relative(root, this.resourcePath);

  const callback = this.async();

  processCCM({
    filename: relPath,
    inputCSS: source,
    runtime,
    templates,
    generateScopedName,
    generateImport: (file, from, css) => genRequest(css, this),
  }).then(
    ([script]) => callback(null, script.contents),
    (err) => callback(err)
  );
}

export function pitch(this: LoaderContext<any>): void {
  const [me, ...others] = this.loaders;
  this.data.downstreamCCMLoaders = others.map((loader) => {
    return typeof loader === 'string' ? loader : loader.request;
  });
  this.loaders = [me];
}

function genRequest(source: string, context: LoaderContext<any>) {
  const { downstreamCCMLoaders } = context.data;
  const data = Buffer.from(source, 'utf-8').toString('base64');
  const request = [
    ...downstreamCCMLoaders,
    `packages/webpack/inline-loader/loader?${JSON.stringify({ source: data })}`,
    'packages/webpack/empty',
  ];
  return JSON.parse(
    loaderUtils.stringifyRequest(context, '!!' + request.join('!'))
  ) as string;
}
