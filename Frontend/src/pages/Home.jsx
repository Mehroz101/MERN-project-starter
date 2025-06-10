import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Modal from "../components/Modal";
import SingleFileUpload from "../components/SingleFileUpload";
import { notify } from "../utils/notification";

const Home = () => {
  const [todos, setTodos] = useState([]); // Start with empty, fetch from API
  const [showModal, setShowModal] = useState(false);
  const [file, setFile] = useState(null); // controlled file state
  const [editTodo, setEditTodo] = useState(null); // for editing
  const [imgPreviewUrl, setImgPreviewUrl] = useState(null); // for edit mode preview
  const [search, setSearch] = useState(""); // search state
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Fetch todos from backend on mount
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/todos", { headers: getAuthHeader() })
      .then((res) => {
        if (res.data.success) {
          setTodos(res.data.todos);
        }
      })
      .catch(() => {
        setTodos([]);
        notify("error", "Failed to load todos");
      });
  }, []);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    if (file) formData.append("img", file);
    try {
      if (editTodo) {
        // Edit mode
        const res = await axios.put(
          `http://localhost:5000/api/todos/${editTodo._id || editTodo.id}`,
          formData,
          { headers: { ...getAuthHeader(), "Content-Type": "multipart/form-data" } }
        );
        if (res.data.success) {
          setTodos(
            todos.map((t) =>
              (t._id || t.id) === (editTodo._id || editTodo.id) ? res.data.todo : t
            )
          );
          notify("success", "Todo updated successfully");
        }
      } else {
        // Create mode
        const res = await axios.post("http://localhost:5000/api/todos", formData, {
          headers: { ...getAuthHeader(), "Content-Type": "multipart/form-data" },
        });
        if (res.data.success) {
          setTodos([res.data.todo, ...todos]);
          notify("success", "Todo created successfully");
        }
      }
      setShowModal(false);
      reset();
      setFile(null);
      setEditTodo(null);
      setImgPreviewUrl(null);
    } catch (err) {
      notify("error", "Error saving todo");
      console.error("Error saving todo:", err);
    }
  };

  const handleEdit = (todo) => {
    setEditTodo(todo);
    setShowModal(true);
    setValue("title", todo.title);
    setFile(null); // Don't prefill file, keep it null unless changed
    // Set preview URL for existing image
    if (todo.img && todo.img.startsWith("/uploads/")) {
      setImgPreviewUrl(`http://localhost:5000${todo.img}`);
    } else if (todo.img) {
      setImgPreviewUrl(todo.img);
    } else {
      setImgPreviewUrl(null);
    }
  };

  const handleDelete = async (todoId) => {
    try {
      await axios.delete(`http://localhost:5000/api/todos/${todoId}`, { headers: getAuthHeader() });
      setTodos(todos.filter((t) => (t._id || t.id) !== todoId));
      notify("success", "Todo deleted successfully");
    } catch (err) {
      notify("error", "Error deleting todo");
      console.error("Error deleting todo:", err);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    reset();
    setFile(null);
    setEditTodo(null);
    setImgPreviewUrl(null);
  };

  // When a new file is selected, clear the preview of the old image
  const handleFileChange = (f) => {
    setFile(f);
    if (f) setImgPreviewUrl(null);
  };

  // Filter todos by search
  const filteredTodos = search.trim()
    ? todos.filter((todo) =>
        todo.title.toLowerCase().includes(search.trim().toLowerCase())
      )
    : todos;

  return (
    <>
      <h1 className="text-center text-3xl font-bold mb-4">TODO APP</h1>
      <div className="mx-auto flex flex-column align-items-center gap-4 p-4">
        <button
          className="p-button p-button-success mb-2 align-self-end"
          onClick={() => setShowModal(true)}
        >
          + Create New Todo
        </button>
        <div className="searchTodo w-full md:w-6 flex justify-content-center mb-4">
          <input
            type="search"
            placeholder="search..."
            className="p-inputtext p-component w-full md:w-20rem"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="todoContainer w-full md:w-6 flex flex-column gap-3">
          {filteredTodos.map((todo) => (
            <div
              className="todoBox flex align-items-center gap-4 p-3 border-round shadow-2 bg-white"
              key={todo._id || todo.id}
            >
              <div className="img flex align-items-center justify-content-center w-4rem h-4rem border-circle overflow-hidden bg-gray-200">
                <img
                  src={
                    todo.img?.startsWith("/uploads/")
                      ? `http://localhost:5000${todo.img}`
                      : todo.img || "https://via.placeholder.com/64"
                  }
                  alt="Todo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="title flex-1 text-lg font-medium text-gray-800">
                {todo.title}
              </div>
              <div className="actionBtn flex gap-2">
                <button
                  className="p-button p-button-sm p-button-info"
                  onClick={() => handleEdit(todo)}
                >
                  edit
                </button>
                <button
                  className="p-button p-button-sm p-button-danger"
                  onClick={() => handleDelete(todo._id || todo.id)}
                >
                  delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Modal
        visible={showModal}
        onClose={handleModalClose}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-column gap-3"
        >
          <label className="font-medium">Title</label>
          <input
            className="p-inputtext p-component"
            {...register("title", { required: "Title is required" })}
            placeholder="Enter todo title"
          />
          {errors.title && (
            <span className="text-red-500 text-xs">{errors.title.message}</span>
          )}
          <label className="font-medium mt-2">Image</label>
          <SingleFileUpload
            value={file}
            onChange={handleFileChange}
            accept="image/*"
            errorMessage="Please select an image file"
            height="8rem"
            chooseBtnLabel="Choose Image"
            changeBtnLabel="Change Image"
            previewUrl={imgPreviewUrl}
          />
          <button className="p-button p-button-success mt-2" type="submit">
            {editTodo ? "Update Todo" : "Add Todo"}
          </button>
        </form>
      </Modal>
    </>
  );
};

export default Home;
