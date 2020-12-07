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
From JS files no static type information available. Compiler tries to do its best to conduct the types but will struggle
and fall back to using `any`, especially for function parameters and results. Adding JavaScript to a project can create
holes in type checking that undermine the benefits of using TypeScript. It can be fixed in two ways.
1. **Using Comments to Describe Types** \
   Using **JSDoc** comments - markup language used to annotate JS code as comments.
   If JSDoc is there, and you are trying to use the function badly - compiler will tell you that.
```javascript
/* JSDoc comments can use the TypeScript syntax to describe more complex types */
/**
 * Format something that has a money value
 * @param { string } thing - the name of the item
 * @param { number | string } cost - the value associated with the item
 */
export function costFormatter(thing, cost) {
  if (typeof cost === "number") {
    writeMessage(`The ${thing} costs $${cost.toFixed(2)}`, true);
  } else {
    writeMessage(`The ${thing} costs $${cost}`);
  }
}
```
2. **Using Type Declaration Files** \
   Also referred to as *type definition files*, provide a way to describe JS to the TS file without having to change
   the source code file , have `d.ts` extension, and the name of the file corresponds to the JS file.
```typescript
export declare function sizeFormatter(thing: string, count: number): void;
export declare function costFormatter(thing: string, cost: number | string ): void;
```
The contents of a type declaration file mirror those of the code file it describes. Each statement contains the `declare`
keyword, which tells the compiler that the statement describes the types **defined elsewhere**. 
>Tip Type declaration files take precedence over JSDoc comments when both are used to describe JavaScript code.

When a type declaration file is used, it must describe **all the features** defined in the corresponding JS file, it is
the only source of information used by the TypeScript compiler, which **no longer examines** the JavaScript file. Compiler
fully trust your type definitions, so it's up to you.

#### Describing Third-Party JavaScript Code
Declaration files can also be used to describe JavaScript code added to the project in third-party packages. \
**BUT better approach is to use publicly available definitions.**

We'll try to add definitions for `debug` js package.
The first step is to reconfigure the way that the TypeScript compiler resolves dependencies on modules:
```json
{
   "compilerOptions": {
      ...
      "allowJs": true,
      "checkJs": true,
      "baseUrl": ".",
      "paths": {
         "*": [
            "types/*"
         ]
      }
   }
}
```
The `paths` property is used to specify locations that the TS compiler will use as it tries to resolve import statements
for modules. `"*": ["types/*"]` tells the compiler to look for all packages in a folder called `types`. When the `paths`
property is used, the `baseUrl` property must also be specified, `"baseUrl": "."` tells the compiler that the location
specified by the path property can be found in the same folder as the tsconfig.json file. \
The next step is to create the ./types/debug folder and add to it a file called index.d.ts. this will provide the compiler
with custom declaration files, the location specified by the paths folder **must contain** a folder that corresponds
to the name of the module or package and **must contain** a type declaration file that corresponds to the package’s
*entry point*. In the case of the `debug` package, types will be described in `./types/debug/index.d.ts` file.
```typescript
/*./types/debug/index.d.ts*/
declare interface Debug {
  (namespace: string): Debugger
}
declare interface Debugger {
  (...args: string[]): void;
  enabled: boolean;
}
declare var debug: { default: Debug };
export = debug;
/* and usage in index.ts file */
import debug from "debug";
let db = debug("Example App", true);
db.enabled = true;
db("Message: %0", "Test message");
```
To check where tsc finds the types (also available as compilerOption setting) we can:
```shell
./folder_with_tsconfig>tsc --traceResolution
```
```shell
File '../typescript_playground/work_with_js/types/debug.ts' does not exist.
File '.../typescript_playground/work_with_js/types/debug.tsx' does not exist.
File '.../typescript_playground/work_with_js/types/debug.d.ts' does not exist.
File '.../typescript_playground/work_with_js/types/debug/package.json' does not exist.
File '.../typescript_playground/work_with_js/types/debug/index.ts' does not exist.
File '.../typescript_playground/work_with_js/types/debug/index.tsx' does not exist.
File '.../typescript_playground/work_with_js/types/debug/index.d.ts' exist - use it as a name resolution result.
======== Module name 'debug' was successfully resolved to '.../typescript_playground/work_with_js/types/debug/index.d.ts'. ========
```

#### Using Definitely Typed Declaration Files