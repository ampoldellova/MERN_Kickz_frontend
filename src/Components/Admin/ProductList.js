import React, { useState, useEffect, Fragment } from 'react';
import { createTheme, ThemeProvider, Box, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MetaData from '../Layout/Metadata';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { getToken } from '../../utils/helpers';
import Navigation from './Navigation';
import Loader from '../Layout/Loader';

const defaultTheme = createTheme();

const ProductList = () => {
    const [loading, setLoading] = useState(true)
    const [products, setProducts] = useState([])
    const [error, setError] = useState('')
    const [deleteError, setDeleteError] = useState('')
    const [isDeleted, setIsDeleted] = useState(false)

    let navigate = useNavigate()
    const getAdminProducts = async () => {
        try {

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${getToken()}`
                }
            }

            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/admin/products`, config)
            console.log(data)
            setLoading(false)
            setProducts(data.products)
        } catch (error) {

            setError(error.response.data.message)

        }
    }
    useEffect(() => {
        getAdminProducts()

        if (error) {
            toast.error(error, {
                position: toast.POSITION.BOTTOM_RIGHT
            });
        }

        if (deleteError) {
            toast.error(deleteError, {
                position: toast.POSITION.BOTTOM_RIGHT
            });
        }

        if (isDeleted) {
            toast.success('Product deleted successfully', {
                position: toast.POSITION.BOTTOM_RIGHT
            })
            navigate('/admin/products');

        }

    }, [error, deleteError, isDeleted,])

    const deleteProduct = async (id) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${getToken()}`
                }
            }
            const { data } = await axios.delete(`${process.env.REACT_APP_API}/api/v1/admin/product/${id}`, config)

            setIsDeleted(data.success)
        } catch (error) {
            setDeleteError(error.response.data.message)

        }
    }

    const productsList = () => {
        const data = {
            columns: [
                {
                    headerName: 'Product ID',
                    field: 'id',
                    width: 300,
                    sort: 'asc'
                },
                {
                    headerName: 'Product Name',
                    field: 'name',
                    width: 300,
                    sort: 'asc'
                },
                {
                    headerName: 'Price',
                    field: 'price',
                    width: 300,
                    sort: 'asc'
                },
                {
                    headerName: 'Stock',
                    field: 'stock',
                    width: 300,
                    sort: 'asc'
                },
                {
                    headerName: 'Actions',
                    field: 'actions',
                    width: 300,
                    renderCell: ({ value }) => (
                        <Fragment>
                            <Link to={`/admin/product/${value}`}>
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
                                onClick={() => deleteProductHandler(value)}
                            >
                                <DeleteIcon />
                            </Button>
                        </Fragment>
                    ),
                },
            ],
            rows: []
        }

        products.forEach(product => {
            data.rows.push({
                id: product._id,
                name: product.name,
                price: `₱ ${product.price}`,
                stock: product.stock,
                actions: product._id
            })
        })

        return data;
    }

    const deleteProductHandler = (id) => {
        deleteProduct(id)
    }

    return (
        <ThemeProvider theme={defaultTheme}>
            <MetaData title={'Product List'} />
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
                    }}
                >
                    {loading ? <Loader /> : (
                        <div style={{ height: 'auto', width: '100%', marginTop: 68 }}>
                            <Box textAlign="center" style={{ margin: 20 }}>
                                <Typography variant='h3' style={{ fontWeight: 1000 }}>List of Products</Typography>
                                <Link to="/admin/product" style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <Button variant='contained' startIcon={<AddCircleIcon />}>Add Shoe Product</Button>
                                </Link>
                            </Box>
                            <DataGrid
                                rows={productsList().rows}
                                columns={productsList().columns}
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

export default ProductList;