import * as path from 'path';
import postcss from 'postcss';
// @ts-ignore: there are no valid types for this module
import postcssModules from 'postcss-modules';

import postcssCCM, {
  GenerateScopedNameFn,
  selectGenerateScopedNameFn,
} from 'packages/postcss-css-components';
import { CcmOutputFile, createTemplateExpander } from './expand-templates';
import { structureLocals } from './structure-css-module-locals';

export type GenerateImport = (
  file: string,
  from: string,
  source: string
) => string;
export const defaultGenerateImport: GenerateImport = (file, from) =>
  `./${path.relative(path.dirname(from), file)}`;

export interface RuntimeArgs {
  filename: string;
  inputCSS: string;
  runtime: string;
  templates: string;
  generateScopedName: GenerateScopedNameFn | 'optimized' | 'default';
  generateImport?: GenerateImport;
}

export const processCCM = async (
  args: RuntimeArgs
): Promise<CcmOutputFile[]> => {
  const generateScopedName = selectGenerateScopedNameFn(
    args.generateScopedName
  );
  let resultingLocals = null as any;
  const result = await postcss([
    postcssCCM({ generateScopedName }),
    postcssModules({
      generateScopedName,
      getJSON(fileName: string, locals: any) {
        resultingLocals = locals;
      },
    }),
  ]).process(args.inputCSS, {
    from: path.resolve('/', args.filename),
    to: path.resolve('/', args.filename),
  });

  const renderTemplates = await createTemplateExpander({
    runtimeModule: args.runtime,
    templateType: args.templates,
  });

  return renderTemplates({
    filename: args.filename,
    fileBasename: path.basename(args.filename),
    processedCss: result.css,
    components: structureLocals(resultingLocals),
    generateImport: args.generateImport || defaultGenerateImport,
  });
};
