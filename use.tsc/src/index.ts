function printMsg(msg: string): void {
  console.log(`This is your message: "${msg}"`);
}

let msg = 'Hello TypeScript';
printMsg(msg);

const addresses = new Map<string, string>();
addresses.set('Bob', 'Paris');

addresses.forEach((name: string, city: string) => console.log(`${name} lives in ${city}`));
