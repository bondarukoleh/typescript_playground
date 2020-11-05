import {ToDoItem} from './item';


const item = new ToDoItem({task: 'Do some work', complete: false, id: Math.floor(Math.random() * 1000)})

item.printDetails();

