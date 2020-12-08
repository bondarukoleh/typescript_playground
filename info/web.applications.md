# Creating Web Applications
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


