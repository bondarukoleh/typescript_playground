// class Human {
//   constructor(public name: string, public address: string) {
//   }
//
//   public sayHello(name: string): void {
//     console.log(`Hello to ${name} from ${this.name}`)
//   }
// }
//
// class Employee extends Human {
//   constructor(public name: string, public address: string, public workType: string) {
//     super(name, address);
//   }
//
//   public doWork(): void {
//     console.log(`${this.name} is working...`)
//   }
// }
//
// const workers: Employee[] = [
//   new Employee("Bob", "Some st. 21b", "plumber")
// ];
//
// workers.forEach((worker: Employee) => {
//   worker.sayHello('Some guy');
//   worker.doWork();
// })

class Person {
  constructor(public id: string, public name: string,
              public city: string) { }
}

class Employee extends Person {
  constructor(public readonly id: string, public name: string,
              private dept: string, public city: string) {
    super(id, name, city);
  }
  writeDept() {
    console.log(`${this.name} works in ${this.dept}`);
  }
}
class Customer extends Person {
  constructor(public readonly id: string, public name: string,
              public city: string, public creditLimit: number) {
    super(id, name, city);
  }
}
class Supplier extends Person {
  constructor(public readonly id: string, public name: string,
              public city: string, public companyName: string) {
    super(id, name, city);
  }
}
let data = [new Person("asd", "sd", 'asda'), new Employee("fvega", "Fidel Vega", "Sales", "Paris"),
  new Customer("ajones", "Alice Jones", "London", 500)];
data.push(new Supplier("dpeters", "Dora Peters", "New York", "Acme"));
// data.forEach(item => {
//   console.log(`Person: ${item.name}, ${item.city}`);
//   if (item instanceof Employee) {
//     item.writeDept();
//   } else if (item instanceof Customer) {
//     console.log(`Customer ${item.name} has ${item.creditLimit} limit`);
//   } else if (item instanceof Supplier) {
//     console.log(`Supplier ${item.name} works for ${item.companyName}`);
//   }
// });

class A { constructor(public a: string) {} }
class B extends A { constructor(public a: string, public b: string) { super(a) } }
class C extends A { constructor(public a: string, public c: string) { super(a) } }
export const arr = [new B("a", "b"), new C("a", "c")];
// arr will be
// export declare const arr: A[];


class AA {
  public someVariable: string;

  constructor() {
    Object.defineProperty(this, 'someVariable',  {
      configurable: true,
      enumerable: true,
      writable: true
    })
  }

  someParentMethod(){
    console.log('Hi');
  }
}

class BB extends AA {
  constructor() {
    super();
  }

  someMethod(){
    // console.log(super.someVariable); // TS2340: Only public and protected methods of the base class are accessible via the 'super' keyword.
    super.someParentMethod(); // this will print HI
  }
}

// new BB().someMethod()

export {}

