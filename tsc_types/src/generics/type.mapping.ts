import {City, Person, Product, Employee} from "./dataTypes";

function simpleExample() {
  type MappedProduct = {
    [T in keyof Product]: Product[T]
  };
  let p: MappedProduct = {name: "Kayak", price: 275};
  console.log(`Mapped type: ${p.name}, ${p.price}`);
}
// simpleExample()


function genericTypeParameterMappedType() {
  type Mapped<T> = {
    [P in keyof T]: T[P]
  };

  let p: Mapped<Product> = {name: "Kayak", price: 275};
  console.log(`Mapped type: ${p.name}, ${p.price}`);

  let c: Mapped<City> = {name: "London", population: 8136000};
  console.log(`Mapped type: ${c.name}, ${c.population}`);
}
// genericTypeParameterMappedType()

function changeTheType() {
  type MakeOptional<T> = {
    [P in keyof T]? : T[P]
  };
  type MakeRequired<T> = {
    [P in keyof T]-? : T[P]
  };
  type MakeReadOnly<T> = {
    readonly [P in keyof T] : T[P]
  };
  type MakeReadWrite<T> = {
    -readonly [P in keyof T] : T[P]
  };

  type optionalType = MakeOptional<Product>;
  type requiredType = MakeRequired<optionalType>;
  type readOnlyType = MakeReadOnly<requiredType>;
  type readWriteType = MakeReadWrite<readOnlyType>;
  let p: readWriteType = { name: "Kayak", price: 275};
  console.log(`Mapped type: ${p.name}, ${p.price}`);
}

// changeTheType()

export {}