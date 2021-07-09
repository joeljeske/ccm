import { createCcmPlugin } from "./ccm-postcss-plugin";

// Required for postcss to use this plugin
export const postcss = true;
export default createCcmPlugin;

// Helpers for consumers to use
export {
  GenerateScopedNameFn,
  selectGenerateScopedNameFn,
} from "./generated-scoped-name";
