import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from './Components/Layout/Header';
import Home from './Components/Home';

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} exact="true" />
          <Route path="/search/:keyword" element={<Home />} exact="true" />
        </Routes>
      </Router>
    </div>
  );
}

export default App;