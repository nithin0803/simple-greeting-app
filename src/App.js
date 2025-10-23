import React, { useState } from "react";
import "./App.css";

function App() {
  const [name, setName] = useState("");
  const [greeting, setGreeting] = useState("");

  const handleButtonClick = () => {
    if (name.trim()) {
      setGreeting(`Hello ${name}!, How are you doing`);
    } else {
      setGreeting("Please enter a name!");
    }
  };

  const handleInputChange = (e) => {
    setName(e.target.value);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Simple Greeting App</h1>
        <div className="greeting-container">
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={handleInputChange}
            className="name-input"
          />
          <button onClick={handleButtonClick} className="greeting-button">
            Say Hello
          </button>
          {greeting && <p className="greeting-message">{greeting}</p>}
        </div>
      </header>
    </div>
  );
}

export default App;
