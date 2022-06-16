import React, { useEffect, useReducer, useRef, useState } from "react";

import reducer, { initialState } from "./store/reducer";
import {
	setTodos,
	createTodo,
	toggleAllTodos,
	deleteAllTodos,
	updateTodoStatus,
	deleteTodo,
} from "./store/actions";
import Service from "./service";
import { TodoStatus } from "./models/todo";

type EnhanceTodoStatus = TodoStatus | "COMPLETED";

const ToDoPage = () => {
	const [{ todos }, dispatch] = useReducer(reducer, initialState);
	const [showing, setShowing] = useState<EnhanceTodoStatus>("COMPLETED");
	const inputRef = useRef<any>(null);

	useEffect(() => {
		(async () => {
			const localTodos = localStorage.getItem("todos");
			const data = localTodos !== null ? JSON.parse(localTodos) : [];
            //console.log(data);
			const resp = await Service.getTodos(data);
            // console.log(resp);
			dispatch(setTodos(data));
		})();
	}, []);

	const onCreateTodo = async (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			const resp = await Service.createTodo(inputRef.current.value);
			dispatch(createTodo(resp));
			inputRef.current.value = "";
		}
	};

	const onUpdateTodoStatus = (
		e: React.ChangeEvent<HTMLInputElement>,
		todoId: any
	) => {
		dispatch(updateTodoStatus(todoId, e.target.checked));
	};

	const onToggleAllTodo = (e: React.ChangeEvent<HTMLInputElement>) => {
        
		dispatch(toggleAllTodos(e.target.checked));
	};

	const onDeleteAllTodo = () => {
		dispatch(deleteAllTodos());
	};

	const onDeleteTodo = (todoId: any) => {
		dispatch(deleteTodo(todoId));
	};

	return (
		<div className="ToDo__container">
			<div className="Todo__creation">
				<input
					ref={inputRef}
					className="Todo__input"
					placeholder="What need to be done?"
					onKeyUp={onCreateTodo}
				/>
			</div>
			<div className="ToDo__list">
				{todos.map((todo, index) => {
					return (
						<div key={index} className="ToDo__item">
							<input
								type="checkbox"
								checked={showing === todo.status}
								onChange={(e) => onUpdateTodoStatus(e, todo.id)}
							/>
							<span>{todo.content}</span>
							<button
								onClick={() => onDeleteTodo(todo.id)}
								className="Todo__delete"
							>
								X
							</button>
						</div>
					);
				})}
			</div>
			<div className="Todo__toolbar">
				{todos.length > 0 ? (
					<input type="checkbox" onChange={onToggleAllTodo} />
				) : (
					<div />
				)}
				<div className="Todo__tabs">
					{/* <button className="Action__btn" onClick={() => onToggleAllTodo}>
                        All
                    </button>
                    <button className="Action__btn" onClick={()=>setShowing(TodoStatus.ACTIVE)}>
                        Active
                    </button>
                    <button className="Action__btn" onClick={()=>setShowing(TodoStatus.COMPLETED)}>
                        Completed
                    </button> */}
				</div>
				<button className="Action__btn" onClick={onDeleteAllTodo}>
					Clear all todos
				</button>
			</div>
		</div>
	);
};

export default ToDoPage;
