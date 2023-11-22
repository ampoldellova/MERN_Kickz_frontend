import React, { useState, useEffect, Fragment } from 'react';
import { createTheme, ThemeProvider, Box, Button, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Navigation from './Navigation';
import MetaData from '../Layout/Metadata';
import Loader from '../Layout/Loader';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getToken } from '../../utils/helpers';
import axios from 'axios';

const defaultTheme = createTheme();

const BrandList = () => {
    const [loading, setLoading] = useState(true)
    const [brands, setbrand] = useState([])
    const [error, setError] = useState('')
    const [deleteError, setDeleteError] = useState('')
    const [isDeleted, setIsDeleted] = useState(false)

    let navigate = useNavigate()
    const getAdminbrand = async () => {
        try {

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${getToken()}`
                }
            }

            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/admin/brands`, config)
            console.log(data)
            setLoading(false)
            setbrand(data.brand)
        } catch (error) {

            setError(error.response.data.message)

        }
    }

    useEffect(() => {
        getAdminbrand()

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
            toast.success('brand deleted successfully', {
                position: toast.POSITION.BOTTOM_RIGHT
            })
            navigate('/admin/brands');

        }

    }, [error, deleteError, isDeleted,])

    const deletebrand = async (id) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${getToken()}`
                }
            }
            const { data } = await axios.delete(`${process.env.REACT_APP_API}/api/v1/admin/brand/${id}`, config)

            setIsDeleted(data.success)
        } catch (error) {
            setDeleteError(error.response.data.message)

        }
    }

    const brandList = () => {
        const data = {
            columns: [
                {
                    headerName: 'Brand ID',
                    field: 'id',
                    width: 300,
                    sort: 'asc'
                },

                {
                    headerName: 'Brand Name',
                    field: 'name',
                    width: 300,
                    sort: 'asc'
                },
                {
                    headerName: 'Actions',
                    field: 'actions',
                    width: 300,
                    renderCell: ({ value }) => (
                        <Fragment>
                            <Link to={`/admin/brand/${value}`}>
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
                                onClick={() => deletebrandHandler(value)}
                            >
                                <DeleteIcon />
                            </Button>
                        </Fragment>
                    ),
                },
            ],
            rows: []
        }

        brands.forEach(brand => {
            data.rows.push({
                id: brand._id,
                name: brand.name,
                actions: brand._id
            })
        })
        return data;
    }

    const deletebrandHandler = (id) => {
        deletebrand(id)
    }

    return (
        <ThemeProvider theme={defaultTheme}>
            <MetaData title={'brand List'} />
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
                                <Typography variant='h3' style={{ fontWeight: 1000 }}>List of Shoe Brands</Typography>
                                <Link to="/admin/brand" style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <Button variant='contained' startIcon={<AddCircleIcon />}>Add brand</Button>
                                </Link>
                            </Box>
                            <DataGrid
                                rows={brandList().rows}
                                columns={brandList().columns}
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

export default BrandList;
