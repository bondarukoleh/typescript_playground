# Creating Web Applications
The application will retrieve list of products from a web service using an HTTP request. \
The user selects products to assemble an order, which will be sent to the web service.
## Creating a Stand-Alone Web App without a framework
### Creating the Toolchain
Web application development relies on a chain of tools that compile the code and prepare it for the delivery and
execution of the application by the JavaScript runtime. The TypeScript compiler is the development tool. \
Toolchain: \
TS -> TS Compiler -> JS.

#### Adding a Bundler
In backend, we can easily resolve, require JS files, since we have access to FS and it's quick. \
This doesn’t work as well for web applications, files have to be requested over network, which can be a slow and 
expensive. Instead, a **bundler** is used, which resolves the dependencies during compilation and *packages all the files*
that the application uses into a **single file**. One HTTP request delivers all the JavaScript required to run the
application, also content types, CSS, can be included. File produced by the bundler is known as a `bundle`.
During the bundling process, the code and content can be minified and compressed, reducing the amount of bandwidth (пропускная способность)
required to deliver the application to the client. Large applications can be split into multiple bundles, content can be 
loaded separately, on demand. The most widely used bundler is **webpack**, and it forms a key part in the toolchains
used by React, Angular, and Vue.js, although you don’t usually need to work with it directly.

The `webpack` package contains the main bundler features, and the `webpack-cli` package adds command-line support.
Webpack uses packages known as loaders to deal with different content types, and the `ts-loader` package adds support
for compiling TypeScript files and feeding the compiled code into the bundle created by webpack.
To configure webpack, add a file named `webpack.config.js`
```js
module.exports = {
  mode: "development",
  entry: "./src/index.ts",
  output: {filename: "bundle.js"},
  resolve: {extensions: [".ts", ".js"]},
  module: {
    rules: [
      {test: /\.ts/, use: "ts-loader", exclude: /node_modules/}
    ]
  }
};
```
This `entry` and `output` settings tell webpack to start with the `src/index.ts` file when resolving the application’s
dependencies and to give the bundle file the name `bundle.js`. The other settings configure webpack to use the ts-loader
package to process files with the `ts` file extension. The `bundle.js` file is created in the `dist` folder. \
Toolchain changed: \
TS -> WebPack <-> TS Loader <-> TS Compiler.
              -> JS.

#### Adding a Development Web Server
Web server is required to deliver the bundle file to the browser, so it can be executed. The `webpack-dev-server` (WDS)
is an HTTP server that is integrated into webpack and includes support for triggering automatic browser reloads when
a code file changes, and a new bundle file is produced.
```js
/* webpack.config.js */
...
devServer: {
  contentBase: "./assets", 
  port: 4500
}
...
```
This makes WDS to look for any file that is not a bundle in a folder named `assets` and to listen for HTTP requests
on port 4500. To provide WDS with an HTML file that can be used to respond to browsers, create a `./assets` folder and
add to it a file named index.html. \
To start the server, run the command:
```shell
webpack serve
```
The HTTP server will start, and the bundle will be created. However, the dist folder is no longer used to store the
files — the output from the bundling process is **held in memory** and used to respond to HTTP requests without 
needing to create a file on disk.
>Reload feature works only for code files and doesn’t apply to the HTML file in the assets folder. Restart needed for that.

Toolchain changed: \
TS -> WebPack <-> TS Loader <-> TS Compiler.
              -> bundle.js      -> HTTP Server (WDS) -> Browser 
              -> Assets folder

#### Rendering HTML Content Using the DOM API
Browsers provide the Domain Object Model (DOM) API to allow applications to interact with the HTML document displayed
to the user, generate content dynamically, and respond to user interaction. \
HTMLElement TS type that represent DOM API HTML element.

