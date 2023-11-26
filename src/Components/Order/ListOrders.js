import React, { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { Container } from '@mui/system';
import MetaData from '../Layout/Metadata';
import Loader from '../Layout/Loader';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { getToken } from '../../utils/helpers';
import { Button } from '@mui/material';
import { Typography } from '@mui/material';

const ListOrders = () => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [myOrdersList, setMyOrdersList] = useState([])

    const myOrders = async () => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${getToken()}`
                }
            }
            const { data } = await axios.get(`http://localhost:4002/api/v1/orders/me`, config)
            console.log(data)
            setMyOrdersList(data.orders)
            setLoading(false)

        } catch (error) {
            setError(error.response.data.message)
        }
    }
    useEffect(() => {
        myOrders();
        if (error) {
            toast.error(error, {
                position: toast.POSITION.BOTTOM_RIGHT
            });
        }
    }, [error])

    const setOrders = () => {
        const data = {
            columns: [
                {
                    field: 'id',
                    headerName: 'Order ID',
                    width: 300,
                    sort: 'asc',
                    align: 'center',
                    headerAlign: 'center'
                },
                {
                    field: 'numOfItems',
                    headerName: 'Number of Items',
                    width: 130,
                    sort: 'asc',
                    align: 'center',
                    headerAlign: 'center'
                },
                {
                    field: 'amount',
                    headerName: 'Amount',
                    width: 300,
                    sort: 'asc',
                    align: 'center',
                    headerAlign: 'center'
                },
                {
                    field: 'status',
                    headerName: 'Status',
                    width: 200,
                    sort: 'asc',
                    align: 'center',
                    headerAlign: 'center',
                    renderCell: ({ value }) => {
                        return value && String(value).includes('Delivered') ? (
                            <Typography style={{ color: 'green' }}>{value}</Typography>
                        ) : (
                            <Typography style={{ color: 'red' }}>{value}</Typography>
                        );
                    },
                },
                {
                    field: 'actions',
                    headerName: 'Actions',
                    width: 200,
                    sort: 'asc',
                    headerAlign: 'center',
                    renderCell: ({ value }) => (
                        <Container style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Link to={`/order/${value}`} className="btn btn-primary">
                                <Button endIcon={<VisibilityIcon />} sx={{ color: 'white', height: 20 }}>View</Button>
                            </Link>
                        </Container>
                    ),
                },
            ],
            rows: [],
        };

        myOrdersList.forEach(order => {
            data.rows.push({
                id: order._id,
                numOfItems: order.orderItems.length,
                amount: `₱ ${order.totalPrice}`,
                status: order.orderStatus,
                actions: order._id,
            });
        });

        return data;
    };


    return (
        <Fragment>
            <MetaData title={'My Orders'} />
            {loading ? <Loader /> : (
                <Container style={{ marginTop: 100 }}>
                    <Typography
                        variant="h3"
                        style={{
                            marginBottom: 30,
                            textAlign: 'center',
                            fontWeight: 1000
                        }}>
                        My Orders
                    </Typography>
                    <DataGrid
                        rows={setOrders().rows}
                        columns={setOrders().columns}
                        initialState={{
                            pagination: {
                                paginationModel: { page: 0, pageSize: 5 },
                            },
                        }}
                        pageSizeOptions={[10, 20]}
                    />

                </Container>
            )}
        </Fragment>
    )
}

export default ListOrders;
