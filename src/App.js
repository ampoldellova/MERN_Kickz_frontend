import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Components/Layout/Header';
import Home from './Components/Home';
import ProductDetails from './Components/Product/ProductDetails';
import Login from './Components/User/Login';
import ForgotPassword from './Components/User/ForgotPassword';
import Profile from './Components/User/Profile';
import Register from './Components/User/Register';
import UpdatePassword from './Components/User/UpdatePassword';
import UpdateProfile from './Components/User/UpdateProfile';
import Cart from './Components/Cart/Cart';
import { toast } from 'react-toastify';
import Shipping from './Components/Cart/Shipping';
import ConfirmOrder from './Components/Cart/ConfirmOrder';
import Payment from './Components/Cart/Payment';
import OrderSuccess from './Components/Cart/OrderSuccess';
import ListOrders from './Components/Order/ListOrders';
import OrderDetails from './Components/Order/OrderDetails';
import ProtectedRoute from './Components/Route/ProtectedRoute';
import Dashboard from './Components/Admin/Dashboard';

import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import ProductList from './Components/Admin/ProductList';

function App() {
  const [state, setState] = useState({
    cartItems: JSON.parse(localStorage.getItem('cartItems')) || [],
    shippingInfo: JSON.parse(localStorage.getItem('shippingInfo')) || {},
  });

  const addItemToCart = async (id, quantity) => {
    try {
      const { data } = await axios.get(`http://localhost:4002/api/v1/product/${id}`);
      const item = {
        product: data.product._id,
        name: data.product.name,
        price: data.product.price,
        colorway: data.product.colorway,
        size: data.product.size,
        brand: data.product.brand,
        image: data.product.images[0].url,
        stock: data.product.stock,
        quantity: quantity,
      };

      const isItemExist = state.cartItems.find((i) => i.product === item.product);

      setState({
        ...state,
        cartItems: isItemExist
          ? state.cartItems.map((i) => (i.product === isItemExist.product ? item : i))
          : [...state.cartItems, item],
      });

      toast.success('Item Added to Cart', {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    } catch (error) {
      toast.error(error, {
        position: toast.POSITION.TOP_LEFT,
      });
    }
  };

  const removeItemFromCart = async (id) => {
    setState({
      ...state,
      cartItems: state.cartItems.filter((i) => i.product !== id),
    });

    toast.success('Item Removed to Cart', {
      position: toast.POSITION.BOTTOM_RIGHT,
    });

    localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
  };

  const saveShippingInfo = async (data) => {
    setState({
      ...state,
      shippingInfo: data,
    });
    localStorage.setItem('shippingInfo', JSON.stringify(data));
  };

  return (
    <div className="App">
      <Router>
        <Header cartItems={state.cartItems} />
        <Routes>
          <Route path="/" element={<Home />} exact />
          <Route path="/search/:keyword" element={<Home />} exact />
          <Route path="/product/:id" element={<ProductDetails cartItems={state.cartItems} addItemToCart={addItemToCart} />} exact />
          <Route path="/login" element={<Login />} exact />
          <Route path="/password/forgot" element={<ForgotPassword />} exact />
          <Route path="/me" element={<Profile />} exact />
          <Route path="/register" element={<Register />} exact />
          <Route path="/password/update" element={<UpdatePassword />} />
          <Route path="/me/update" element={<UpdateProfile />} exact />
          <Route path="/cart" element={<Cart cartItems={state.cartItems} addItemToCart={addItemToCart} removeItemFromCart={removeItemFromCart} />} exact />
          <Route path="/shipping" element={<Shipping shipping={state.shippingInfo} saveShippingInfo={saveShippingInfo} />} />
          <Route path="/confirm" element={<ConfirmOrder cartItems={state.cartItems} shippingInfo={state.shippingInfo} />} />
          <Route path="/payment" element={<Payment cartItems={state.cartItems} shippingInfo={state.shippingInfo} />} />
          <Route path="/success" element={<OrderSuccess />} />
          <Route path="/orders/me" element={<ListOrders />} />
          <Route path="/order/:id" element={<OrderDetails />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute isAdmin={true}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <ProtectedRoute isAdmin={true}>
                <ProductList />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
