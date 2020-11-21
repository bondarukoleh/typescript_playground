##Functions
Couple of new compilerOptions
`noImplicitReturns` - requires all paths in a function to return a result. \
`noUnusedParameters` - causes the compiler to produce a warning if a function defines parameters that are not used.

JavaScript doesn’t support function overloading, so last function will override previous, TS doesn't allow duplicating
functions.
```typescript
function a(){};
function a(){}; /* Duplicate function implementation error */ 
```
Also, in TS you cannot call the function with different amount of arguments then it is declared, by default. \
You can use optional parameters. Optional parameters must be defined after the required parameters. \
You cannot add to optional parameter default-initialized parameter. \
Rest parameter allowed only one and only in the end, which is logical. The array will always be initialized and will
contain no items if there were no extra arguments.
```typescript
function a (arg1, arg2: boolean = true, arg2?: string, ...rest) { console.log(arg) }
```
###Type Annotations to Function Parameters
```typescript
function a (arg1: number, ...rest: number[]) { console.log(arg) }
```
If you faced with null values use parameters types union or types guard in function realization.

###Function Results
TS compiler will try to decide the result `type` from the function and will automatically use type unions if a
function can return multiple types. To see how compiler sees it - use
We can enable noImplicitReturns - to be more strict with returned result.
```typescript
/* noImplicitReturns enabled */
export const someFunc = (...rest): boolean | undefined => {
  if (rest.length) {
    return true
  }
  return undefined;
}  
```
