# CSS Component Modules - CCM

CSS Component Modules is an innovative approach to problem of CSS Encapsulation.

Yes, I know what you are thinking, "I already have **\_\_\_\_**!". Whether you are currently using CSS-in-JS, CSS Modules, SCSS/LESS, or any other flavor, know that we think that there are issues with all of these approaches that may warrant a new way of thinking.

Keep reading, or jump [straight to the docs](./docs)

## What's it Like?

Instead of cluttering JavaScript with a different language and syntax, or perhaps instead of trying to emulate a component pattern inside CSS itself, why not use CSS Component Modules that allow familiar CSS authoring inside an intuitive component structure.

```css
/* file: styles.ccm.css */

FunButton {
  display: inline-block;
  padding: 0.5rem;
  margin: 0.5rem;

  border: 2px solid white;
  background: white;
  color: black;
}

FunButton.primary {
  background: black;
  color: white;
}
```

```jsx
import { FunButton } from "./styles.ccm.css";

render(
  <>
    <FunButton.button>View Documentation</FunButton.button>

    <FunButton.button $primary>Get Started</FunButton.button>
  </>
);
```

The syntax of CSS stays exactly the same, with a couple helpful restrictions of best practices. The CSS Components are exported as full React Components, and any class modifiers in the CSS are automatically enabled as boolean props on the components!

Moreover, all of the styles written here are guaranteed to not affect any other elements or styles on the page, all css selectors are automatically made unique, just like we get from CSS-Modules.

This pattern of writing CSS has proven to enable succinct authoring of CSS that has minimal "gotchas" that also leads to predicable, performant, and maintainable css.

## Differences from Normal CSS

CSS Component Modules do not break any rules of CSS, nor does it introduce any custom CSS Syntax. It does, however, restrict some syntax that is allowed in CSS in order to encourage best practice and ensure CSS style isolation.

### Use Components instead of HTML Elements

Instead of targeting HTML Elements in your CSS like `a`, `div`, or `button`, we write the name of our component. The Component Name must start with a capital letter, in order to hint that are correctly referencing a component and not a HTML Element.

```css
/* Error! */
div {
  /*  */
}

/* OK */
MyComponent {
  /*  */
}
```

### No Dangling Classes

All CSS classes must be attached to one or more Components, meaning, we can not have dangling classes in our CSS that could be applied to any elements or components. Pseudo selectors should also be attached to a specific component, not dangling.

```css
/* Error! */
.primaryButton {
  /*  */
}

/* OK */
MyComponent.primaryButton {
  /*  */
}
```

### Restricted Selectors

Stay away from ID Selectors, Attribute Selectors, and Universal Selectors (`*`). They usually lead to bad practices almost never needed.

```css
/* Error */
#container { /*   */ }
/* OK
Container { /*   */ }


/* Error */
MyButton[disabled] { /*   */ }
/* OK */
MyButton.disabled { /*   */ }


/* Error */
Container > * { /*   */ }
/* No substitute, you cannot affect the
styles of unknown children/components in CCM */
```

## Usage in React

Each unique Component that is found in a CCM file is exported as a JavaScript import. These Components can be used in your JSX like any other Components.

```jsx
import { MyButton } from "./button.ccm.css";
```

When you use the Component in JSX, you also specify the HTML Element type that you want to render. Any HTML Element can be used for any Component.

```jsx
function App() {
  return <MyButton.button>Welcome!</MyButton.button>;
}
```

All standard HTML Element properties and attributes for that element may be used as normal.

```jsx
function App() {
  return <MyButton.button type="button">Welcome!</MyButton.button>;
}
```

Every CSS class name that is attached to your component within the CCM file is made available as a prop on your component. You can toggle them on off as normal JSX Boolean props. Each class name is prefixed with `$` to avoid name collisions.

```css
MyButton.primary {
  font-size: larger;
}
```

```jsx
function App(props) {
  return (
    <MyButton.button $primary={props.isPrimaryButton}>Welcome!</MyButton.button>
  );
}
```

Any CSS Custom Properties that are used in your CCM files are expected to be set on your JSX Components, just like other properties. Each class name is prefixed with `$` to avoid name collisions.

```css
MyButton {
  color: var(--myButtonColor);
}
```

```jsx
function App(props) {
  return <MyButton.button $myButtonColor="#3a3a3a">Welcome!</MyButton.button>;
}
```

## Why Not Use...

There are a number of benefits of using this approach than other popular conventions today.

### CSS-in-JS

CSS-in-JS libraries (styled-components, emotion, etc...) were a big inspiration for this project. The way that CSS was encapsulated to a specific component was amazing! They help engineers avoid the goal of being totally DRY, and instead put a focus on the components that every set of styles are used in.

They still have a number of downsides though.

#### Dynamic Styles

If you want a component to have a couple of different visual "states", it usually leads to pretty unique and hard to read code. CSS-in-JS typically rely on either using JS to dynamically swap out styles using template strings, or perhaps using magical CSS selectors/extenders that are not very intuitive.

CCM uses CSS class names that provide intuitive "states" that a Component could be in or not.

#### Two Languages in One

It puts more burden on developers to make sure that files are not cluttered too much styles. A separate CSS file for your CSS Components is easier to reason about and reduces clutter in your JavaScript.

Additionally, CSS-in-JS is not a very well defined language; the CSS syntax that is used varies from library to library, as opposed to JSX which is a solidified syntax extension. You need custom IDE plugins to extract the CSS snippets so they can be highlighted properly.

CCM uses a standard `.css` file that editors will know and love. There is no special syntax added to CSS!

#### Build Toolchain

There are special needs in regard to CSS optimization. Things like browser vendor prefixing, whitespace removal, or other best practices require the extraction of CSS in order to handle these optimizations. CSS-in-JS gets more complex by combining these 2 languages together.

#### Media Queries

In order to use media queries in CSS-in-JS, you need to break CSS Syntax. CSS-in-JS attempts to all usage of CSS Selectors from the styles, or else they allow a nested CSS selector which violates CSS syntax rules.

CCM allows for standard media queries without any rule breaking.

## Learn More

Want to learn more? Check out our [documentation](./docs)
