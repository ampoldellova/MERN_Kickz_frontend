import React, { useState, useEffect, Fragment } from 'react';
import { createTheme, ThemeProvider, Box, Button, Typography, Container } from '@mui/material';
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

const SupplierList = () => {
    const [loading, setLoading] = useState(true)
    const [suppliers, setSupplier] = useState([])
    const [error, setError] = useState('')
    const [deleteError, setDeleteError] = useState('')
    const [isDeleted, setIsDeleted] = useState(false)

    let navigate = useNavigate()
    const getAdminSupplier = async () => {
        try {

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${getToken()}`
                }
            }

            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/admin/suppliers`, config)
            console.log(data)
            setLoading(false)
            setSupplier(data.supplier)
        } catch (error) {

            setError(error.response.data.message)

        }
    }

    useEffect(() => {
        getAdminSupplier()

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
            toast.success('Supplier deleted successfully', {
                position: toast.POSITION.BOTTOM_RIGHT
            })
            navigate('/admin/suppliers');

        }

    }, [error, deleteError, isDeleted,])

    const deleteSupplier = async (id) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${getToken()}`
                }
            }
            const { data } = await axios.delete(`${process.env.REACT_APP_API}/api/v1/admin/supplier/${id}`, config)

            setIsDeleted(data.success)
        } catch (error) {
            setDeleteError(error.response.data.message)

        }
    }

    const supplierList = () => {
        const data = {
            columns: [
                {
                    headerName: 'Supplier ID',
                    field: 'id',
                    width: 400,
                    sort: 'asc',
                    align: 'center',
                    headerAlign: 'center'
                },

                {
                    headerName: 'Supplier Name',
                    field: 'name',
                    width: 350,
                    sort: 'asc',
                    align: 'center',
                    headerAlign: 'center'
                },
                {
                    headerName: 'Actions',
                    field: 'actions',
                    width: 400,
                    headerAlign: 'center',
                    renderCell: ({ value }) => (
                        <Container style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Link to={`/admin/supplier/${value}`}>
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
                                onClick={() => deleteSupplierHandler(value)}
                            >
                                <DeleteIcon />
                            </Button>
                        </Container>
                    ),
                },
            ],
            rows: []
        }

        suppliers.forEach(supplier => {
            data.rows.push({
                id: supplier._id,
                name: supplier.name,
                actions: supplier._id
            })
        })
        return data;
    }

    const deleteSupplierHandler = (id) => {
        deleteSupplier(id)
    }

    return (
        <ThemeProvider theme={defaultTheme}>
            <MetaData title={'List of Suppliers'} />
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
                        <Container>
                            <div style={{ height: 'auto', width: '100%', marginTop: 100 }}>
                                <Box textAlign="center" style={{ margin: 20 }}>
                                    <Typography variant='h3' style={{ fontWeight: 1000 }}>List of Suppliers</Typography>
                                    <Link to="/admin/supply" style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <Button variant='contained' startIcon={<AddCircleIcon />} style={{ marginTop: 10 }}>Add Supplier</Button>
                                    </Link>
                                </Box>
                                <DataGrid
                                    rows={supplierList().rows}
                                    columns={supplierList().columns}
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
        </ThemeProvider>
    );
};

export default SupplierList;
