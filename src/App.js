import React, { useState } from "react";
import { isEmpty, size } from "lodash";
import shortid from "shortid";

function App() {
  const [task, setTask] = useState(""); // Tarea Nueva
  const [tasks, setTasks] = useState([]); // Lista de tareas
  const [editMode, setEditMode] = useState(false); //Para saber cuando se editar
  const [id, setId] = useState(""); // Para identificar cual es el que se va a editar

  const addTask = (e) => {
    e.preventDefault();
    if (isEmpty(task)) {
      alert("El campo tarea esta vacio");
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

  const DeleteTask = (id) => {
    // alert("ID a eliminar: " + id);
    const filteredTask = tasks.filter((task) => task.id !== id);
    setTasks(filteredTask);
  };

  const editTask = (theTask) => {
    // alert("ID a eliminar: " + id);
    setTask(theTask.name);

    setEditMode(true);
    setId(theTask.id);
  };

  //Guarda la tarea a actaalizar
  const saveTask = (e) => {
    e.preventDefault();
    if (isEmpty(task)) {
      alert("El campo tarea esta vacio");
      return;
    }

    const editedTasks = tasks.map((item) =>
      item.id === id ? { id, name: task } : item
    );
    setTasks(editedTasks);
    setEditMode(false);
    setTask("");
    setId("");
  };

  return (
    <div className="container mt-5">
      <h1>Tareas</h1>
      <hr />
      <div className="row">
        <div className="col-12 col-md-4">
          <h4 className="text-center">
            {editMode ? "Modificar tarea" : "Agregar tarea"}
          </h4>
          <form onSubmit={editMode ? saveTask : addTask} autocomplete="off">
            <input
              type="text"
              name="tarea"
              id="tarea"
              className="form-control mb-2"
              placeholder="Ingrese la tarea..."
              onChange={(text) => setTask(text.target.value)}
              value={task}
            />
            <button
              className={
                editMode
                  ? "btn btn-warning btn-block"
                  : "btn btn-dark btn-block"
              }
              type="submit"
            >
              {editMode ? "Guardar" : "Agregar"}
            </button>
          </form>
          <br />
          <br />
        </div>
        <div className="col-12 col-md-8">
          <h4 className="text-center">Lista de tareas</h4>
          {size(tasks) === 0 ? (
            <li className="list-group-item">Sin tareas programadas</li>
          ) : (
            <ul className="list-group">
              {tasks.map((task) => (
                <li className="list-group-item" key={task.id}>
                  <span className="lead"> {task.name}</span>
                  <button
                    className="btn btn-danger btn-sm float-right mx-2"
                    onClick={() => DeleteTask(task.id)}
                  >
                    Eliminar
                  </button>
                  <button
                    className="btn btn-warning btn-sm float-right"
                    onClick={() => editTask(task)}
                  >
                    Editar
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
