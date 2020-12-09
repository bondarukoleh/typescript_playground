# Creating Web Applications
The application will retrieve list of products from a web service using an HTTP request. \
The user selects products to assemble an order, which will be sent to the web service.
## Creating a Stand-Alone Web App without a framework
Some new `compilerOptions`
`jsx` - specifies how HTML elements in TSX files are processed \
`jsxFactory` - specifies the name of the factory function that is used to replace HTML elements in TSX files

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
              -> Assets folder  /

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
