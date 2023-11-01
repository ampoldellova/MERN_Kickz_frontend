import React, { Fragment, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Metadata from '../Layout/Metadata'
import axios from 'axios'

const defaultTheme = createTheme();

const Register = () => {

    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
    })

    const { name, email, password } = user;

    const [avatar, setAvatar] = useState('')
    const [avatarPreview, setAvatarPreview] = useState('/images/default_avatar.jpg')
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)


    let navigate = useNavigate()
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/')
        }
        if (error) {
            console.log(error)
            setError()
        }

    }, [error.isAuthenticated, navigate])

    const submitHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.set('name', name);
        formData.set('email', email);
        formData.set('password', password);
        formData.set('avatar', avatar);

        register(formData)
    }

    const onChange = e => {
        if (e.target.name === 'avatar') {

            const reader = new FileReader();

            reader.onload = () => {
                if (reader.readyState === 2) {
                    setAvatarPreview(reader.result)
                    setAvatar(reader.result)
                }
            }

            reader.readAsDataURL(e.target.files[0])

        } else {
            setUser({ ...user, [e.target.name]: e.target.value })
        }
    }

    const register = async (userData) => {
        try {
            setLoading(false)
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }

            const { data } = await axios.post(`http://localhost:4002/api/v1/register`, userData, config)
            console.log(data.user)
            setIsAuthenticated(true)
            setUser(data.user)
            navigate('/')

        } catch (error) {
            setIsAuthenticated(false)
            setLoading(false)
            setUser(null)
            setError(error.response.data.message)
            console.log(error.response.data.message)
        }
    }

    return (
        <Fragment>
            <Metadata title={'Register'} />
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
                        <Avatar alt="?" src={avatarPreview} sx={{ width: 60, height: 60, marginBottom: 1 }} />
                        <Typography component="h1" variant="h5">
                            Register
                        </Typography>
                        <Box component="form" onSubmit={submitHandler} noValidate sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="name"
                                label="Name"
                                name="name"
                                autoFocus
                                value={name}
                                onChange={onChange}
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
                                onChange={onChange}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                value={password}
                                onChange={onChange}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="avatar"
                                type="file"
                                id="avatar"
                                accept="images/*"
                                onChange={onChange}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Register
                            </Button>
                        </Box>
                    </Box>
                </Container>
            </ThemeProvider>
        </Fragment>
    );
}

export default Register