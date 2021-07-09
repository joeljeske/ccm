import { Plugin } from "postcss";
import { CCMFile } from "./models";
import {
  GenerateScopedNameFn,
  selectGenerateScopedNameFn,
} from "./generated-scoped-name";

export interface PostcssCCMOptions {
  generateScopedName?: GenerateScopedNameFn | "optimized" | "default";
}

export const createCcmPlugin = (opts: PostcssCCMOptions = {}): Plugin => ({
  postcssPlugin: "postcss-ccm",
  Once(root, helpers) {
    const filePath = root.source?.input.from.replace(/\\/g, "/");
    if (!filePath) {
      throw new Error(
        "Expected to be provided filepath to css file: `{ from: string }`"
      );
    }


    const file = new CCMFile(
      filePath,
      selectGenerateScopedNameFn(opts.generateScopedName)
    );

    root.walkRules((rule) => {
      rule.selector = file.activateSelector(rule.selectors);
      rule.walkDecls((decl) => {
        decl.value = file.trackDeclaration(decl.prop, decl.value);
      });
    });

    const meta = file.serializeMetadata();
    const props = file.customProperties;
    // Add at the end a `:export { CCM_METADATA_EXPORT: some-long-base64-value }`
    root.append(
      helpers.rule({
        selector: ":export",
        nodes: [
          helpers.decl({
            prop: "__CCM_METADATA_EXPORT__",
            value: meta,
          }),
          // Add the custom property output here
          ...Object.entries(props).map(([prop, value]) =>
            helpers.decl({ prop, value })
          ),
        ],
      })
    );
  },
});
