import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';

function App() {
  const [state, setState] = useState({
    cartItems: localStorage.getItem('cartItems')
      ? JSON.parse(localStorage.getItem('cartItems'))
      : [],
    shippingInfo: localStorage.getItem('shippingInfo')
      ? JSON.parse(localStorage.getItem('shippingInfo'))
      : {},
  })

  const addItemToCart = async (id, quantity) => {
    console.log(id, quantity)
    try {
      const { data } = await axios.get(`http://localhost:4002/api/v1/product/${id}`)
      const item = {
        product: data.product._id,
        name: data.product.name,
        price: data.product.price,
        colorway: data.product.colorway,
        size: data.product.size,
        brand: data.product.brand,
        image: data.product.images[0].url,
        stock: data.product.stock,
        quantity: quantity
      }

      const isItemExist = state.cartItems.find(i => i.product === item.product)
      console.log(isItemExist, state)

      if (isItemExist) {
        setState({
          ...state,
          cartItems: state.cartItems.map(i => i.product === isItemExist.product ? item : i)
        })
      }
      else {
        setState({
          ...state,
          cartItems: [...state.cartItems, item]
        })
      }

      toast.success('Item Added to Cart', {
        position: toast.POSITION.BOTTOM_RIGHT
      })

    } catch (error) {
      toast.error(error, {
        position: toast.POSITION.TOP_LEFT
      });
    }
  }

  const removeItemFromCart = async (id) => {
    setState({
      ...state,
      cartItems: state.cartItems.filter(i => i.product !== id)
    })

    toast.success('Item Removed to Cart', {
      position: toast.POSITION.BOTTOM_RIGHT
    })

    localStorage.setItem('cartItems', JSON.stringify(state.cartItems))
  }

  const saveShippingInfo = async (data) => {
    setState({
      ...state,
      shippingInfo: data
    })
    localStorage.setItem('shippingInfo', JSON.stringify(data))
  }

  return (
    <div className="App">
      <Router>
        <Header cartItems={state.cartItems} />
        <Routes>
          <Route path="/" element={<Home />} exact="true" />
          <Route path="/search/:keyword" element={<Home />} exact="true" />
          <Route path="/product/:id" element={<ProductDetails cartItems={state.cartItems} addItemToCart={addItemToCart} />} exact="true" />
          <Route path="/login" element={<Login />} exact="true" />
          <Route path="/password/forgot" element={<ForgotPassword />} exact="true" />
          <Route path="/me" element={<Profile />} exact="true" />
          <Route path="/register" element={<Register />} exact="true" />
          <Route path="/password/update" element={<UpdatePassword />} />
          <Route path="/me/update" element={<UpdateProfile />} exact="true" />
          <Route path="/cart" element={<Cart cartItems={state.cartItems} addItemToCart={addItemToCart} removeItemFromCart={removeItemFromCart} />} exact="true" />
          <Route path="/shipping" element={<Shipping shipping={state.shippingInfo} saveShippingInfo={saveShippingInfo} />} />
          <Route path="/confirm" element={<ConfirmOrder cartItems={state.cartItems} shippingInfo={state.shippingInfo} />} />
          <Route path="/payment" element={<Payment cartItems={state.cartItems} shippingInfo={state.shippingInfo} />} />
          <Route path="/success" element={<OrderSuccess />} />
          <Route path="/orders/me" element={<ListOrders />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;