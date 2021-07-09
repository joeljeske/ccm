# CCM PostCSS Plugin

This plugin is required for CCM usage, however it does not actually transform the CSS in any real way, rather it enforces CCM rules and it exports metadata to be used in the generation of CCM components. 

## Rule Enforcement

* All selectors must use a "component" name in the selector, (no danglings classes/ids/attributes)
* All components must start with a capital letter (distinguishes from html elements)
* ID selectors are not allowed
* Attribute selectors are not allowed
* Classes must be in camel-case format (for ease of use in components)
* Custom property `var()` is allowed, but custom propertering setting is disallowed 
