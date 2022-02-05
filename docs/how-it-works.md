# How It Works

For those that want to know whats going on behind the scenes, this doc is for you.

The goal of CSS-in-JS is to bridge the gap between these technologies. We believe that it is a mistake to bridge this gap by putting the CSS in your JS. Instead, we want to enabling writing vanilla CSS and provide rich, first class information about your CSS while you author your JavaScript.

## Process

When the CCM tool processes a `.ccm.css` file, it goes through the following steps:

1. Validate CSS
2. Extract Metadata (components, modifiers, variables)
3. Convert Components Classes
4. Process as CSS-Modules
5. Output JavaScript using metadata & CSS-Modules output
6. Output CSS from CSS-Module Transform

### Validate the CSS

In this step, we ensure that the CSS abides by the subset of rules we offer.

1. No usage of IDs (e.g `#my-id`)
2. No usage of DOM Elements (e.g. `div`)
3. No usage of DOM Attributes (e.g. `[title=pic]`)
4. No usage of Wildcard selectors (e.g. `*`)
5. All components have a capital case name (e.g. `MyComponent`)
6. All classes modifiers are attached to a component (e.g. `MyComponent.myModifier`)

### Extract Metadata

In order to generate rich experience with zero-runtime, we need to know the following.

1. The list of all the components
2. Every class modifier that could be set on a component
3. Every CSS custom property that could be used on a component

### Convert Components Classes

During this step, we simple change each Component name, to a class name.

Example:

```css
MyComponent {
  ...;
}
MyComponent.large {
  ...;
}

/* transformed to */

.MyComponent {
  ...;
}
.MyComponent.large {
  ...;
}
```

This allows us to use that class name instead of a component, but still allows us to target each component separately.

### Process as CSS-Modules

Next, we use the existing CSS Module Transformers. They are responsible for hashing class names and custom property names. CSS Modules exports the transformed CSS, and JSON metadata about the old classnames and the new uglified unique classnames.

### Output JavaScript using metadata & CSS-Modules output

Javascript is rendered, using both the metadata extracted in step 2 and the css-module output that maps the original class names to the uniquely hashed class names.

This step is flexible, we have a few different presets that are available for use. In addition, you can provide your own EJS templates to render custom JS/TS if desired.

### Output CSS

Lastly, the CSS is rendered as an output to a CSS file. This file is typically referenced via an import from the JS file. The CSS file is now fully processed and can be bundled through any traditional means as any other vanilla CSS file.

Alternatively, one could provide their own EJS file to process the CSS file if they want to control this step further. Some, may opt to render the CSS as a static string within JS and inject it into the page as needed.
