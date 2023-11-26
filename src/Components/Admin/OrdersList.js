import React, { useState, useEffect } from 'react';
import { createTheme, ThemeProvider, Typography, Box, Container } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MetaData from '../Layout/Metadata';
import Navigation from './Navigation';
import { getToken } from '../../utils/helpers';
import Loader from '../Layout/Loader';

const defaultTheme = createTheme();

const OrdersList = () => {

    let navigate = useNavigate();
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [allOrders, setAllOrders] = useState([])
    const [isDeleted, setIsDeleted] = useState(false)
    const errMsg = (message = '') => toast.error(message, {
        position: toast.POSITION.BOTTOM_CENTER
    });
    const successMsg = (message = '') => toast.success(message, {
        position: toast.POSITION.BOTTOM_CENTER
    });

    const listOrders = async () => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                }
            }
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/admin/orders`, config)
            setAllOrders(data.orders)
            setLoading(false)
        } catch (error) {
            setError(error.response.data.message)
        }
    }
    const deleteOrder = async (id) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                }
            }
            const { data } = await axios.delete(`${process.env.REACT_APP_API}/api/v1/admin/order/${id}`, config)
            setIsDeleted(data.success)
            setLoading(false)
        } catch (error) {
            setError(error.response.data.message)

        }
    }
    useEffect(() => {
        listOrders()
        if (error) {
            errMsg(error)
            setError('')
        }
        if (isDeleted) {
            successMsg('Order deleted successfully');
            navigate('/admin/orders');
        }
    }, [error, isDeleted])
    const deleteOrderHandler = (id) => {
        deleteOrder(id)
    }
    const setOrders = () => {
        const data = {
            columns: [
                {
                    headerName: 'Order ID',
                    field: 'id',
                    width: 300,
                    sort: 'asc',
                    align: 'center',
                    headerAlign: 'center'
                },

                {
                    headerName: 'No of Items',
                    field: 'numofItems',
                    width: 100,
                    sort: 'asc',
                    align: 'center',
                    headerAlign: 'center'
                },
                {
                    headerName: 'Amount',
                    field: 'amount',
                    width: 300,
                    sort: 'asc',
                    align: 'center',
                    headerAlign: 'center'
                },
                {
                    headerName: 'Status',
                    field: 'status',
                    width: 200,
                    sort: 'asc',
                    headerAlign: 'center',
                    renderCell: ({ value }) => {
                        return value && String(value).includes('Delivered') ? (
                            <Container style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <Typography style={{ color: 'green', textAlign: 'center' }}>{value}</Typography>
                            </Container>
                        ) : (
                            <Container style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <Typography style={{ color: 'red', textAlign: 'center' }}>{value}</Typography>
                            </Container>
                        );
                    },
                },
                {
                    headerName: 'Actions',
                    field: 'actions',
                    width: 200,
                    headerAlign: 'center',
                    renderCell: ({ value }) => (
                        <Container style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Link to={`/admin/order/${value}`}>
                                <Button
                                    variant='contained'
                                    sx={{
                                        color: 'white'
                                    }}>
                                    <EditIcon />
                                </Button>
                            </Link>
                            <Button
                                variant='contained'
                                sx={{
                                    color: 'white',
                                    backgroundColor: 'red',
                                    marginLeft: 1
                                }}
                                onClick={() => deleteOrderHandler(value)}
                            >
                                <DeleteIcon />
                            </Button>
                        </Container>
                    ),
                },
            ],
            rows: []
        }

        allOrders.forEach(order => {
            data.rows.push({
                id: order._id,
                numofItems: order.orderItems.length,
                amount: `₱ ${order.totalPrice}`,
                status: order.orderStatus,
                actions: order._id
            })
        })
        return data;
    }

    return (

        <ThemeProvider theme={defaultTheme}>
            <MetaData title={'OrdersList'} />

            <Box sx={{ display: 'flex' }}>
                <Navigation />
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
                        marginTop: 10
                    }}
                >
                    {loading ? <Loader /> : (
                        <Container>
                            <div style={{ height: 'auto', width: '100%', marginTop: 30 }}>
                                <Typography
                                    variant='h3'
                                    style={{
                                        textAlign: 'center',
                                        fontWeight: 1000,
                                        marginBottom: 20
                                    }}>
                                    List of Customer Orders
                                </Typography>
                                <DataGrid
                                    rows={setOrders().rows}
                                    columns={setOrders().columns}
                                    initialState={{
                                        pagination: {
                                            paginationModel: { page: 0, pageSize: 10 },
                                        },
                                    }}
                                    pageSizeOptions={[10, 20]}
                                />
                            </div>
                        </Container>
                    )}
                </Box>
            </Box>

        </ThemeProvider >
    );
};

export default OrdersList;
