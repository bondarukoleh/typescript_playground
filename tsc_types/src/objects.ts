export type Product = {
  name: string,
  price: number,
  opt?: string
}

const p = {name:"asda", price: 1, someOther: "aaa"};
let product: { name: string, price: number} = p;
let hat = { name: "Hat", price: 100 };
let gloves = { name: "Gloves", price: 75 };
let umbrella = { name: "Umbrella", price: 30, waterproof: true };
let products: { name: string, price?: number }[] = [hat, gloves, umbrella];
// products.forEach(prod => console.log(`${prod.name}: ${prod.price}`));

const some: {aa: string, func?(arg: string): boolean} = {func(arg: string): boolean {return true}, aa: ''};

type someT = {req: string, opt?: boolean};
type someOtherT = {required: string, option?: boolean};

const a: someT | someOtherT = {option: true, req: ''};


export {}