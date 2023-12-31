import React, { useEffect, useState } from "react";
import { MDBCardBody, MDBCardImage, MDBCol, MDBContainer, MDBRow } from "mdb-react-ui-kit";
import { useNavigate } from 'react-router-dom';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { Typography, ButtonGroup, IconButton, Card, CardContent, Button } from "@mui/material";
import { Container } from "@mui/system";
import MetaData from '../Layout/Metadata';
import axios from "axios";

const Cart = ({ addItemToCart, cartItems, removeItemFromCart }) => {
    const navigate = useNavigate()
    const [brand, setBrands] = useState('');

    const increaseQty = (id, quantity, stock) => {
        const newQty = quantity + 1;
        if (newQty > stock) return;
        addItemToCart(id, newQty);
    }

    const decreaseQty = (id, quantity) => {
        const newQty = quantity - 1;
        if (newQty <= 0) return;
        addItemToCart(id, newQty);
    }

    const removeCartItemHandler = (id) => {
        removeItemFromCart(id)
    }
    const checkoutHandler = () => {
        navigate('/login?redirect=shipping')
    }

    localStorage.setItem('cartItems', JSON.stringify(cartItems))

    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_API}/api/v1/admin/brands`)
            .then((response) => {
                console.log('Brands data:', response.data);
                setBrands(response.data.brand);
            })
            .catch((error) => {
                console.error('Failed to fetch brands:', error);
            });
    }, [])

    return (
        <Container className="100vh" style={{ marginTop: '50px' }}>
            <MetaData title={'Your Cart'} />
            {cartItems.length === 0 ? <div className="row justify-content-center">
                <div className="col-6 mt-5 text-center">
                    <img className="my-5 img-fluid d-block mx-auto" src="https://res.cloudinary.com/dwkmutbz3/image/upload/v1699749939/Kickz/logo/empty_k6huuj.png" alt="Order Success" width="1000" height="1000" />
                    <Typography variant="h3">Your Cart is Empty</Typography>
                </div>
            </div> : (
                <MDBContainer className="py-5 h-100">
                    <MDBRow className="justify-content-center align-items-center h-100">
                        <MDBCol md="10">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <Typography variant="h5">
                                    Shopping Cart
                                </Typography>
                                <div>
                                    <Typography variant="subtitle1" className="mb-0">
                                        <span className="text-muted">Your Cart: <b>{cartItems.length} items</b>:</span>
                                    </Typography>
                                </div>
                            </div>

                            {cartItems.map(item => (
                                <Card variant="outlined" className="rounded-3 mb-4" style={{ border: '1px solid' }}>
                                    <div key={item.product}>
                                        <MDBCardBody className="p-4">
                                            <MDBRow className="justify-content-between align-items-center">
                                                <MDBCol md="2" lg="2" xl="2">
                                                    <MDBCardImage className="rounded-3" fluid
                                                        src={item.image}
                                                        alt={item.name} />
                                                </MDBCol>
                                                <MDBCol md="3" lg="3" xl="3">
                                                    <Typography variant="h6" className="mb-2">{item.name}</Typography>
                                                    <Typography variant="subtitle2">Color: {item.colorway}</Typography>
                                                    <Typography variant="subtitle2">Brand: {item.brand.name}</Typography>
                                                    <Typography variant="subtitle2">Size: {item.size}</Typography>
                                                </MDBCol>
                                                <MDBCol md="3" lg="3" xl="2"
                                                    className="d-flex align-items-center justify-content-around">
                                                    <ButtonGroup>
                                                        <IconButton onClick={() => decreaseQty(item.product, item.quantity)} >
                                                            <RemoveIcon fontSize="small" />
                                                        </IconButton>
                                                        <input
                                                            type='number'
                                                            size="small"
                                                            className="count"
                                                            style={{
                                                                width: 50,
                                                                textAlign: 'center'
                                                            }}
                                                            value={item.quantity}
                                                            readOnly />
                                                        <IconButton onClick={() => increaseQty(item.product, item.quantity, item.stock)} >
                                                            <AddIcon fontSize="small" />
                                                        </IconButton>
                                                    </ButtonGroup>
                                                </MDBCol>
                                                <MDBCol className="offset-lg-1">
                                                    <Typography variant="h6">₱ {item.price}</Typography>
                                                </MDBCol>
                                                <MDBCol className="text-end">
                                                    <IconButton style={{ color: '#c62828' }} onClick={() => removeCartItemHandler(item.product)}><DeleteIcon /></IconButton>
                                                </MDBCol>
                                            </MDBRow>
                                        </MDBCardBody>
                                    </div>
                                </Card>
                            ))}


                        </MDBCol>

                        <MDBCol md="10">
                            <Card variant="outlined" className="rounded-3 mb-4" style={{ border: '1px solid' }}>
                                <CardContent>
                                    <Typography variant="h5" className="mb-4">
                                        Order Summary
                                    </Typography><hr />
                                    <MDBCardBody>
                                        <Typography variant="subtitle1"
                                            className="d-flex justify-content-between align-items-center px-0 pb-0">
                                            Subtotal:<span className="order-summary-values">{cartItems.reduce((acc, item) => (acc + Number(item.quantity)), 0)} (Units)</span>
                                        </Typography>
                                        <Typography variant="subtitle1"
                                            className="d-flex justify-content-between align-items-center px-0 mb-4">
                                            Estimated Total:<span className="order-summary-values">₱ {cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0).toFixed(2)}</span>
                                        </Typography>

                                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                            <Button
                                                variant="contained"
                                                startIcon={<ShoppingCartCheckoutIcon />}
                                                style={{ alignItems: 'end', backgroundColor: 'black' }}
                                                onClick={checkoutHandler} >
                                                Check Out
                                            </Button>
                                        </div>
                                    </MDBCardBody>
                                </CardContent>

                            </Card>
                        </MDBCol>

                    </MDBRow>
                </MDBContainer>
            )
            }
        </Container >
    );
};

export default Cart;