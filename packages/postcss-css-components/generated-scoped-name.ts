import { createHash } from "crypto";

export type GenerateScopedNameFn = (
  name: string,
  filename: string,
  css: string
) => string;

/**
 * The default debuggable custom prop scoper:
 *
 * Input:  --myCustomVar
 * Output: --myCustomVar_cd351dc5350f269a
 */
export const defaultGenerateScopedNameFn: GenerateScopedNameFn = (
  name,
  filename,
  css
) => {
  const customPropName = name.startsWith("--") ? name.substring(2) : name; // remove leading --
  const hash = optimizedGenerateScopedNameFn(name, filename, css);
  return `${customPropName}_${hash}`;
};

/**
 * The default debuggable custom prop scoper:
 *
 * Input:  --myCustomVar
 * Output: --cd351dc5350f269a
 */
export const optimizedGenerateScopedNameFn: GenerateScopedNameFn = (
  name,
  filename
) => {
  return createHash("md5")
    .update(`${name}::${filename}`)
    .digest("hex")
    .substring(0, 16);
};

export const selectGenerateScopedNameFn = (
  customPropertyScope?: GenerateScopedNameFn | "optimized" | "default"
): GenerateScopedNameFn => {
  if (customPropertyScope === "optimized") {
    return optimizedGenerateScopedNameFn;
  }
  if (typeof customPropertyScope === "function") {
    return customPropertyScope;
  }
  return defaultGenerateScopedNameFn;
};