#### Adding Support for Bootstrap CSS Styles
Bootstrap open source CSS framework that makes it easy to consistently style HTML content.
The webpack configuration can be extended with loaders for additional content types that are included in the bundle
file, which means that the development toolchain can be extended to include support for CSS stylesheets, such as the
one that defines the Bootstrap styles applied to the e.g. `h3` element. \
```shell
npm i -ED bootstrap css-loader style-loader
```
The `bootstrap` package contains the CSS styles that we want to apply to the example project. \
The `css-loader` and `style-loader` packages contain the loaders that deal with CSS styles. 
```javascript
module.exports = {
  ...
  resolve: {extensions: [".ts", ".js", ".css"]},
  module: {
    rules: [
      {test: /\.ts/, use: "ts-loader", exclude: /node_modules/},
      {test: /\.css$/, use: ["style-loader", "css-loader"]},
    ]
  },
  ...
};
```
>The css and other loaders JS code that is executed when the contents of the bundle file are processed. This code uses
>an API provided by the browser to create the CSS styles. Bundle file contains only JS but it delivers different types
>of content to the client

#### Using JSX to Create HTML Content
Expressing HTML elements using JS statements is awkward, and using the DOM API directly produces verbose code that is
difficult to understand and prone to errors, even with the static type support that TypeScript provides. \
More elegant approach is to use **JSX**, which stands for **JavaScript XML** and which allows declarative content such
as HTML elements to be easily mixed with code statements. JSX associated with React, but the TS compiler provides
features that allow it to be used in any project. \
TS files with JSX should be with `.tsx` extension. \
`.tsx` file uses JSX to create HTML elements directly from the code that "like" as an element, instead of using the DOM
API. The `h3` element returned, generated content dynamically.
```tsx
class HtmlDisplay {
  getContent(): HTMLElement {
    return <h3 className="bg-secondary text-center text-white p-2">
      {this.getElementText()}
    </h3>
  }
}
```

Understanding the JSX Workflow \
When a `.tsx` file is compiled, the compiler processes the HTML elements it contains in order to transform them into
JavaScript statements. Each element is parsed and separated into the tag that defines the element type,
the attributes applied to the element, and the element’s content. \
The compiler replaces each HTML element with a call to a function, known as the factory function, that will be
responsible for creating the HTML content at runtime. The factory function is conventionally named `createElement` 
because that’s the name used by the React framework. So class became:
```jsx
class HtmlDisplay {
  getContent() {
    return createElement("h3", /* this is your or your framework factory function that has to be in bundle that to work */
      {className: "bg-secondary text-center text-white p-2"},
      this.getElementText());
  }
}
```
The compiler doesn't know anything about the factory function other than its name. The result of the transformation
is that the HTML content is replaced with code statements that can be compiled normally and executed by a regular
JavaScript runtime. \
TSX -> TS Compiler -> JS code -> Bundler -> Runtime (with Factory Function) -> HTML Content

#### Configuring the TypeScript Compiler and the Webpack Loader
The TypeScript compiler won’t process TSX files by default and requires two `compilerOptions` to be set: \
`jsx` - determines the way that the compiler handles elements in a TSX file. The `react` replaces HTML elements with
calls to the *factory function* and emits a **JS file**. `react-native` emits a **JS file** that leaves the HTML
elements as is. `preserve` setting emits a **JSX file** that leaves the HTML elements as is. \
`jsxFactory` - specifies the name of the *factory function*, which the compiler will use when the `jsx` is set to `react`.

```json
/* tsconfig */
{
  "jsx": "react",
  "jsxFactory": "createElement" 
}
```
The webpack configuration must be updated so that TSX files will be included in the bundling process:
```js
/* webpack */
resolve: { extensions: [".ts", ".tsx", ".js", ".css"] },
module: {
  rules: [
    { test: /\.tsx?$/, use: "ts-loader", exclude: /node_modules/ },
    { test: /\.css$/, use: ["style-loader", "css-loader"] },
  ]
},
```

#### Creating the Factory Function
Generated by the compiler code replaces HTML content with calls to the *factory function*, so JSX code transformed into
standard JS. The implementation of the *factory function* depends on the environment. React applications, will use
the factory function that generates content that React can manage. Application without framework, need to provide own
implementation, e.g. the DMO API to create an HTMLElement object. ls. To define the
factory function, I created the src/tools folder and added to it a file named jsxFactory.ts with the code
shown in Listing 15-27.

