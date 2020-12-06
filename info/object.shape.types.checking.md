# Working with Objects
New compilerOption - `suppressExcessPropertyErrors` - prevents the compiler from generating errors for objects that
define properties not in a specified shape.

### Shape
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

### Understanding Union Property Types
So there is little lack of strict types. When a union of shape types is created, the types of each common property
are combined, also using a union.
```typescript
type Product = {
  id: number,
  price: number
};
type Person = {
  id: string,
  city: string
};
type UnionType = {
  id: number | string,
};
let hat = { id: 1, price: 100 };
let bob = { id: "bsmith", city: "London" };
let dataItems: UnionType[] = [hat, bob]; // compiler is ok with diff types that are in the union types arr
dataItems.forEach(item => console.log(`ID: ${item.id}`));
```

So after this mess you may want to add **Type Guards for Objects** \
Since object shape - is TS thing, but `typeof` is JS thing - it's not useful if you want to determine the type of the
object.
```typescript
let dataItems: (Person | Product)[] = [hat, bob];
dataItems.forEach(item => console.log(`ID: ${item.id} Type: ${typeof item}`)); // object object
```
So to find out type we can:
1. use a `in` check for properties. But be sure that you are not checking th e optional property, or property that is 
common for all types it won't give you the accurate result;
2. You can use a type guard function with `is` keyword; 
```typescript
function isPerson(obj: any): obj is Person {
  return obj?.name !== undefined; 
}
dataItems.forEach(item => {
  if(isPerson(item)) {
    console.log(`This is a Person with name: ${item.name}`) // compiler is sure that this is a Person
  }
}
```
It is a `type predicate` if it is true, then the compiler will treat the object as the **specified type**

## Type Intersections
If in _type unions_ you could use only the common methods and properties for united types, as long as the object that 
you are working with has the things that common for those types.
```typescript
  type Man = {
    name: string,
  }

  type Employee = {
    companyName: string,
  }
  
  const man = {name: 'Bob', companyName: 'Google'}
  const objects: (Man & Employee)[] = [man];
  objects.forEach(item => `This is ${item.name}, he works in ${item.companyName}`);
``` 
Compiler won't complain about the narrowed type after intersections as long as narrowed type has the all the needed 
properties.
```typescript
  type Man = {
    name: string
  }

  type Employee = {
    companyName: string
  }
  
  type EmployeeMan = Man & Employee

  const man = {name: 'Bob', companyName: 'Google'}
  const objects: EmployeeMan[] = [man];
  const printMan = (man: Man): void => console.log(`Man name: ${man.name}`);
  const printEmployee = (employee: Employee): void => console.log(`Employee company name: ${employee.companyName}`);
  objects.forEach((item: EmployeeMan) => {
    /* Compiler doesn't care that printMan get's only the Man type, he knows that EmployeeMan has everything that Man needed */
    printMan(item); 
    printEmployee(item);
  });
```  
If types has same properties with same type - no problem, object will have it without any troubles. \
But what if `type A` has `id: string` and `type B` has `id: number` and you made `A & B`? the compiler keeps the 
property name and intersect the types or makes a type `never`, so you cannot assign value there, it was done with the reason.
We can help to add objects with different fields instead of crossed primitive properties in types.
```typescript
type A {
  name: string,
  contact: {phone: number}
}
type B {
  company: string,
  contact: {person: string}
}

const aa: (A & B) = {name: 'Vasya', contact: {phone: 123, person: 'Bob'}} /* compiler happy with  */
/* compoiler will  generate */
declare const aa: {strID: string;} & {numID: number;};
```
Intersection methods, compiler will intersect method signatures.
```typescript
  type Man = {
    action: (name: string) => string
  }

  type Employee = {
    action: (dayOfSalary: number) => number
  }

  type United = Man & Employee

  export const a = ({} as United).action
  /* compoiler will generate */
  declare const a: ((name: string) => string) & ((dayOfSalary: number) => number);
```