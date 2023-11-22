import React, { useState, useEffect, Fragment } from 'react';
import { createTheme, ThemeProvider, Box, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button } from '@mui/material';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import MetaData from '../Layout/Metadata';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Navigation from './Navigation';
import { getToken, successMsg, errMsg } from '../../utils/helpers';
import Loader from '../Layout/Loader';
import { BsPrefixComponent } from 'react-bootstrap/esm/helpers';

const defaultTheme = createTheme();

const UsersList = () => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [allUsers, setAllUsers] = useState([])
    const [isDeleted, setIsDeleted] = useState('')
    let navigate = useNavigate();
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        }
    }
    const listUsers = async () => {
        try {

            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/admin/users`, config)
            setAllUsers(data.users)
            setLoading(false)

        } catch (error) {
            setError(error.response.data.message)

        }
    }
    const deleteUser = async (id) => {
        try {
            const { data } = await axios.delete(`${process.env.REACT_APP_API}/api/v1/admin/user/${id}`, config)
            setIsDeleted(data.success)
            setLoading(false)

        } catch (error) {
            setError(error.response.data.message)

        }
    }

    useEffect(() => {
        listUsers();
        if (error) {
            errMsg(error);
            setError('')
        }
        if (isDeleted) {
            successMsg('User deleted successfully');
            navigate('/admin/users');

        }

    }, [error, isDeleted,])


    const deleteUserHandler = (id) => {
        deleteUser(id)
    }

    const setUsers = () => {
        const data = {
            columns: [
                {
                    headerName: 'User ID',
                    field: 'id',
                    width: 300,
                    sort: 'asc'
                },
                {
                    headerName: 'Name',
                    field: 'name',
                    width: 300,
                    sort: 'asc'
                },
                {
                    headerName: 'Email',
                    field: 'email',
                    width: 300,
                    sort: 'asc'
                },
                {
                    headerName: 'Role',
                    field: 'role',
                    width: 300,
                    sort: 'asc'
                },
                {
                    headerName: 'Actions',
                    field: 'actions',
                    width: 300,
                    renderCell: ({ value }) => (
                        <Fragment>
                            <Link to={`/admin/user/${value}`}>
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
                                onClick={() => deleteUserHandler(value)}
                            >
                                <DeleteIcon />
                            </Button>
                        </Fragment>
                    )
                },
            ],
            rows: []
        }
        allUsers.forEach(user => {
            data.rows.push({
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                actions: user._id
            })
        })
        return data;
    }
    return (
        <ThemeProvider theme={defaultTheme}>
            <MetaData title={'List of Users'} />
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
                            <Box textAlign="center" style={{margin: 20}}>
                                <Typography variant='h3' style={{ fontWeight: 1000 }}>List of Customers</Typography>
                                <Link to="/register" style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <Button variant='contained' startIcon={<AddCircleIcon />}>Add User</Button>
                                </Link>
                            </Box>
                            <DataGrid
                                rows={setUsers().rows}
                                columns={setUsers().columns}
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

export default UsersList;
