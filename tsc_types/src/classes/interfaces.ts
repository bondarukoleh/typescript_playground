interface ISome {
  req: string,
  opt?: string,
  func(arg: string[]): void,
  func2: () => void;
}

type Some = {
  req: string,
  opt?: string,
  func(arg: string[]): void,
  func2: () => void;
}

interface Person {
  name: string;
  getDetails(): string;
}
interface DogOwner {
  dogName: string;
  getDogDetails(): string;
}
class Employee implements Person {
  constructor(public readonly id: string, public name: string,
              private dept: string, public city: string) {
  }
  getDetails() {
    return `${this.name} works in ${this.dept}`;
  }
}
class Customer implements Person, DogOwner {
  constructor(public readonly id: string, public name: string,
              public city: string, public creditLimit: number,
              public dogName ) {
  }
  getDetails() {
    return `${this.name} has ${this.creditLimit} limit`;
  }
  getDogDetails() {
    return `${this.name} has a dog named ${this.dogName}`;
  }
}
let alice = new Customer("ajones", "Alice Jones", "London", 500, "Fido");
let dogOwners: DogOwner[] = [alice];
// dogOwners.forEach(item => console.log(item.getDogDetails()));
// let data: Person[] = [new Employee("fvega", "Fidel Vega", "Sales", "Paris"), alice];
// data.forEach(item => console.log(item.getDetails()));


interface IA {
  id: string
}

interface IB {
  id: number
}

// class A implements IA, IB {
  // id = 1;
// }

/* Index signature */
class A {
  // constructor(public some: string){}

  [dynamicProp: number]: number | string
}

const a  = new A();
a[1] = 1;
a[3] = 3;
a[4] = "123";

// console.log(Object.entries(a))

export {}