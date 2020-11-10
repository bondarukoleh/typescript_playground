import {ItemCollection} from './items/ItemCollection';
import * as inquirer from 'inquirer'

enum Commands {
  Quit = 'Quit'
}

function displayToDoList(list: ItemCollection): void {
  console.log(`${list.name} todo list, ${list.getCount()} items todo.`);
  list.getItems().forEach(item => item.printDetails())
}

function promptUser(collection: ItemCollection): void {
  const promptConf = {type: 'list', name: 'command', message: 'Choose option', choices: Object.values(Commands)};

  console.clear();
  displayToDoList(collection);
  // @ts-ignore
  inquirer.prompt(promptConf).then(answers => {
    if (answers['command'] !== Commands.Quit) {
      promptUser(collection);
    }
  });
}


const itemCollection = new ItemCollection('John Work');
itemCollection.addItem('Learn TS', 1);
itemCollection.addItem('Create project', 2);
itemCollection.completeTask(1);
// itemCollection.removeCompleted();
// console.log(itemCollection.getCount())

// promptUser(itemCollection);

const returnString = () => "string";
const num = returnString() as unknown as number;
num.toFixed();

