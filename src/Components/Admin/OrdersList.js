import React, { useState, useEffect, Fragment } from 'react';
import { createTheme, ThemeProvider, Typography, Box, } from '@mui/material';
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
                    sort: 'asc'
                },

                {
                    headerName: 'No of Items',
                    field: 'numofItems',
                    width: 300,
                    sort: 'asc'
                },
                {
                    headerName: 'Amount',
                    field: 'amount',
                    width: 300,
                    sort: 'asc'
                },
                {
                    headerName: 'Status',
                    field: 'status',
                    width: 300,
                    sort: 'asc',
                    renderCell: ({ value }) => {
                        return value && String(value).includes('Delivered') ? (
                            <Typography style={{ color: 'green' }}>{value}</Typography>
                        ) : (
                            <Typography style={{ color: 'red' }}>{value}</Typography>
                        );
                    },
                },
                {
                    headerName: 'Actions',
                    field: 'actions',
                    width: 300,
                    renderCell: ({ value }) => (
                        <Fragment>
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
                        </Fragment>
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
                        <div style={{ height: 'auto', width: '100%' }}>
                            <Typography variant='h3' style={{textAlign:'center', fontWeight: 1000}}>List of Customer Orders</Typography>
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
                    )}
                </Box>
            </Box>

        </ThemeProvider>
    );
};

export default OrdersList;
