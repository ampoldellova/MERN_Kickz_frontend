import React, { Fragment, useState, useEffect } from 'react'
import { Avatar, Box, Button, CssBaseline, InputLabel, TextField, Typography, Container } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import { getToken } from '../../utils/helpers';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MetaData from '../Layout/Metadata'
import axios from 'axios';

const UpdateProfile = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [avatar, setAvatar] = useState('')
    const [avatarPreview, setAvatarPreview] = useState('')
    const [error, setError] = useState('')
    const [user, setUser] = useState({})
    const [loading, setLoading] = useState(false)
    const [isUpdated, setIsUpdated] = useState(false)
    const defaultTheme = createTheme();
    let navigate = useNavigate();

    const getProfile = async () => {
        const config = {
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        }
        try {
            const { data } = await axios.get(`http://localhost:4002/api/v1/me`, config)
            console.log(data)
            setName(data.user.name);
            setEmail(data.user.email);
            setAvatarPreview(data.user.avatar.url)
            setLoading(false)
        } catch (error) {
            toast.error('User not found', {
                position: toast.POSITION.BOTTOM_RIGHT
            });
        }
    }

    const updateProfile = async (userData) => {
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${getToken()}`
            }
        }
        try {
            const { data } = await axios.put(`http://localhost:4002/api/v1/me/update`, userData, config)
            setIsUpdated(data.success)
            setLoading(false)
            toast.success('User updated', {
                position: toast.POSITION.BOTTOM_RIGHT
            });
            navigate('/me', { replace: true })


        } catch (error) {
            console.log(error)
            toast.error('User not found', {
                position: toast.POSITION.BOTTOM_RIGHT
            });
        }
    }

    // console.log(error)
    useEffect(() => {
        getProfile()

    }, [])

    const submitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.set('name', name);
        formData.set('email', email);
        formData.set('avatar', avatar);
        updateProfile(formData)
    }

    const onChange = e => {
        const reader = new FileReader();

        reader.onload = () => {
            if (reader.readyState === 2) {
                setAvatarPreview(reader.result)
                setAvatar(reader.result)
            }
        }

        reader.readAsDataURL(e.target.files[0])

    }
    console.log(user)
    return (
        <Fragment>
            <MetaData title={'Update Profile'} />

            <ThemeProvider theme={defaultTheme}>
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <Box
                        sx={{
                            marginTop: '50%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar alt="?" src={avatarPreview} sx={{ width: 60, height: 60, marginBottom: 1 }} />
                        <Typography component="h1" variant="h5">
                            Update Profile
                        </Typography>
                        <Box component="form" onSubmit={submitHandler} noValidate sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="name"
                                label="Name"
                                name="name"
                                autoComplete="name"
                                autoFocus
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="email"
                                label="Email"
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="avatar"
                                type="file"
                                id="customFile"
                                accept="images/*"
                                value={avatar.url}
                                onChange={onChange}
                            />
                            <InputLabel htmlFor="customFile">Upload an image</InputLabel>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2, backgroundColor: 'black' }}
                            >
                                Update Profile
                            </Button>
                        </Box>
                    </Box>
                </Container>
            </ThemeProvider>
        </Fragment>
    )
}

export default UpdateProfile