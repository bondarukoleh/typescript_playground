# Creating a React App
Some new compiler options:

|name|description|
|:---|:---|
|`allowSyntheticDefaultImports`|allows imports from modules that do not declare a default export. This option is used to increase code compatibility.|
|`esModuleInterop`|adds helper code for importing from modules that do not declare a default export and is used with `allowSyntheticDefaultImports`|
|`forceConsistentCasingInFileNames`|ensures that names in `import` statements match the case used by the imported file|
|`isolatedModules`|treats each file as a separate module, which increases compatibility with the Babel tool|
|`resolveJsonModule`|allows JSON files to be imported as though they were modules|
|`skipLibCheck`|speeds up compilation by skipping the normal checking of declaration files|
|`strict`|enables stricter checking of TypeScript code|

To create app with TS
```shell
create-react-app reactapp --typescript
```

