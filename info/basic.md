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