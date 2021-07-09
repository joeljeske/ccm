import { CcmMetadata } from "./expand-templates";

const parseCCMMetadata = (locals: any): any => {
  try {
    return JSON.parse(
      Buffer.from(`${locals.__CCM_METADATA_EXPORT__}`, "base64").toString(
        "utf8"
      )
    ) as any;
  } catch (err) {
    throw new Error("[CCM] Unable to determine CCM export metadata. ");
  }
};

export const structureLocals = (locals: any): CcmMetadata[] => {
  const getLocal = (localName: string): string => {
    if (!(localName in locals)) {
      throw new Error(`Could not find local export name for ${localName}`);
    }
    return locals[localName];
  };

  const metadata = parseCCMMetadata(locals);
  return Object.entries(metadata).map(
    ([componentName, { properties, modifiers }]: any) => {
      return {
        name: componentName,
        base: getLocal(componentName),
        properties: Object.fromEntries(
          properties.map((prop: string) => [`$${prop}`, getLocal(prop)])
        ),
        modifiers: Object.fromEntries(
          modifiers.map((mod: string) => [`$${mod}`, getLocal(mod)])
        ),
      };
    }
  );
};
