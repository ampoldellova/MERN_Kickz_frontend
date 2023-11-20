import React, { Fragment, useState, useEffect } from 'react';
import { Card, Select, MenuItem, CardContent, styled, createTheme, ThemeProvider, CssBaseline, Drawer as MuiDrawer, AppBar as MuiAppBar, Toolbar, List, Typography, Divider, IconButton, Container, Grid, Paper, Box, InputLabel, TextField, Button } from '@mui/material';
import { MDBCol, MDBRow } from 'mdb-react-ui-kit';
import { Link, useParams, useNavigate } from 'react-router-dom';
import MetaData from '../Layout/Metadata';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import SideBar from './SideBar';

import Loader from '../Layout/Loader'

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'
import { getToken } from '../../utils/helpers'

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        '& .MuiDrawer-paper': {
            position: 'relative',
            whiteSpace: 'nowrap',
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
            boxSizing: 'border-box',
            ...(!open && {
                overflowX: 'hidden',
                transition: theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
                width: theme.spacing(7),
                [theme.breakpoints.up('sm')]: {
                    width: theme.spacing(9),
                },
            }),
        },
    }),
);

const defaultTheme = createTheme();

const UpdateOrderStatus = () => {
    const [open, setOpen] = useState(true);

    const toggleDrawer = () => {
        setOpen(!open);
    };

    const [status, setStatus] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [order, setOrder] = useState({})
    const [isUpdated, setIsUpdated] = useState(false)
    let navigate = useNavigate()

    let { id } = useParams();
    const { shippingInfo, orderItems, paymentInfo, user, totalPrice, orderStatus } = order
    const orderId = id;
    const errMsg = (message = '') => toast.error(message, {
        position: toast.POSITION.BOTTOM_CENTER
    });

    const successMsg = (message = '') => toast.success(message, {
        position: toast.POSITION.BOTTOM_CENTER
    });

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
    const updateOrder = async (id, formData) => {

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                }
            }
            const { data } = await axios.put(`http://localhost:4002/api/v1/admin/order/${id}`, formData, config)
            setIsUpdated(data.success)


        } catch (error) {
            setError(error.response.data.message)
        }
    }

    useEffect(() => {
        getOrderDetails(orderId)
        if (error) {
            errMsg(error);
            setError('')
        }
        if (isUpdated) {
            successMsg('Order updated successfully');
            setIsUpdated('')
            navigate('/admin/orders')
        }
    }, [error, isUpdated, orderId])

    const updateOrderHandler = (id) => {
        const formData = new FormData();
        formData.set('status', status);
        updateOrder(id, formData)
    }

    const shippingDetails = shippingInfo && `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.postalCode}, ${shippingInfo.country}`
    const isPaid = paymentInfo && paymentInfo.status === 'succeeded' ? true : false

    return (
        <ThemeProvider theme={defaultTheme}>
            <MetaData title={'UpdateOrderStatus'} />
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar position="absolute" open={open}>
                    <Toolbar
                        sx={{
                            pr: '24px',
                            backgroundColor: 'black'
                        }}
                    >
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            onClick={toggleDrawer}
                            sx={{
                                marginRight: '36px',
                                ...(open && { display: 'none' }),
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography
                            component="h1"
                            variant="h6"
                            color="inherit"
                            noWrap
                            sx={{ flexGrow: 1 }}
                        >
                            Update Order Status
                        </Typography>
                        <Link to="/">
                            <img src="https://res.cloudinary.com/dwkmutbz3/image/upload/v1699103432/Kickz/logo/kickz_piufvo.png"
                                style={{
                                    width: 40,
                                    height: 40,
                                    cursor: 'pointer'
                                }} alt="Kickz" />
                        </Link>
                    </Toolbar>
                </AppBar>
                <Drawer variant="permanent" open={open}>
                    <Toolbar
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            px: [1],
                        }}
                    >
                        <IconButton onClick={toggleDrawer}>
                            <ChevronLeftIcon />
                        </IconButton>
                    </Toolbar>
                    <Divider />
                    <List component="nav">
                        <SideBar />
                        <Divider sx={{ my: 1 }} />
                    </List>
                </Drawer>
                <Box
                    component="main"
                    sx={{
                        backgroundColor: (theme) =>
                            theme.palette.mode === 'light'
                                ? theme.palette.grey[100]
                                : theme.palette.grey[900],
                        flexGrow: 1,
                        height: '100vh',
                        overflow: 'auto',
                    }}
                >
                    <Fragment>
                        <MetaData title={`Process Order # ${order && order._id}`} />
                        {loading ? <Loader /> : (
                            <Container style={{ display: 'flex', marginTop: 100, justifyContent: 'center' }}>
                                <Container item>
                                    <Card variant='outlined' style={{ borderRadius: '10px', border: '1px solid black' }}>
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
                                <Container item>
                                    <Card variant='outlined' style={{ borderRadius: '10px', border: '1px solid black' }}>
                                        <CardContent>
                                            <InputLabel>Select Status</InputLabel>
                                            <Select
                                                fullWidth
                                                value={status}
                                                onChange={(e) => setStatus(e.target.value)}
                                            >
                                                <MenuItem value={'Processing'}>Processing</MenuItem>
                                                <MenuItem value={'Shipped'}>Shipped</MenuItem>
                                                <MenuItem value={'Delivered'}>Delivered</MenuItem>
                                            </Select>
                                            <Button
                                                variant='contained'
                                                style={{ marginTop: 10 }}
                                                onClick={() => updateOrderHandler(order._id)}>
                                                Update Status
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </Container>
                            </Container>
                        )}
                    </Fragment>
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default UpdateOrderStatus;
