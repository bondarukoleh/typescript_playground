function calculateTax(amount: number) {
  return amount * 1.2;
}

function dumb(arg: any): any {
  return arg.toFixed();
}
const price = 100;
const taxAmount = calculateTax(price);

const res = dumb("qwe");
const reset: number = res;