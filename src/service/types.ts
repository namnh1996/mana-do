import {Todo} from '../models/todo';

export abstract class IAPI {
    abstract getTodos(todos: Array<Todo>) : Promise<Array<Todo>>
    abstract createTodo(content: string) : Promise<Todo>
}