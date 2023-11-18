import React, { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MDBDataTable } from 'mdbreact';
import { DataGrid } from '@mui/x-data-grid';
import { Container } from '@mui/system';
import MetaData from '../Layout/Metadata';
import Loader from '../Layout/Loader';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { getToken } from '../../utils/helpers';


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
                { field: 'id', headerName: 'Order ID', width: 300, sort: 'asc' },
                { field: 'numOfItems', headerName: 'Number of Items', width: 130, sort: 'asc' },
                { field: 'amount', headerName: 'Amount', width: 130, sort: 'asc' },
                {
                    field: 'status',
                    headerName: 'Status',
                    width: 130,
                    sort: 'asc',
                    options: {
                        customBodyRender: (value) => {
                            return (
                                value.orderStatus && String(value.orderStatus).includes('Delivered')
                                    ? <p style={{ color: 'green' }}>{value.orderStatus}</p>
                                    : <p style={{ color: 'red' }}>{value.orderStatus}</p>
                            )
                        }
                    }
                },
                { field: 'actions', headerName: 'Actions', width: 130, sort: 'asc' }
            ],
            rows: []
        }

        myOrdersList.forEach(order => {

            data.rows.push({
                id: order._id,
                numOfItems: order.orderItems.length,
                amount: `₱ ${order.totalPrice}`,
                status: order.orderStatus,
                actions:
                    <Link to={`/order/${order._id}`} className="btn btn-primary">
                        <VisibilityIcon />
                    </Link>
            })
        })

        return data;
    }

    return (
        <Fragment>
            <MetaData title={'My Orders'} />
            {loading ? <Loader /> : (
                <Container style={{ marginTop: 100 }}>
                    <DataGrid
                        rows={setOrders().rows}
                        columns={setOrders().columns}
                        initialState={{
                            pagination: {
                                paginationModel: { page: 0, pageSize: 5 },
                            },
                        }}
                        pageSizeOptions={[5, 10]}
                        checkboxSelection
                    />

                </Container>
            )}
        </Fragment>
    )
}

export default ListOrders;
