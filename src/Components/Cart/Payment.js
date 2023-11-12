import React, { Fragment, useEffect, useState } from 'react';
import { Card, Container, Typography, Grid, TextField, FormControlLabel, Checkbox, Box, Button } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { getToken } from '../../utils/helpers';
import { toast } from 'react-toastify';
import CheckoutSteps from './CheckoutSteps';
import MetaData from '../Layout/Metadata';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const Payment = ({ cartItems, shippingInfo }) => {

    const [loading, setLoading] = useState(true)
    let navigate = useNavigate();
    const order = {
        orderItems: cartItems,
        shippingInfo
    }

    const orderInfo = JSON.parse(sessionStorage.getItem('orderInfo'));
    if (orderInfo) {
        order.itemsPrice = orderInfo.itemsPrice
        order.shippingPrice = orderInfo.shippingPrice
        order.taxPrice = orderInfo.taxPrice
        order.totalPrice = orderInfo.totalPrice
    }

    const createOrder = async (order) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                }
            }
            const { data } = await axios.post(`http://localhost:4002/api/v1/order/new`, order, config)
            // setIsUpdated(data.success)
            setLoading(false)
            toast.success('order created', {
                position: toast.POSITION.BOTTOM_RIGHT
            });


            navigate('/success')

        } catch (error) {
            toast.error(error.response.data.message, {
                position: toast.POSITION.BOTTOM_RIGHT
            });
        }
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        document.querySelector('#pay_btn').disabled = true;
        order.paymentInfo = {
            id: 'pi_1DpdYh2eZvKYlo2CYIynhU32',
            status: 'succeeded'
        }
        createOrder(order)
        navigate('/success')
    }


    return (
        <Fragment>
            <MetaData title={'Payment'} />
            <CheckoutSteps shipping confirmOrder payment />
            <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
                <Box component="form" onSubmit={submitHandler}>
                    <Card variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 }, border: '1px solid' }}>
                        <Typography component="h1" variant="h4" align="center" >
                            Checkout
                        </Typography><hr />
                        <Typography variant="h6" gutterBottom>
                            Payment method
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    required
                                    id="card_num_field"
                                    label="Card Number"
                                    fullWidth
                                    variant="standard"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    required
                                    id="card_exp_field"
                                    label="Card Expiry"
                                    fullWidth
                                    variant="standard"
                                />
                            </Grid>
                            <Grid item xs={12} md={6} xl={12} lg={12}>
                                <TextField
                                    required
                                    id="card_cvc_field"
                                    label="Card CVC"
                                    fullWidth
                                    variant="standard"
                                />
                            </Grid>
                        </Grid>

                        <Grid container>
                            <Typography
                                variant="h6"
                                style={{ marginTop: 25, textAlign: 'left' }}
                            >
                                Pay {` - ${orderInfo && orderInfo.totalPrice}`}
                            </Typography>
                            <Button
                                id="pay_btn"
                                variant="contained"
                                type="submit"
                                style={{ marginTop: 25, backgroundColor: 'black', marginLeft: 'auto' }}
                            >
                                Finish
                            </Button>
                        </Grid>
                    </Card>
                </Box>
            </Container>
        </Fragment>
    );
};

export default Payment;
