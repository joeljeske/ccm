import type { LoaderContext } from 'webpack';
//@ts-expect-error: not present at build time
import loaderUtils from 'loader-utils';

export default function (this: LoaderContext<any>): string {
  const opts = loaderUtils.getOptions(this);
  return Buffer.from(opts.source as string, 'base64').toString('utf-8');
}
