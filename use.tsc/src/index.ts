import {sum, runAsync} from './calc'

function printMsg(message: string): void {
  console.log(`This is your message: "${message}"`);
}

const msg = 'Hello TypeScript';
printMsg(msg);

const addresses = new Map<string, string>();
addresses.set('Bob', 'Paris');
addresses.forEach((name: string, city: string) => console.log(`${name} lives in ${city}`));

const result = sum(1, 2);
console.log(result);

runAsync().then(console.log)
