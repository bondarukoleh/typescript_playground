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

We can set the module system we want to use. Changes in tsconfig **won't trigger** the watch mode. 
```json
"compilerOptions": {
    "module": "commonjs"
  }
```
|Name|Description|
|:---|:---|
|none|disables modules|
|commonjs|selects the CommonJS module format, which is supported by Node.js.|
|amd|selects the Asynchronous Module Definition (AMD), which is supported by the RequireJS module loader.|
|system|selects the module format supported by the SystemJS module loader.|
|umd|selects the Universal Module Definition (UMD) module format.|
|es2015, es6|selects the module format specified in the ES2016 language specification.|
|esnext|selects the module features that have been proposed for the next version of the JavaScript language.|

TS compiler can use two approaches to resolving modules. The two modes are **classic** (search in local project)
**Node** (search in the node_modules). **classic** mode used when `module` property es2015, system, or amd.
For all other `module` values **Node** is used. Resolution style can be specified using the `moduleResolution` value.

###Testing and debugging
The difficulty with debugging a TypeScript application is that the code being executed is compiler product, TS
transpiled to JS. To help the debugger, the compiler can generate files known as **source maps**.
```json
"compilerOptions": {
  "sourceMap": true
}
```
Compiler will generate a `.map` file, alongside the JavaScript files in the dist folder.

You can add breakpoint (if supported) or add `debugger` keyword, but Node.js ignores the debugger keyword by default.
Edit configuration in WebStorm or VSCode - and debug the code. Or we can use inspect:
```shell script
node inspect ./dist/index.js;
node --inspect=127.0.0.1:4000 use.tsc/dist/index.js;
node --inspect-brk dist/index.js; #you can inspect in chrome, after run brk go to chrome://inspect -> Remote Target -> inspect
```

### TypeScript Linter
The standard linter for TypeScript is TSLint.
The linter comes with preconfigured sets of rules that are specified using the extends setting.

```json
{
  "extends": ["tslint:recommended"],
  "linterOptions": {
    "format": "verbose"
  }
}
```

|Name|Description|
|:---|:---|
|tslint:recommended|set of rules suggested by the TSLint development team and is intended for general TypeScript development|
|tslint:latest|extends the recommended set to include recently defined rules|
|tslint:all|contains all of the linter’s rules, which can produce a large number of linting errors|

`verbose` is for rule that violated printed in error message.

```shell script
npx tslint --project tsconfig.json --config tslint.json
```
If you don't want to turn off some rule just for one line:
```typescript
//ts:lint-disable-next-line
//tslint:disable
```

###Unit Testing TypeScript
Jest with packages can ensure that TS code transpiled to JS before executing test. \
`jest` package - testing framework, `@types/jest` Jest API type definitions, `ts-jest` plugin for compiling TS files
before tests are applied.

The `transform` property in jest.config.js is used to tell Jest that files with the ts and tsx file extension should be
processed with the ts-jest package, which ensures that changes to the code are reflected in tests without needing
to explicitly start the compiler. \
Tests are defined in files that have the test.ts file extension and are conventionally created alongside the code files
they relate to.

Useful Jest Matcher Functions

|Name|Description|
|:---|:---|
|toBe(value)|asserts that a result is the same as the specified value (but need not be the same object).|
|toEqual(object)|asserts that a result is the same object as the specified value.|
|toMatch(regexp)|asserts that a result matches the specified regular expression.|
|toBeDefined()|asserts that the result has been defined.|
|toBeUndefined()|asserts that the result has not been defined.|
|toBeNull()|asserts that the result is null.|
|toBeTruthy()|asserts that the result is truthy.|
|toBeFalsy()|asserts that the result is falsy.|
|toContain(substring)|asserts that the result contains the specified substring.|
|toBeLessThan(value)|asserts that the result is less than the specified value.|
|toBeGreaterThan(value)|asserts that the result is more than the specified value.|

To run jest in watch mode, so the tests will run when the files in project have changed.
```shell script
npx jest --watchAll
```

##Types in TS
compilerOptions used here

|Name|Description|
|:---|:---|
|declaration|produces type declaration files when enabled, which can be useful in understanding how types have been concluded|
|noImplicitAny|prevents the implicit use of the `any` type, which compiler uses when it can’t conclude a specific type|
|outDir|specifies the directory in which the JavaScript files will be placed|
|rootDir|specifies the root directory that the compiler will use to locate TypeScript files|
|strictNullChecks|prevents `null` and `undefined` from being accepted as values for other types|

JavaScript is dynamically typed, types have *values* instead of *variables*.

###Static Type with a Type Annotation
```typescript
function calculateTax(amount: number /*parameter type annotation*/): number /*return type annotation*/ {
  return amount * 1.2;
}
```
When the code is compiled, TS compiler analyzes the data types of the values passed to the `calculateTax` and detects
that the type of the passed values, producing the error if they are wrong.

###Using Implicitly Defined Static Types
```typescript
function calculateTax(amount: number) {
  return amount * 1.2;
}
const price = 100; // compile conclude the type
const taxAmount = calculateTax(price); // compiler understand that we can pass price to the func and that taxAmount is a number
```
The TS compiler is able to conclude the *type* of the variable *based on the value* that is assigned when it is defined.
The compiler knows that 100 is a number and treats the price variable like `price: number` with a number type annotation,
which means that it is an acceptable value to use as an argument to the `calculateTax` function. \
Compiler also able to conclude the result of the `calculateTax` function because it knows that only number parameters accepted. \
Compiler able to conclude `taxAmount` is a number.

To see how TS compiler see the types, we can add `"declaration": true` to `compilerOptions`. We'll in `.d.ts` files 
something like:
```typescript
declare function calculateTax(amount: number): number;
declare const price = 100;
declare const taxAmount: number;
``` 
When you have the compilation error, it can help sometime to debug the error.

###Using the any Type
When you use `any` type - you turn off compiler checks for value type, and take responsibilities on yourself.
```typescript
const res: any = 'qwe';
const reset: number = res; // you can easily set any value here without the warning
``` 

>There also **unknown** type which is "save" **any**. You cannot reassign any value to initialized variable (except 
>any and unknown type), without a check **as _type_**   

Using Implicitly Defined Any Types