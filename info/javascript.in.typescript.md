# Working with JavaScript
Some new compiler options:
`baseUrl` - This option specifies the root location used to resolve module dependencies. \
`allowJs` - This option includes JavaScript files in the compilation process. \
`checkJs` - This option tells the compiler to check JavaScript code for common errors.

Often, you cannot work only with ts, either because TypeScript is introduced partway through a project or because you
need to work with JavaScript code that has already been developed in earlier projects. \
The TS compiler uses JS files to resolve dependencies during compilation but doesn’t include them in the output it
generates. To change this behavior, set the `allowJs` option. Compiler will transform the JS files to match the JS
version in `target` and the `module` in `tsconfig`.

The TypeScript compiler will check JavaScript code for common errors when the `checkJs` configuration option is true. It's
not so deep but can show some potential problems. \
JS can be more messy that TS, and is you want just to shut up the compiler or force to check JS file you can: \
`//@ts-check` - This comment tells the compiler to check the contents of a JavaScript file even when the `checkJs`
property in the tsconfig.json file is false. \
`//@ts-nocheck` - tells the compiler to ignore the contents of a JavaScript file, even when the checkJs property
in the tsconfig.json file is true.

### Describing Types Used in JavaScript Code

