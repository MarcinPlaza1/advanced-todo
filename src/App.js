import React, { useState } from 'react';
import Modal from 'react-modal';

function App() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [details, setDetails] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedTodoIndex, setEditedTodoIndex] = useState(-1);
  const [searchTerm, setSearchTerm] = useState('');
  const [todoFilter, setTodoFilter] = useState('all');
  const [sortMethod, setSortMethod] = useState('date');
  const [isModalOpen, setIsModalOpen] = useState(false);

  function handleInputChange(event) {
    setInputValue(event.target.value);
  }

  function handleDetailsChange(event) {
    setDetails(event.target.value);
  }

  function handleDueDateChange(event) {
    const dueDate = event.target.value;
    const today = new Date().toISOString().slice(0, 10);

    if (dueDate && dueDate >= today) {
      setDueDate(dueDate);
    }
  }

  function handleSearchInputChange(event) {
    setSearchTerm(event.target.value);
  }

  function handleAddButtonClick() {
    const date = new Date();
    setTodos([...todos, { text: inputValue, details: details, dueDate: dueDate, isCompleted: false, date }]);
    setInputValue('');
    setDetails('');
    setDueDate('');
    setIsModalOpen(false);
  }

  function handleEditButtonClick(index) {
    setInputValue(todos[index].text);
    setDetails(todos[index].details);
    setDueDate(todos[index].dueDate);
    setIsEditing(true);
    setEditedTodoIndex(index);
    setIsModalOpen(true);
  }

  function handleSaveButtonClick() {
    const newTodos = [...todos];
    const today = new Date().toISOString().slice(0, 10);
    let isCompleted = newTodos[editedTodoIndex].isCompleted;
  
    if (dueDate && dueDate < today) {
      isCompleted = true;
    }
  
    newTodos[editedTodoIndex] = {
      text: inputValue,
      details: details,
      dueDate: dueDate,
      isCompleted: isCompleted,
      date: newTodos[editedTodoIndex].date,
    };
    setTodos(newTodos);
    setInputValue('');
    setDetails('');
    setDueDate('');
    setIsEditing(false);
    setEditedTodoIndex(-1);
    setIsModalOpen(false);
  }
  

  function handleTodoCheckboxChange(index) {
    const newTodos = [...todos];
    newTodos[index].isCompleted = !newTodos[index].isCompleted;
    setTodos(newTodos);
  }

  function handleDeleteButtonClick(index) {
    const newTodos = [...todos];
    newTodos.splice(index, 1);
    setTodos(newTodos);
  }

  function handleFilterChange(event) {
    setTodoFilter(event.target.value);
  }

  function handleSortClick(method) {
    setSortMethod(method);
  }

  const filteredTodos = todos
    .filter(todo =>
      todoFilter === 'all' ||
      (todoFilter === 'active' && !todo.isCompleted) ||
      (todoFilter === 'completed' && todo.isCompleted)
    )
    .filter(todo => todo.text.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortMethod === 'date') {
        return a.date - b.date;
      } else if (sortMethod === 'alphabetical') {
        return a.text.localeCompare(b.text);
      }
      return 0;
    });

    return (
        <div className="app">
        <Modal isOpen={isModalOpen}>
          <input type="text" value={inputValue} onChange={handleInputChange} />
          <textarea value={details} onChange={handleDetailsChange} />
          <input type="date" value={dueDate} onChange={handleDueDateChange} />
          {isEditing ? (
            <button onClick={handleSaveButtonClick}>Zapisz</button>
          ) : (
            <button onClick={handleAddButtonClick}>Dodaj</button>
          )}
          <button onClick={() => setIsModalOpen(false)}>Anuluj</button>
        </Modal>
        <div>
          <input type="text" value={searchTerm} onChange={handleSearchInputChange} placeholder="Wyszukaj..." />
        </div>
        <div>
          <button onClick={() => setIsModalOpen(true)}>Dodaj zadanie</button>
          <select value={todoFilter} onChange={handleFilterChange}>
            <option value="all">Wszystko</option>
            <option value="active">Niezakończone</option>
            <option value="completed">Zakończone</option>
          </select>
          <button onClick={() => handleSortClick('date')}>Sortuj po dacie</button>
          <button onClick={() => handleSortClick('alphabetical')}>Sortuj alfabetycznie</button>
        </div>
        <div className="todo-list">
          {filteredTodos.map((todo, index) => (
            <div key={index} className="todo">
              <input
                type="checkbox"
                checked={todo.isCompleted}
                onChange={() => handleTodoCheckboxChange(index)}
              />
              <span className={todo.isCompleted ? 'completed' : ''}>{todo.text}</span>
              <span>{todo.details}</span> {/* display details */}
              <span>{todo.dueDate}</span> {/* display due date */}
              <button onClick={() => handleEditButtonClick(index)}>Edytuj</button>
              <button onClick={() => handleDeleteButtonClick(index)}>Usuń</button>
            </div>
          ))}
        </div>
      </div>
    );
}

export default App;
