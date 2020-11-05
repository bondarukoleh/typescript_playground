import {ItemCollection} from './items/ItemCollection';

const collectionName = 'Work';
const itemTask = 'Learn TS';
const id = 1;

const itemCollection = new ItemCollection(collectionName);
itemCollection.addItem(itemTask, id);
itemCollection.completeTask(id);

