function calculateTax(amount: number): number {
  return amount * 1.2;
}

function writePrice(product: string, price: number): void {
  console.log(`Price for ${product}: $${price.toFixed(2)}`);
}

let hatPrice = 100;
let glovesPrice = 75;
let umbrellaPrice = 42;

writePrice("Hat", calculateTax(hatPrice));
writePrice("Gloves", calculateTax(glovesPrice));
writePrice("Umbrella", calculateTax(umbrellaPrice));

const numArr: number[] = [];
// numArr.push("")
const numOrStrArr: (number| string)[] = [];
numOrStrArr.push('');
numOrStrArr.push(1);

export const numArray = [1];
export const mixArray = [1, "asda", {'asd': 213}];
export const emptyArr = []; //declare const emptyArr: never[]; vs declare const emptyArr: any[];
const aa = 'str';
// emptyArr.push(aa);


const numTuple: [number, string] = [1, 'one']
// console.log(`Num "${numTuple[0]}" called "${numTuple[1]}"`)
numTuple.push(1)
// console.log(numTuple)


enum Values {
  A, B, C
}

console.log(Values.A)

export {}