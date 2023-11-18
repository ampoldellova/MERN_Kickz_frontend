import React, { Fragment, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import MetaData from '../Layout/Metadata';
import Loader from '../Layout/Loader';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getToken } from '../../utils/helpers';
import { Avatar, Card, CardContent, CardHeader, Typography, Box } from '@mui/material';
import { MDBCol, MDBRow } from 'mdb-react-ui-kit';
import { Grid, Container } from '@mui/material';


const OrderDetails = () => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [order, setOrder] = useState({})

    const { shippingInfo, orderItems, paymentInfo, user, totalPrice, orderStatus } = order
    let { id } = useParams();

    const getOrderDetails = async (id) => {
        try {

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${getToken()}`
                }
            }

            const { data } = await axios.get(`http://localhost:4002/api/v1/order/${id}`, config)
            setOrder(data.order)
            setLoading(false)


        } catch (error) {
            setError(error.response.data.message)
        }
    }

    useEffect(() => {
        getOrderDetails(id)

        if (error) {
            toast.error(error, {
                position: toast.POSITION.BOTTOM_RIGHT
            });
        }
    }, [error, id])

    const shippingDetails = shippingInfo && `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.postalCode}, ${shippingInfo.country}`

    const isPaid = paymentInfo && paymentInfo.status === 'succeeded' ? true : false

    return (
        <Fragment>
            <MetaData title={'Order Details'} />

            {loading ? <Loader /> : (
                <Container style={{ display: 'flex', marginTop: 100, justifyContent: 'center' }}>
                    <Card variant='outlined' style={{borderRadius: '10px', border: '1px solid black'}}>
                        <CardContent>
                            <Typography variant='h3' >Order #: {order._id}</Typography><hr />
                            {orderItems && orderItems.map(item => (
                                <Fragment>
                                    <MDBRow>
                                        <MDBCol md="8" lg="4" xl="4">
                                            <Typography variant='subtitle1'><Link to={`/product/${item.product}`}>{item.name}</Link></Typography>
                                            <Typography variant='subtitle1' sx={{ fontStyle: 'italic' }}>Price: ₱ {item.price}</Typography>
                                            <Typography variant='subtitle1' sx={{ fontStyle: 'italic' }}>quantity: {item.quantity}</Typography>
                                        </MDBCol>
                                        <MDBCol md="4" lg="8" xl="8" className="text-end">
                                            <img src={item.image} alt={item.name} style={{ width: '100px', height: '100px' }} />
                                        </MDBCol>
                                    </MDBRow><hr />
                                </Fragment>
                            ))}
                            <MDBRow>
                                <MDBCol xs={12} md={6}>
                                    <Typography variant='h6'>Shipping Info:</Typography>
                                    <Typography variant='subtitle1'>Name: {user && user.name}</Typography>
                                    <Typography variant='subtitle1'>Phone: {shippingInfo && shippingInfo.phoneNo}</Typography>
                                    <Typography variant='subtitle1'>Address: {shippingDetails}</Typography>
                                    <Typography variant='subtitle1'>Amount: ₱ {totalPrice}</Typography>
                                </MDBCol>
                                <MDBCol xs={12} md={6}>
                                    <Typography variant='h6'>Payment Details:</Typography>
                                    <Typography variant='subtitle1' >Payment Status: <span style={{
                                        color: isPaid ? 'green' : 'red',
                                    }}>{isPaid ? "Paid" : "Not Paid"}</span></Typography>
                                    <Typography variant='subtitle1'>Order Status:  <span style={{
                                        color: order.orderStatus && String(order.orderStatus).includes('Delivered') ? 'green' : 'red'
                                    }}>{order.orderStatus}</span></Typography>
                                </MDBCol>
                            </MDBRow>
                        </CardContent>
                    </Card>
                </Container>
            )}

        </Fragment>
    )
}

export default OrderDetails