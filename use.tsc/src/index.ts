import {sum, runAsync, weirFunc} from './calc'

function printMsg(message: string): void {
  console.log(`This is your message asdasd: "${message}"`);
}

const msg = 'Hello TypeScript';
printMsg(msg);

const addresses = new Map<string, string>();
addresses.set('Bob', 'Paris');
addresses.forEach((name: string, city: string) => console.log(`${name} lives in ${city}`));

const result = sum(1, 2);
console.log(result);

runAsync().then(console.log)

const res: string | number = weirFunc(1);
console.log(res.toString());

const ress: number = 1;

