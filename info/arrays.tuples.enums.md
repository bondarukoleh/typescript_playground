#Using Arrays, Tuples, and Enums
##Arrays 
You can restrict types that array can contain.
```typescript
const numArr: number[] = [];
// same as
const numArr2:Array<number> = []; // but you cannot use this in tsx files
numArr.push('') // error
// array with type union, but better not to do it. 
const numOrStrArr: (number|string)[] = [];
numOrStrArr.push('');
numOrStrArr.push(1);
```
TS compiler can determine what type if array we are using without the type annotation, abased on values we put there
on initialization.
Try to avoid type unions - it's easy to catch error with them, and empty arrays - empty means `let arr: any = [];`

###Understanding the never Array Type Pitfall
TS determines types for empty arrays differently when `null` and `undefined` values are not assignable to other types.
With `strictNullChecks` enabled it tells the compiler to restrict the use of `null` and `undefined` and prevents the
compiler from using `any` as the type of an empty array it uses `never` type, which means that nothing can be added to
the array.

```typescript
export const emptyArr = [];
// with strictNullChecks
declare const emptyArr: never[];
emptyArr.push(""); // mistype error, string to never 
// without strictNullChecks
declare const emptyArr: any[];
emptyArr.push(""); // ok, whatever
```

##Tuples
Tuples are fixed-length arrays, where each element in the array can have a different type. Tuples are a data structure
that is provided by the TypeScript compiler implemented using regular JavaScript arrays in the compiled code, so we can
use all the Array API here.
```typescript
const numTuple: [number, string] = [1, 'one']
console.log(`Num ${numTuple[0]} called ${numTuple[1]}`);
// we can compbine the types
let products: [string, number][] = [["Hat", 100], ["Gloves", 75]];
let tupleUnion: ([string, number] | boolean)[] = [true, false, hat, ...products];
```

##Enums
An enum allows a collection of values to be used by name, which makes code easier to read and ensures that a fixed set
of values is used consistently.
```typescript
enum Product { Hat, Gloves, Umbrella } /* by default - Hat: 0, Gloves: 1, Umbrella: 2  */
let products: [Product, number][] = [[Product.Hat, 100], [Product.Gloves, 75]];
products.forEach((product: [Product, number]) => {
  if(product[0] === Product.Gloves) {
    console.log(`This is gloves with price ${product[1]}`)
  } 
})
```
Enums kind of object, and you can sometimes mess with it, to create more restricted enum we can use `const enum E {}`
this will be transpiled in slightly different JS. There is `preserveConstEnums` setting by the way.

###Literal Value Types
Set of values that only allowed for this variable.
```typescript
let someVar: 1 | 2 | 3 = 1;
// also in arguments
function some(arg: 1 | 2) {}
// you can combine literal types and value types
enum E {AA, BB}
function some(): 1 | string | true | E.AA {/* implement return */}
```

###Type Aliases
To avoid repetition, you can create your own `type` and use it
```typescript
type comboType = [string, number | true, 1 | 2 | 3][]
const arr: comboType = [["asd", true, 3], ["", 1, 2]]
```