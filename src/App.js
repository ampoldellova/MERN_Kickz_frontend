import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Product from './Components/Product/Product';
import Header from './Components/Layout/Header';

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Product />} exact="true" />
        </Routes>
      </Router>
    </div>
  );
}

export default App;