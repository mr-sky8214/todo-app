import { useEffect, useState } from "react";
import { deleteTodoApi, retrieveAllTodosForUsernameApi } from "./api/TodoApiService";
import { useAuth } from "./security/AuthContext";

export default function ListTodosComponent() {
    const today = new Date();
    const targetDate = new Date(today.getFullYear() + 12, today.getMonth(), today.getDay());

    const authContext = useAuth();

    const username = authContext.username

    const [todos, setTodos] = useState([])

    const [message, setMessage] = useState(null)

    useEffect( () => refreshTodos(), [] )

    function refreshTodos() {
        retrieveAllTodosForUsernameApi(username)
            .then(response => {
                setTodos(response.data);
            })
            .catch(error => console.log(error))
    }
    

    function deleteTodo(id) {
        console.log("delete todo called " + id);
        deleteTodoApi(username, id)
        .then(
            () => {
                setMessage(`Delete of todo with id ${id} successful`)
                refreshTodos()
            }
            //1: display message
            //2: Update Todos List
        )
        .catch(error => console.log(error))
    }

    return (
        <div className="contain">
            <h1>Things you want to Do!</h1>
            {message && <div className="alert alert-warning">{message}</div>}
            <div>
                <table className='table'>
                    <thead>
                        <tr>
                            <th>DESCRIPTION</th>
                            <th>IS DONE?</th>
                            <th>TARGET DATE</th>
                            <th>DELETE</th>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            todos.map(
                                todo => (
                                    <tr key={todo.id}>
                                        <td>{todo.description}</td>
                                        <td>{todo.done.toString()}</td>
                                        <td>{todo.targetDate}</td>
                                        <td><button className="btn btn-warning" onClick={() => deleteTodo(todo.id)}>Delete</button></td>
                                    </tr>
                                )
                            )
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}