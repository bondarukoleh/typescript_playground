The `typescript` package includes a compiler, named **tsc**, which compiles TypeScript code to produce pure JavaScript.
To define the configuration for the TypeScript compiler, there is a file called `tsconfig.json`.

```json
{
    "compilerOptions": {
    "target": "es2020",
    "outDir": "./dist",
    "rootDir": "./src",
    "module": "commonjs"
  }
}
```

Interesting stuff about the classes constructors, you don't need to have the statements inside if you have the arguments
with the access modifiers - because that's how compiler understands that you are using shorter properties in a 
constructor.
TypeScript assumes that all methods and properties are `public` unless another access level is used.
Adding explicit type to variable helping compiler to not calculate implicit type. 
```typescript
class ToDo {
 constructor(public id: IToDo) {
    // Instance will have public id property
  }
}

const item: ToDo = new ToDo(1);

// there are generic types in Typesript of cource
const map = new Map<string, number>();
```

### Type
Combination of property names and the types of their values known as an **object’s shape**.
A specific combination of names and types is known as a **shape type**.

```typescript
type ItemCounts = {
  total: number,
  incomplete: number
}
```

### Type assertions
```typescript
const returnString = () => "string";
const num = returnString() as unknown as number;  // I override the compiler
num.toFixed();
```
Type assertion allows me to tell the compiler to use the type that I specify, even if it has identified a different
data type. When a type assertion is used, it overrides the compiler, which means that I am responsible for ensuring
that the type I assert is correct.

### Using the TypeScript Compiler
It is the compiler that is responsible for implementing TypeScript features, such as static types, and the result is
pure JavaScript from which the TypeScript keywords and expressions have been removed.

`tsconfig.json`

| Name | Description |
|:---|:---|
|compilerOptions|section groups the settings that the compiler will use|
|files|specifies the files that will be compiled, overrides the default compiler behavior search for files to compile.|
|include|select files for compilation by pattern. unspecified - files with the .ts, tsx, and .d.ts extensions will be selected.|
|exclude|exclude files from compilation by pattern|
|compileOnSave| When set to true, it's hint to the code editor that it should run the compiler each time a file is saved. This feature is not supported by all editors, and better use the watch feature|

The `files, include, exclude` options are useful if you have an unusual project structure to accommodate, such as when
integrating TypeScript into a project that contains another framework or toolkit that has a conflicting set of files.

```shell script
tsc --listFiles #set of files that the compiler has found for compilation in the compilerOptions section globally
npx tsc --listFiles #same but locally from your project
#npx will check whether tsc exists in $PATH, or in the local project binaries, and execute it, it's for easy executing packages
```
The files displayed by the listFiles option include the type declarations that the compiler has located.
**Type declarations** describe the **data types** used by JavaScript code so that it can be safely used in a TypeScript
application. The TypeScript package includes type declarations for different versions of the JavaScript language and
for the APIs that are available in Node.js and browsers.

>Compiler always compile your ts code, even if it has errors, it will try to compile it and produce the js.

This can cause problems with chains of tools that execute or further process the JavaScript emitted by the TypeScript.
Fortunately, this behavior can be disabled by setting the `noEmitOnError: true` in compileOptions section.

The ``version`` of the JavaScript language targeted by the compiler is specified by the `target` in compileOptions section.
Target is for the output of the code. 

| key | value |
|:---:|:---|
|es3|third edition of the language specification, defined in December 1999, the baseline for the language. default value when the target setting is not defined.|
|es5| fifth edition of the language specification, defined in December 2009|
|es6| sixth edition, added features - classes and modules, arrow functions, and promises.|
|es2015| This is equivalent to ES6.|
|es2016| seventh edition, introduced the includes method for arrays and an exponentiation operator|
|es2017| eighth edition, introduced features for inspecting objects and new keywords for asynchronous operations|
|es2018| ninth edition, introduced the spread and rest operators and improvements for string handling and asynchronous operations.|
|esNext| features that are expected to be included in the next edition of the specification. Changes between releases.|

Other Values for the `lib` `compilerOption`. Lib tells the compiler which language features are available when
the compiled code is run.

|Name|Description|
|:---|:---|
|es5, es2015, es2016, es2017, es2018|select type definition files that correspond to a specific version of JavaScript.|
|esnext| selects features that are proposed additions to the JavaScript specification.|
|dom| selects type information files for the DOM API. This setting is also useful for Node.js applications. |
|dom.iterable| information for the additions to the DOM API that allow iteration over HTML elements.|
|scriphHost| this for the Windows Script Host, which allows for automation on Windows systems.|
|webworker| this for the web worker feature, which allows web applications to perform background tasks.|

Also like es2015.core, es2015.generator, es2015.promise, etc.
