import {City, Person, Product, Employee} from "./dataTypes";

function basicExample() {
  type resultType<T extends boolean> = T extends true ? string : number;
  let firstVal: resultType<true> = "String Value";
  let secondVal: resultType<false> = 100;
  // let mismatchCheck: resultType<false> = "String Value"; /* Type 'string' is not assignable to type 'number'. */
}

function condInClass() {
  type resultType<T extends boolean> = T extends true ? string : number;
  class Collection<T> {
    private items: T[];
    constructor(...initialItems: T[]) {
      this.items = initialItems || [];
    }
    total<P extends keyof T, U extends boolean>(propName: P, format: U): resultType<U> {
      let totalValue = this.items.reduce((t, item) => t += Number(item[propName]), 0);
      return format ? `$${totalValue.toFixed()}` : totalValue as any;
    }
  }

  let data = new Collection<Product>(new Product("Kayak", 275), new Product("Lifejacket", 48.95));
  let firstVal: string = data.total("price", true);
  console.log(`Type of formatted value: ${typeof firstVal}`); // string
  let secondVal: number = data.total("price", false);
  console.log(`Type of unformatted value: ${typeof secondVal}`); // number
}

// condInClass()

export {}