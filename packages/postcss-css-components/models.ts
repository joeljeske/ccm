import {
  ClassNode,
  parse as parseSelector,
  stringify as stringifySelector,
} from "css-selector-tokenizer";
import { GenerateScopedNameFn } from "./generated-scoped-name";

const isValidComponentName = (name: string) => {
  // Enforces PascalCaseFormat:
  return /^[A-Z][0-9a-zA-Z]*$/.test(name);
};

const isValidModifierName = (name: string) => {
  // Enforces camelCaseNames:
  return /^[a-z][0-9a-zA-Z]*$/.test(name);
};

const isValidCustomPropName = (name: string) => {
  // Enforces `--camelCaseName`:
  return /^--[a-z][0-9a-zA-Z]*$/.test(name);
};

export class CCMFile {
  private readonly componentMapping = new Map<string, CCMComponent>();
  private readonly customPropMapping = new Map<string, string>();
  private activatedComponents = new Set<CCMComponent>();

  constructor(
    private readonly cssFilePath: string,
    private readonly scopeCustomProp: GenerateScopedNameFn
  ) {}

  get customProperties(): Record<string, string> {
    return Object.fromEntries(this.customPropMapping.entries());
  }

  serializeMetadata(): string {
    const metadata: Record<
      string,
      { modifiers: string[]; properties: string[] }
    > = {};
    for (const component of this.componentMapping.values()) {
      metadata[component.componentName] = {
        modifiers: Array.from(component.classModifiers),
        properties: Array.from(component.customProperties),
      };
    }
    return Buffer.from(JSON.stringify(metadata)).toString("base64");
  }

  activateSelector(selectors: string[]): string {
    // Reset this
    this.activatedComponents = new Set();

    // The selectors is a list of selectors potentially separated by commas
    for (const selector of selectors) {
      // We have already been identified that the selector does not have csv,
      // so we take just first selector node set
      const selectorNodes = parseSelector(selector).nodes[0].nodes;
      let mostRecentComponent: CCMComponent | null = null;

      for (const selectorNode of selectorNodes) {
        switch (selectorNode.type) {
          case "id":
            throw new Error(`[CCM] Cannot use ID selectors: ${selector}`);

          case "attribute":
            throw new Error(
              `[CCM] Cannot use Attribute selectors: ${selector}`
            );

          case "operator":
          case "spacing":
            // When we encounter these node types, we know that the most recently component is no longer active,
            // meaning the next block will need to contain its own component
            mostRecentComponent = null;
            break;

          case "element":
            if (!isValidComponentName(selectorNode.name)) {
              throw new Error(
                `[CCM] Component names must be in PascalCaseFormat: ${selector}`
              );
            }
            mostRecentComponent = this.trackComponent(selectorNode.name);
            break;

          case "class":
            if (!mostRecentComponent) {
              throw new Error(
                `[CCM] Class selectors must be a modifier on a component: ${selector}`
              );
            }
            if (!isValidModifierName(selectorNode.name)) {
              throw new Error(
                `[CCM] Component modifiers must be camelCaseFormat: ${selector}`
              );
            }
            mostRecentComponent.classModifiers.add(selectorNode.name);
            break;

          default:
            throw new Error(
              `[CCM] Unexpected selector node type "${selectorNode.type}": ${selector}`
            );
        }
      }

      // The last component in each selector set is considered "active" for any
      // custom properties we may find in the rule block
      if (mostRecentComponent) {
        this.activatedComponents.add(mostRecentComponent);
      }
    }

    return this.rewriteComponentSelectors(selectors.join(", "));
  }

  trackDeclaration(prop: string, value: string): /* rewritten value */ string {
    if (prop.startsWith("--")) {
      throw new Error(
        `[CCM] Custom Properties cannot be set directly within files: ${prop}`
      );
    }

    return value.replace(
      // Look for all `var(--someProp)`. Look only at the first
      // arg to var()
      /(^|\s+)var\(([^,)]+)/g,
      (wholeMatch, whitespace, customPropName) => {
        customPropName = customPropName.trim();
        if (!isValidCustomPropName(customPropName)) {
          throw new Error(
            `[CCM] Custom Properties must be in "--camelCaseFormat": ${wholeMatch})`
          );
        }
        const scopedPropName = this.trackCustomProp(customPropName);
        for (const component of this.activatedComponents) {
          component.customProperties.add(customPropName);
        }
        return `${whitespace}var(${scopedPropName}`;
      }
    );
  }

  // We turn all selectors from elements into classes
  private rewriteComponentSelectors(csvSelector: string): string {
    const parsed = parseSelector(csvSelector);
    for (const selector of parsed.nodes) {
      for (const node of selector.nodes) {
        if (node.type === "element") {
          // We force overwrite the selector to be a class instead of an element
          (node as unknown as ClassNode).type = "class";
        }
      }
    }

    return stringifySelector(parsed);
  }

  private trackComponent(component: string): CCMComponent {
    if (!this.componentMapping.has(component)) {
      this.componentMapping.set(component, new CCMComponent(component));
    }
    return this.componentMapping.get(component) as CCMComponent;
  }

  private trackCustomProp(customPropName: string): string {
    customPropName = customPropName.trim();
    if (!this.customPropMapping.has(customPropName)) {
      const scopedPropName =
        "--" + this.scopeCustomProp(customPropName, this.cssFilePath, "");
      this.customPropMapping.set(customPropName, scopedPropName);
    }
    return this.customPropMapping.get(customPropName) as string;
  }
}

export class CCMComponent {
  readonly classModifiers = new Set<string>();
  readonly customProperties = new Set<string>();

  constructor(readonly componentName: string) {}
}
