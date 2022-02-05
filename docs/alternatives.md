# Alternatives

There a lot of incredible alternatives that are available that I respect. They challenged my way of thinking about CSS and for that I am very thankful! Every single option here is better than a vanilla CSS file :-)

## [Emotion](https://emotion.sh/docs/introduction) / [StyledComponents](https://styled-components.com/)

StyledComponents and Emotion are likely the most popular CSS-in-JS frameworks. Both work by providing various methods of writing CSS within your JS code. You can interpolate JS variables declare dynamic blocks of CSS.

**Performance**

These solutions often suffer from runtime performance, since they rely on dynamic JS to determine to which blocks of CSS will be active at a given time. This means that the main JavaScript thread must do calculations to insert the relevant CSS onto the page when your component is mounted. This degrades performance overtime in larger applications.

**Custom CSS Syntax**

If you want to write a media query for these, you need to know the custom syntax for that library. If you want to have custom child selectors, theres a custom syntax for that. Psuedo Selectors, another custom syntax. Some of these syntax borrow from paradigms introduced in LESS/SCSS, but they are not the same across these libraries. Each of these syntax can vary between libraries that you are using. Maybe mixing CSS inside JS itself is not the best choice...

**JS Interpolation**

These libraries often use JS Template strings to allow for dynamic styles. You can use `color: ${() => props.myColor};` syntax to have dynamic blocks of CSS. However, you cannot put these variables replacements anywhere; its bad practice to use these blocks except for CSS property values. However, you can put them anywhere. This makes the optimization of CSS nearly impossible.

**Toolchain Complexity**

Because CSS in now embedded in your JS, you need a complicated toolchain to make sure the CSS within the JS is valid. You often needed babel plugins or other transpiler hooks in order to ensure your CSS will work as expected at runtime. This comes at the cost of higher maintenance of your build toolchain, complexity when changing that tooling, and often slower build time as more work must be done when processing each JS file.

**JSX Overrides**

Some of these frameworks, notable Emotion, requires that you use a special JSX factory when writing JSX. When your write `<MyComponent />`, instead of asking React to create that element, you need to change your build chain to ask Emotion to render that component. Emotion should not control how you render each of your components, even those that do not use Emotion at all! That is a bad form of coupling and overrides.

## [Linaria](https://linaria.dev/)

Linaria was actually a primary inspiration for the fundamentals of CCM. It is very similar to
The benefit of performing all the work at build time as opposed to runtime. Its a zero-runtime CSS-in-JS library which leads to much better performance compared to runtime CSS-in-JS options.

**Dynamic Styles**

Linaria has a lot of custom rules regarding dynamic styles. If they want to have a zero-runtime, they need to pre-evaluate your JavaScript at build time. This can lead to confusing build errors as parts of your code may be run at build time in node and not in the browser. Developers need to be
aware of the _gotchas_ that are associated with extracting static CSS from dynamic JavaScript.

**Toolchain Complexity**

Because CSS needs to be static at runtime but is still derived from dynamic javascript, specific transpilers must be installed in your build toolchain that operates over all of your JavaScript files. This makes your build toolchain slower, and more complex.

## [Utility-First](https://tailwindcss.com/) (Tailwind/Shed.css/Basscss/ExpressiveCSS)

These CSS libraries are innovative in that they expose an API of CSS classnames that you can mix and match and put onto your HTML/JSX to style them. You don't have to write any CSS, rather only apply classnames.

This is probably the most different form of CSS compared to anything else mentioned here.

The potential downsides here are:

**Ramp up time**

I doubt many new folks to projects are going to read this line of and know what is going on! There are so many utility classes, patterns, and best practices you need to learn.

```html
<div class="mw9 center pa4 pt5-ns ph7-l"></div>
```

**Ambiguity**

What happens if I change the order of the classes? What if 2 classes conflict with each other? Each library must answer these questions for themselves. It makes the code hard to reason about.

**Authorship**

Is there a plugin for my IDE for this framework to give me hints about which classes are available and what they do?

## [SCSS](https://sass-lang.com/) / [LESS](https://lesscss.org/)

SCSS and LESS were very popular CSS pre-processor frameworks. You would write your CSS in external files with extra syntax like build time variables, selector nesting and macros. It a was a fun evolution of JS.

**Build Time**

Build time at scale gets very expensive. If you have a large project using SCSS, then you already understand.

**Variables**

Arguably the biggest benefit in its day was CSS variables. It was very helpful to share variables across your whole project. Now in the day of JS-provided variables and CSS Custom Properties, this is not really needed near as much.

**Selector Nesting**

Selector nesting was a very common way to isolate your feature/component from the rest of the application styles. What you may not know is selector nesting takes a big performance on CSS performance in the browser. It is much cheaper to have a all classes be declared on a single element, and not have to look up the DOM tree for other CSS selectors (cue the CSS utility libraries!). CCM provides complete isolation via selector hashing so you need not worry about this. This means you result in CSS that does not affect child components, rather just your single component.

## [CSS Modules](https://github.com/css-modules/css-modules)

CSS Modules were a way that you could write CSS in separate files, have each class name uniquely hashed, and then provided to your JavaScript by its original name so that you can use those uniquely named classes in your JSX.

CCM has its roots in CSS Modules, and in fact uses a CSS Module implementation internally!

**`classnames`**

To use CSS modules, you practically had to use `classnames` utility which allowed you to declaratively turn on or off classes for a component dynamically based on JS variables. This was very helpful, but not particularly pretty to read. CCM allows you to use each class selector on the component as a component property. Much prettier and easier to read.

**Variables**

CSS Modules did not really have a good way to inject custom variables, colors, sizes into your CSS. One could not easily provide a color to a class selector. This meant that CSS modules were often combined with SCSS/LESS to provide build time variables in your CSS. This solved that problem kind-of.. but then introduced all the downsides of SCSS/LESS pre-processors and yet another step to your CSS toolchain.

## [Vanilla Extract CSS](https://vanilla-extract.style/)

This innovative framework allows developers to provide JavaScript objects that are type-safe in TS. You write your CSS in their custom static DSL. Then their build tools transforms this into CSS at build time. The benefits here is that it is zero-runtime and type-safe.

**Custom CSS Syntax**

They created a custom CSS syntax in JavaScript to express CSS. Child selectors, media queries, key-frames all require special syntax. And because the CSS is expressed as JavaScript objects, all of the dash-cased options converted to camelCase, e.g. `backgroundColor: red`.

Additionally, you must use their custom utility functions to express otherwise native CSS calculations (e.g. css `calc()`).

**Toolchain Complexity**

The toolchain complexity of Vanilla Extract is very similar to Linaria. The toolchain needs to run parts of your JavaScript in order to extract the results to a static CSS stylesheet. This leads to a much higher complexity and build time cost.
