import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [jsonInput, setJsonInput] = useState('');
  const [isValidJson, setIsValidJson] = useState(true);
  const [response, setResponse] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [filteredResponse, setFilteredResponse] = useState(null);

  useEffect(() => {
    document.title = 'Your Roll Number';
  }, []);

  const validateJson = (input) => {
    try {
      JSON.parse(input);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleSubmit = async () => {
    if (validateJson(jsonInput)) {
      setIsValidJson(true);
      try {
        const res = await axios.post('http://localhost:3000/bfhl', JSON.parse(jsonInput));
        setResponse(res.data);
        setFilteredResponse(null);  // Reset filtered response on new API call
      } catch (error) {
        console.error('Error calling API:', error);
        alert('Failed to fetch data from the API. Please check the console for details.');
      }
    } else {
      setIsValidJson(false);
    }
  };

  const handleOptionChange = (event) => {
    const value = Array.from(event.target.selectedOptions, option => option.value);
    setSelectedOptions(value);
  };

  useEffect(() => {
    if (response && selectedOptions.length > 0) {
      let filtered = {};
      if (selectedOptions.includes('Alphabets')) {
        filtered['alphabets'] = response.alphabets;
      }
      if (selectedOptions.includes('Numbers')) {
        filtered['numbers'] = response.numbers;
      }
      if (selectedOptions.includes('Highest alphabet')) {
        filtered['highestAlphabet'] = response.highestAlphabet;
      }
      setFilteredResponse(filtered);
    }
  }, [response, selectedOptions]);

  return (
    <div className="App">
      <header>
        <h1>Your Roll Number</h1>
      </header>
      <div className="input-section">
        <label>API Input</label>
        <textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder='{"data":["M","1","334","4","B"]}'
        ></textarea>
        <button onClick={handleSubmit}>Submit</button>
        {!isValidJson && <p className="error">Invalid JSON format</p>}
      </div>
      {isValidJson && response && (
        <div className="filter-section">
          <label>Multi-Select Dropdown:</label>
          <select multiple={true} onChange={handleOptionChange}>
            <option value="Alphabets">Alphabets</option>
            <option value="Numbers">Numbers</option>
            <option value="Highest alphabet">Highest alphabet</option>
          </select>
        </div>
      )}
      <div className="response-section">
        {filteredResponse && (
          <div>
            <h2>Filtered Response</h2>
            <pre>{JSON.stringify(filteredResponse, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
