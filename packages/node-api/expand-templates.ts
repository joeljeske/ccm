import ejs from "lodash.template";
import { promisify } from "util";
import * as fs from "fs";
import * as path from "path";

const readFile = promisify(fs.readFile);

export interface CcmTemplateData {
  fileBasename: string;
  processedCss: string;
  components: CcmMetadata[];
}

export interface CcmMetadata {
  name: string;
  // Base class for the component itself
  base: string;
  // A set of custom property mapping
  properties: {
    [propertyName: string]: string; // isolated unique global mapped value
  };
  modifiers: {
    [modifierName: string]: string; // isolated unique global mapped value
  };
}

export interface CcmTemplateOptions {
  templateType: string;
  runtimeModule: string;
}

export interface CcmOutputFile {
  contents: string;
  filename: string;
}

export const createTemplateExpander = async (
  opts: CcmTemplateOptions
): Promise<(data: CcmTemplateData) => CcmOutputFile[]> => {
  const baseDirname = path.dirname(
    require.resolve("packages/templates/package.json")
  );
  const templateDir = path.resolve(baseDirname, opts.templateType);
  const templateMetaFile = path.join(templateDir, "ccm-templates.json");

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const templateMeta = JSON.parse(await readFile(templateMetaFile, "utf8")) as {
    files?: Array<{
      source: string;
      outputName: string;
    }>;
  };
  const metaFiles = templateMeta.files || [];
  const templateFiles = await Promise.all(
    metaFiles.map(
      async ({
        source,
        outputName,
      }): Promise<(data: CcmTemplateData) => CcmOutputFile> => {
        const templateFile = await readFile(
          path.resolve(templateDir, source),
          "utf8"
        );
        const filenameTemplate = ejs(outputName);
        const fileTemplate = ejs(templateFile);

        return (data: CcmTemplateData): CcmOutputFile => {
          const context = { ...data, ...opts };
          return {
            contents: fileTemplate(context),
            filename: filenameTemplate(context),
          };
        };
      }
    )
  );

  return (data: CcmTemplateData): CcmOutputFile[] =>
    templateFiles.map((compile) => compile(data));
};
