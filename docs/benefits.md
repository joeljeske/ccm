# Benefits of CCM

CCM has a number of benefits, especially compared to the current state of CSS authoring technologies.

## CSS Encapsulation

All the css you write is encapsulated. All component names, class names, and custom properties are uniquely and deterministically hashed so that the resulting CSS is safe from any naming collisions from outside of the CCM file.

This means you can stop thinking about names, and simply write your CSS.

**Example**

```css
AppComponent {
  color: red;
}

/* becomes */

.a92fac {
  color: red;
}
```

**Advanced Example**

```css
AppComponent {
  color: var(--color);
  font-size: 14px;
}
AppComponent.large {
  font-size: 22px;
}

/* becomes */

.a92fac {
  color: var(--a8b2c4);
  font-size: 14px;
}
.a92fac.c03fac {
  font-size: 22px;
}
```

## CSS-in-JS is _not_ a spec

CSS-in-JS are a dime-a-dozen right now. There are so many competing solutions. Each has their own syntax, some using template back-ticks, others opting for a JS structure. All of them suffer from _being different from the CSS spec_. When you bounce from project to project, you will have to recall how to write CSS for this project with this tool. When new engineers work on your project, they may have to learn the nuances of your chosen CSS-in-JS library. CCM is the closest example to the original CSS spec, there.

Now I know you are saying, but JSX is so great, why not do the same for CSS!? JSX _does_ have a spec, and many frameworks use that spec. CSS-in-JS is very fragmented and comes with a mental burden. Switching between libraries and onboarding new people comes at a cost!

## Separate Files

Now some would say having CSS in separate files from JS is a loss, when compared to CSS-in-JS. After all, a big benefit of JSX is that your markup is co-located with your logic why not do the same for CSS!? Let's put our CSS next to our JS so we can see it all! In practice, CSS-in-JS often results in your CSS Components being declared at the top of your file, and the logic is still well beneath that, out of sight.

We believe that by moving the CSS out of the current JS file you achieve the best of both worlds. When authoring your CSS, you can see all the components that you are using in your current view and see how they interact. The CSS is easily recognized by all IDEs for easy syntax highlighting, hints, and error detection. In addition, your CCM components export all the flags and options that can be used in your view logic. That allows you to succinctly and easily how JS logic is interacting with the CSS styles.

## Toolchain Maintenance

CSS-in-JS. Boom. You've now completely coupled how you compile your CSS with how you process your JS. They are fundamentally different and have different constraints. This leads to a major headache for large scale projects about how to keep builds and runtime fast.

With JSX, we keep all HTML data as JavaScript, no need to extract. With CSS-in-JS, it is a major performance hit if we do not extract the CSS into real .CSS files before shipping to production. Some CSS-in-JS tools provide the ability extract into files, but at the cost of being locked to specific web transpilers and at the cost of build time performance.

Lets keep things fast and keep them separate! Each CCM file can be processed separately into a single CSS file and a single JS. Then you can use any web compiler of your choice to link and bundle everything.
