import { ComponentType, createElement, forwardRef } from "react";

export type ReactCCMProps<
  Modifiers extends string,
  Properties extends string
> = Partial<Record<Modifiers, boolean>> & Record<Properties, string>;

export type DomComponentType<CCMProps> = {
  [ElementName in keyof JSX.IntrinsicElements]: ComponentType<
    JSX.IntrinsicElements[ElementName] & CCMProps
  >;
};

export interface ExtendableComponentType<CCMProps> {
  /**
   * Escape Hatch: Do not use regularly!
   *
   * Manually call .extend('div') with the name of JSX DOM element
   * to support dynamic extension
   */
  extend<ElementName extends keyof JSX.IntrinsicElements>(
    elementName: ElementName
  ): ComponentType<JSX.IntrinsicElements[ElementName] & CCMProps>;

  /**
   * Escape Hatch: Do not use regularly!
   *
   * Manually call .extend(OtherComponent) with another component
   * to support dynamic extension
   */
  extend<OtherComponentProps>(
    OtherComponent: ComponentType<OtherComponentProps>
  ): ComponentType<OtherComponentProps & CCMProps>;
}

/**
 * Given CCM Props for a component, the fully accessible component available to be used
 */
export type CCMComponentType<
  Modifiers extends string,
  Properties extends string
> = ExtendableComponentType<ReactCCMProps<Modifiers, Properties>> &
  DomComponentType<ReactCCMProps<Modifiers, Properties>>;

export const createComponent = <
  Modifiers extends string,
  Properties extends string
>(
  name: string,
  base: string,
  modifiers: Record<Modifiers, string>,
  properties: Record<Properties, string>
): CCMComponentType<Modifiers, Properties> => {
  const componentCache = new Map<
    string | ComponentType<unknown>,
    ComponentType<unknown>
  >();

  function createReactCCMComponent(
    tag: string | ComponentType<unknown>
  ): ComponentType<unknown> {
    const Component = forwardRef((props: any, ref) => {
      const style: any = {};
      // Start off with our base component className,
      // and the className if any passed in to us
      let className = `${props.className || ""} ${base} `;
      const remainingProps: any = {};
      for (const [propName, propValue] of Object.entries(props)) {
        // First process the class modifiers that can use. Add them to our list of classNames
        // if the prop value is truthy
        if (propName in modifiers && propValue) {
          className += " " + modifiers[propName as Modifiers];
        }
        // Next if the prop is a custom property passed in, we need to set the value on style
        else if (propName in properties) {
          style[properties[propName as Properties]] = propValue;
        }
        // Assume the prop was intended for the underlying element and keep it as-is
        else {
          remainingProps[propName] = propValue;
        }
      }
      /// Create the react element, combining all the props through
      return createElement(tag as any, {
        ...remainingProps,
        ref,
        className,
        style,
      });
    });

    // Make sure we have a pretty name that is visible in the debugger
    Component.displayName = `CCM-${name}.${
      typeof tag === "string" ? tag : tag.displayName || tag.name
    }`;
    return Component;
  }

  const lookupComponent = (tag: string | ComponentType<unknown>) => {
    // .extend() is actually just a fancy way of doing prop lookup
    if (tag === "extend") {
      return lookupComponent;
    }
    if (!componentCache.has(tag)) {
      componentCache.set(tag, createReactCCMComponent(tag));
    }
    return componentCache.get(tag);
  };

  return new Proxy(Object.create(null), {
    get(unused, tag) {
      if (typeof tag === "symbol") return;
      return lookupComponent(tag);
    },
  }) as CCMComponentType<Modifiers, Properties>;
};
