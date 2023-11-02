import React, { Fragment, useState, useEffect } from 'react'
import { Avatar, Button, CssBaseline, TextField, Box, Typography, Container } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { getToken } from '../../utils/helpers';
import 'react-toastify/dist/ReactToastify.css';
import MetaData from '../Layout/Metadata';
import axios from 'axios';

const UpdatePassword = () => {
    const [oldPassword, setOldPassword] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isUpdated, setIsUpdated] = useState(false)
    const [loading, setLoading] = useState(false)
    const defaultTheme = createTheme();
    let navigate = useNavigate();

    const updatePassword = async (formData) => {
        console.log(formData)
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                }
            }

            const { data } = await axios.put(`http://localhost:4002/api/v1/password/update`, formData, config)
            setIsUpdated(data.success)
            setLoading(false)
            toast.success('Password updated', {
                position: toast.POSITION.BOTTOM_RIGHT
            });
            navigate('/me')
        } catch (error) {
            setError(error.response.data.message)
        }
    }
    useEffect(() => {
        if (error) {
            toast.error(error, {
                position: toast.POSITION.BOTTOM_RIGHT
            });
        }
    }, [error,])

    const submitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.set('oldPassword', oldPassword);
        formData.set('password', password);
        updatePassword(formData)
    }

    return (
        <Fragment>
            <MetaData title={'Change Password'} />

            <ThemeProvider theme={defaultTheme}>
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            marginTop: '50%'
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Change Password
                        </Typography>
                        <Box component="form" onSubmit={submitHandler} noValidate sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Old Password"
                                type="password"
                                id="password"
                                autoComplete="oldPassword"
                                autoFocus
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                disabled={loading ? true : false}
                            >
                                Update Password
                            </Button>
                        </Box>
                    </Box>
                </Container>
            </ThemeProvider>
        </Fragment>
    )
}

export default UpdatePassword