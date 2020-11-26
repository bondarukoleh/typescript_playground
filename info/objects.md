#Working with Objects
New compilerOption - `suppressExcessPropertyErrors` - prevents the compiler from generating errors for objects that
define properties not in a specified shape.

###Shape
Compiler same as with other things tries to type everything, so even if you don't provide `type` or `interface` for an
object compiler still set the `shape` as a type for an object
```typescript
let hat = {name: "Some name", price: 100}
/* It will be */
export declare let hat: {
    name: string;
    price: number;
};
``` 
Object Shape Type Annotations. You can declare the types, extra property in initialization value are ignored, compiler
 happy as long as your value is match the type.
```typescript
// let product: { name: string, price: number} = {name:"asda", price: 1, someOther: "aaa"}; - error
/* but this */
const p = {name:"asda", price: 1, someOther: "aaa"};
let product: {name: string, price: number} = p; // no error. What the hell? I don't know.
/* Of cource we can use optional property */
let improvedPrduct: {name: string, price: number, someOther?: string}
// optional functions
let improvedPrduct2: {name: string, price: number, someOther?: string, getSomething?(arg: number): boolean}
```

###Understanding Union Property Types