To use it in some of yours `.tsx` files you need to import it, or make it globally somehow. The TS compiler will convert
HTML elements into calls to the `factory function`, but an import statement is required to allow the converted code
to be compiled.

Some new options:
`emitDecoratorMetadata` - includes decorator metadata in the JavaScript emitted by the compiler. \
`experimentalDecorators` - support for decorators. \
`moduleResolution` - specifies the style of module resolution that should be used to resolve dependencies `: "node"` -
tells the compiler that it can resolve dependencies by looking in the node_modules folder, `: "classic"` - it's like
`import`.

Packages: `json-server` package is a RESTful web service that will provide data for the application. \
The `npm-run-all` package is a useful tool for running multiple NPM packages from a single command.

### Using Decorators
Decorator feature is associated with Angular or Vue.js. Decorators are a proposed addition to the JavaScript 
specification, but they are not widely used outside of Angular development and must be enabled with a compiler
configuration setting. Don't forget to set the `"experimentalDecorators": true` in `compilerOptions`.
Decorators are annotations that can be applied to modify classes, methods, properties, and parameters. \
Decorator should return the function that gets the `class` to which the decorator has been applied, the `name` of the
method, and a `PropertyDescriptor` object that describes the method.
```typescript
export const minimumValue = (propName: string, min: number) =>
  (constructor: any, methodName: string, descriptor: PropertyDescriptor): any => {
    const origFunction = descriptor.value;
    descriptor.value = async function wrapper(...args) {
      let results = await origFunction.apply(this, args);
      return results.map(r => ({...r, [propName]: r[propName] < min ? min : r[propName]}));
    }
  }
// ...
@minimumValue("price", 30)
getProducts(sortProp: ProductProp = "id");
```

#### Using Decorator Metadata
Decorator functions are *invoked at runtime*, which means *they have no access to the type* information from the TS
source files or the types inferred by the compiler. To ease the process of writing decorators, the compiler can include
metadata when decorators are used that provides details of the types involved. \
To enable this feature we need: 
```json
{
  "compilerOptions": {
    "emitDecoratorMetadata": true
  }
}
```
`emitDecoratorMetadata` requires an additional package `reflect-metadata`. \
During compilation, compiler will add metadata to the compiled JavaScript, which is accessed using the reflect-metadata
package. Metadata like:

|Name|Description|
|:---|:---|
|`design:type`|This describes **what** the decorator has been applied to (below it's a `Function` getContent() method)|
|`design:paramtypes`|describes the **types of the parameters** of the function to which the decorator has been applied (in that case `[String, String]`)|
|`design:returntype`|describes the **result type** of the function to which the decorator has been applied (in our case `Promise`)|

```ts
import 'reflect-metadata'
export const addClass = (selector: string, ...classNames: string[]) =>
  (constructor: any, methodName: string, descriptor: PropertyDescriptor): any => {
    /* Checks that decorators changes only the methods that returns HTMLElement */
    if (Reflect.getMetadata("design:returntype", constructor, methodName) === HTMLElement) {  
    const origFunction = descriptor.value;
    descriptor.value = function wrapper(...args) {
      let content: HTMLElement = origFunction.apply(this, args);
      content.querySelectorAll(selector).forEach(elem => classNames.forEach(c => elem.classList.add(c)));
      return content;
    }
  }
}
```

The `reflect-metadata` package adds methods to `Reflect`, which is the JavaScript feature that allows objects to be
inspected. `Reflect.getMetadata` method to get the `design:returntype` item to ensure that the decorator only modifies
methods that return HTMLElement objects.

This decorator accepts a `CSS` selector that is used to locate specific elements generated by the method and add them
to one or more classes:
```tsx
import { addClass } from "./decorators";
@addClass("select_elems_by_this", "ddd_this_one_to_all", "and_this_ona_either")
getContent(): HTMLElement {
  return <div className="container-fluid">
    <div className="row">
      <div className="col-3 p-2">
        <CategoryList categories={this.props.categories}
                      selectedCategory={this.props.selectedCategory}
                      callback={this.props.filterCallback!}/>
      </div>
    </div>
  </div>
}
```