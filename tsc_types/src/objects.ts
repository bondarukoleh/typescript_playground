import {type} from "os";
import {strict} from "assert";

type Product = {
  id: number,
  name: string,
  price?: number
};
type Person = {
  id: string,
  name: string,
  city: string
};

function typeAnnotations() {
  const p = {name: "asda", price: 1, someOther: "aaa"};
  let product: { name: string, price: number } = p;
  let hat = {name: "Hat", price: 100};
  let gloves = {name: "Gloves", price: 75};
  let umbrella = {name: "Umbrella", price: 30, waterproof: true};
  let products: { name: string, price?: number }[] = [hat, gloves, umbrella];
  products.forEach(prod => console.log(`${prod.name}: ${prod.price}`));
}

function types() {
  const some: { aa: string, func?(arg: string): boolean } = {
    func(arg: string): boolean {
      return true
    }, aa: ''
  };

  type someT = { req: string, opt?: boolean };
  type someOtherT = { required: string, option?: boolean };

  const a: someT | someOtherT = {option: true, req: ''};

}

function types2() {
  type UnionType = {
    id: number | string,
    name: string
  };
  let hat: Product = {id: 1, name: "Hat", price: 100};
  let gloves: Product = {id: 2, name: "Gloves", price: 75};
  let umbrella: Product = {id: 3, name: "Umbrella", price: 30};
  let bob: Person = {id: "bsmith", name: "Bob", city: "London"};
  let dataItems: UnionType[] = [hat, gloves, umbrella, bob];
  dataItems.forEach(item => console.log(`ID: ${item.id} Type: ${typeof item}`));
}

function types3() {
  let hat: Product = {id: 1, name: "Hat", price: 100};
  let bob: Person = {id: "bsmith", name: "Bob", city: "London"};

  function isPerson(obj: any): obj is Person {
    return obj?.city !== undefined;
  }

  let dataItems: (Product | Person)[] = [hat, bob];
  dataItems.forEach(item => {
    if (isPerson(item)) {
      console.log(`This is a Person with name: ${item.name} lives in ${item.city}`) // compiler is sure that this is a
                                                                                    // Person
    }
  })
}

// types3()

function intersections() {
  type Man = {
    name: string,
    sayHello: (name: string) => void;
  }

  type Employee = {
    companyName: string,
    work: () => void;
  }

  const man = {name: 'Bob', sayHello: (name: string) => {`Hello, ${name}!`}, companyName: 'Google', work: () => console.log('Working...')}
  const objects: (Man & Employee)[] = [man];
  objects.forEach(item => `This is ${item.name}, he works in ${item.companyName}`);
}

function intersectionSameProps() {
  type Man = {
    name: string,
    // id: string
    fixedID: {strID: string}
  }

  type Employee = {
    companyName: string,
    // id: number,
    fixedID: {numID: number}
  }

  type United = Man & Employee

  // const man: United = {name: 'Bob', companyName: 'Google', id: 123} /* Type 'number' is not assignable to type 'never' */
  const man: United = {name: 'Bob', companyName: 'Google', fixedID: {numID: 123, strID: '123'}}
  const a = ({} as United).fixedID
}

// intersectionsSameProps()

// function intersectionSameMethods() {
  type Man = {
    action: (name: string) => string
  }

  type Employee = {
    action: (dayOfSalary: number) => number
  }

  type United = Man & Employee

  export const a = ({} as United).action
// }

export {}