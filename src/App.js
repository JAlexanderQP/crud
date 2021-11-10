import React, { useState } from "react";
import { isEmpty } from "lodash";
import shortid from "shortid";

function App() {
  const [task, setTask] = useState(""); // Tarea Nueva
  const [tasks, setTasks] = useState([]); // Lista de tareas
  const addTask = (e) => {
    e.preventDefault();
    if (isEmpty(task)) {
      console.log("Tarea vacia");
      return;
    }

    const newTask = {
      id: shortid.generate(),
      name: task,
    };

    //Al arreglo de tareas agregame la nueva tarea
    setTasks([...tasks, newTask]);
    setTask("");
  };

  return (
    <div className="container mt-5">
      <h1>Tareas</h1>
      <hr />
      <div className="row">
        <div className="col-12 col-md-4">
          <h4 className="text-center">Formulario</h4>
          <form onSubmit={addTask}>
            <input
              type="text"
              name="tarea"
              id="tarea"
              className="form-control mb-2"
              placeholder="Ingrese la tarea..."
              onChange={(text) => setTask(text.target.value)}
              value={task}
            />
            <button className="btn btn-dark btn-block" type="submit">
              Agregar
            </button>
          </form>
          <br />
          <br />
        </div>
        <div className="col-12 col-md-8">
          <h4 className="text-center">Lista de tareas</h4>
          <ul className="list-group">
            {tasks.map((task) => (
              <li className="list-group-item" key={task.id}>
                <span className="lead"> {task.name}</span>
                <button className="btn btn-danger btn-sm float-right mx-2">
                  Eliminar
                </button>
                <button className="btn btn-warning btn-sm float-right">
                  Editar
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
