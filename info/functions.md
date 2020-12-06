## Functions
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
### Type Annotations to Function Parameters
```typescript
function a (arg1: number, ...rest: number[]) { console.log(arg) }
```
If you faced with null values use parameters types union or types guard in function realization.

### Function Results
TS compiler will try to decide the result `type` from the function and will automatically use type unions if a
function can return multiple types. To see how compiler sees it - use
We can enable noImplicitReturns - to be more strict with returned result.
Functions without result - `void`, tsc warn you if you want to have something from these functions.
We can also use `never` as return type annotation for functions that shouldn't complete, like function that should throw
an error. 
```typescript
/* noImplicitReturns enabled */
export const someFunc = (...rest): boolean | undefined => {
  if (rest.length) {
    return true
  }
  return undefined;
}
function some(): void {}
function some(): never {}
```

### Overloading Function Types
Type unions don't describe the relations of the different types that function can return, and function user forced to
use the type guards If there some relations. Between the arguments and the function results it is easy to show them
with overloading. But be careful, you need to watch the same signature for the types overload. \
This is not the same as in C# or Java, you still have one implementation, but the types can be different. Argument types
and return type creating the **type combination**
```typescript
/* Here we don't understand the relation */
function returnNumOrStr (arg: number | string): number | string {
  return typeof arg == 'number' ? 100 : `100`; // as dumb as ... I don't even have a comparison 
}
/* Here we can avoid type guard wen we are using this function */
function returnNumOrStr (arg: number): number;
function returnNumOrStr (arg: string): string;
function returnNumOrStr (arg: string | number): string | number {
  return typeof arg == 'number' ? 100 : `100`;
}
```
