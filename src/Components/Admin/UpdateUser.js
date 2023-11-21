import React, { useState, useEffect } from 'react';
import { InputLabel, Button, TextField, createTheme, ThemeProvider, CssBaseline, Container, Grid, Box } from '@mui/material';
import MetaData from '../Layout/Metadata';
import { getToken, errMsg, successMsg } from '../../utils/helpers';
import { useNavigate, useParams } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../Layout/Loader';
import axios from 'axios';
import Navigation from './Navigation';

const defaultTheme = createTheme();

const UpdateUser = () => {
    const [open, setOpen] = useState(true);

    const toggleDrawer = () => {
        setOpen(!open);
    };

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [role, setRole] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [user, setUser] = useState(true)
    const [isUpdated, setIsUpdated] = useState(false)
    let navigate = useNavigate();

    const { id } = useParams();
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        }
    }
    const getUserDetails = async (id) => {

        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/admin/user/${id}`, config)
            setUser(data.user)
            setLoading(false)

        } catch (error) {
            setError(error.response.data.message)
        }
    }

    const updateUser = async (id, userData) => {
        try {
            const { data } = await axios.put(`${process.env.REACT_APP_API}/api/v1/admin/user/${id}`, userData, config)
            setIsUpdated(data.success)
            setLoading(false)

        } catch (error) {
            setError(error.response.data.message)
        }
    }

    useEffect(() => {
        // console.log(user && user._id !== userId);
        if (user && user._id !== id) {
            getUserDetails(id)
        } else {
            setName(user.name);
            setEmail(user.email);
            setRole(user.role)
        }
        if (error) {
            errMsg(error);
            setError('');
        }
        if (isUpdated) {
            successMsg('User updated successfully')
            navigate('/admin/users')

        }
    }, [error, isUpdated, id, user])
    const submitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.set('name', name);
        formData.set('email', email);
        formData.set('role', role);
        updateUser(user._id, formData)
    }

    return (
        <ThemeProvider theme={defaultTheme}>
            <MetaData title={'Update User'} />
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
                        <ThemeProvider theme={defaultTheme}>
                            <Container component="main" maxWidth="xs">
                                <CssBaseline />
                                <Box
                                    sx={{
                                        marginTop: 8,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Box component="form" onSubmit={submitHandler} noValidate sx={{ mt: 3 }}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <InputLabel>User Name</InputLabel>
                                                <TextField
                                                    name="User Name"
                                                    required
                                                    fullWidth
                                                    autoFocus
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <InputLabel>User Email</InputLabel>
                                                <TextField
                                                    required
                                                    fullWidth
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <InputLabel>User Role</InputLabel>
                                                <select
                                                    id="role_field"
                                                    className="form-control"
                                                    name='role'
                                                    value={role}
                                                    onChange={(e) => setRole(e.target.value)}
                                                    style={{ height: 55 }}
                                                >
                                                    <option value="user">User</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Button
                                                    variant='contained'
                                                    fullWidth
                                                    style={{ marginTop: 10 }}
                                                    type='submit'
                                                >
                                                    Update
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Box>
                            </Container>
                        </ThemeProvider>
                    )}
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default UpdateUser;
