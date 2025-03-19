import React, { useState, useEffect } from 'react';

interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  created_at: string;
}

const TodoComponent: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newTodo, setNewTodo] = useState({
    title: '',
    description: '',
    completed: false,
  });

  // Fetch todos from API
  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/todos/');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setTodos(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch todos');
      console.error('Error fetching todos:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create new todo
  const createTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTodo.title.trim()) {
      setError('Title is required');
      return;
    }
    
    try {
      const response = await fetch('http://localhost:8000/api/todos/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTodo),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      setNewTodo({ title: '', description: '', completed: false });
      fetchTodos();
      setError(null);
    } catch (err) {
      setError('Failed to create todo');
      console.error('Error creating todo:', err);
    }
  };

  // Toggle todo completion status
  const toggleComplete = async (todo: Todo) => {
    try {
      const response = await fetch(`http://localhost:8000/api/todos/${todo.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...todo,
          completed: !todo.completed,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      fetchTodos();
    } catch (err) {
      setError('Failed to update todo');
      console.error('Error updating todo:', err);
    }
  };

  // Delete todo
  const deleteTodo = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8000/api/todos/${id}/`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      fetchTodos();
    } catch (err) {
      setError('Failed to delete todo');
      console.error('Error deleting todo:', err);
    }
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewTodo(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle checkbox change
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodo(prev => ({
      ...prev,
      completed: e.target.checked,
    }));
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Todo List</h1>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}
      
      {/* Todo Form */}
      <div className="mb-8 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Add New Todo</h2>
        <form onSubmit={createTodo}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
              Title:
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={newTodo.title}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter todo title"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
              Description:
            </label>
            <textarea
              id="description"
              name="description"
              value={newTodo.description}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter todo description"
              rows={3}
            />
          </div>
          
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="completed"
              name="completed"
              checked={newTodo.completed}
              onChange={handleCheckboxChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="completed" className="ml-2 block text-gray-700 text-sm font-bold">
              Completed
            </label>
          </div>
          
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            Add Todo
          </button>
        </form>
      </div>
      
      {/* Todo List */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Your Todos</h2>
        
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : todos.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No todos yet. Add one above!</p>
        ) : (
          <div className="space-y-4">
            {todos.map(todo => (
              <div 
                key={todo.id} 
                className={`border-l-4 ${todo.completed ? 'border-green-500' : 'border-blue-500'} bg-gray-50 p-4 rounded-md shadow-sm`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className={`text-lg font-medium ${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                      {todo.title}
                    </h3>
                    {todo.description && (
                      <p className="text-gray-600 mt-1">{todo.description}</p>
                    )}
                    <p className="text-gray-400 text-xs mt-1">
                      Created: {new Date(todo.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => toggleComplete(todo)}
                      className={`px-3 py-1 rounded text-sm font-medium ${
                        todo.completed 
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      }`}
                    >
                      {todo.completed ? 'Completed' : 'Mark Complete'}
                    </button>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1 rounded text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoComponent;