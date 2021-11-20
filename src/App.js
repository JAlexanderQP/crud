import React, { useState, useEffect } from "react";
import { isEmpty, size } from "lodash";
import shortid from "shortid";
import Dexie from "dexie";
import Swal from "sweetalert2";
import toast, { Toaster } from "react-hot-toast";

function App() {
  //Creo la Base de datos
  //DEXIE
  const db = new Dexie("bdTareas");
  //Creo las collecciones (Tablas para guardar)
  db.version(1).stores({
    tareas: "id, task",
  });
  db.open().catch((err) => {
    console.log(err.stack || err);
  });

  const [task, setTask] = useState(""); // Tarea Nueva
  const [tasks, setTasks] = useState([]); // Lista de tareas
  const [editMode, setEditMode] = useState(false); //Para saber cuando se editar
  const [id, setId] = useState(""); // Para identificar cual es el que se va a editar

  const fechaHoy = new Date();

  useEffect(() => {
    //Mostrar toas las tareas
    //DEXIE MOSTRAR TODAS
    const getTasks = async () => {
      let allTask = await db.tareas.toArray();
      setTasks(allTask);
    };
    getTasks();
  }, []);

  const addTask = (e) => {
    e.preventDefault();
    if (isEmpty(task)) {
      //alert("El campo tarea esta vacio");
      toast.error("El campo tarea esta vacio");
      return;
    }

    const newTask = {
      id: shortid.generate(),
      create: fechaHoy.toLocaleDateString(),
      name: task,
    };

    //Al arreglo de tareas agregame la nueva tarea
    setTasks([...tasks, newTask]);
    //DEXIE GUARDAR
    db.tareas.add(newTask).then(async () => {
      let allTask = await db.tareas.toArray();
      setTasks(allTask);
    });
    setTask("");
  };

  const DeleteTask = async (id) => {
    Swal.fire({
      title: "Atención",
      text: "Estas seguro que quieres eliminar esta tarea",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Si, borrar tarea!",
    }).then((result) => {
      if (result.isConfirmed) {
        // alert("ID a eliminar: " + id);
        //const filteredTask = tasks.filter((task) => task.id !== id);
        //setTasks(filteredTask);

        /*   db.tareas.delete(id);
        let allTasks = db.tareas.toArray();
        setTasks(allTasks); */
        //DEXIE ELIMINAR
        db.tareas.delete(id).then(async () => {
          let allTask = await db.tareas.toArray();
          setTasks(allTask);
        });
        setTask("");

        Swal.fire(
          "Eliminado!",
          "La tarea fue eliminada correctamente.",
          "success"
        );
      }
    });
  };

  const editTask = async (theTask) => {
    // alert("ID a eliminar: " + id);

    // await db.friends.put({ id: 4, name: "Foo", age: 33 });
    setTask(theTask.name);

    //console.log(theTask.name);

    /* db.tareas.update(theTask.id, { name: theTask.name }).then(async () => {
      let allTask = await db.tareas.toArray();
      setTasks(allTask);
    }); */

    setEditMode(true);
    setId(theTask.id);
  };

  //Guarda la tarea a actaalizar
  const saveTask = (e) => {
    e.preventDefault();
    if (isEmpty(task)) {
      toast.error("El campo tarea esta vacio");
      return;
    }

    const editedTasks = tasks.map((item) =>
      item.id === id ? { id, name: task } : item
    );

    //DEXIE ACTUALIZAR
    db.tareas.update(id, { name: task }).then((updated) => {
      if (updated) toast.success("Actualizado correctamente");
      else toast.error("No se encontro el registro");
    });
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
          <form onSubmit={editMode ? saveTask : addTask} autoComplete="off">
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
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          // Define default options
          className: "",
          duration: 5000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          // Default options for specific types
          success: {
            duration: 3000,
            theme: {
              primary: "green",
              secondary: "black",
            },
          },
        }}
      />
    </div>
  );
}

export default App;
