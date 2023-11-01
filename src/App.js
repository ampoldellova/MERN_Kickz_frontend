import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from './Components/Layout/Header';
import Home from './Components/Home';
import ProductDetails from './Components/Product/ProductDetails';
import Login from './Components/User/Login';
import ForgotPassword from './Components/User/ForgotPassword';
import Profile from './Components/User/Profile';
import Register from './Components/User/Register';

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} exact="true" />
          <Route path="/search/:keyword" element={<Home />} exact="true" />
          <Route path="/product/:id" element={<ProductDetails />} exact="true" />
          <Route path="/login" element={<Login />} exact="true" />
          <Route path="/password/forgot" element={<ForgotPassword />} exact="true" />
          <Route path="/me" element={<Profile />} exact="true" />
          <Route path="/register" element={<Register />} exact="true" />
        </Routes>
      </Router>
    </div>
  );
}

export default App;