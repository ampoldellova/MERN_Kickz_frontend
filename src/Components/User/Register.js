import React, { Fragment, useState, useEffect } from 'react';
import { CssBaseline, Typography, TextField, Container, Avatar, Button, InputLabel, Grid } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import Metadata from '../Layout/Metadata';
import Box from '@mui/material/Box';
import axios from 'axios'

import { useFormik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
});

const defaultTheme = createTheme();

const Register = () => {

    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
    })

    const { name, email, password } = user;
    const [images, setImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);
    const [avatar, setAvatar] = useState('')
    const [avatarPreview, setAvatarPreview] = useState('/images/default_avatar.jpg')
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
            avatar: '',
            images: ''
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            console.log(images)
            console.log(values)
            const formData = new FormData();
            formData.set('name', values.name);
            formData.set('email', values.email);
            formData.set('password', values.password);
            formData.set('avatar', avatar);
            images.forEach(image => {
                formData.append('images', image)
            })

            register(formData);
        },
    });


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

    // const submitHandler = (e) => {
    //     e.preventDefault();

    //     const formData = new FormData();
    //     formData.set('name', name);
    //     formData.set('email', email);
    //     formData.set('password', password);
    //     formData.set('avatar', avatar);

    //     register(formData)
    // }

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

    const imagesOnChange = e => {
        const files = Array.from(e.target.files)
        setImagesPreview([]);
        setImages([])
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImagesPreview(oldArray => [...oldArray, reader.result])
                    setImages(oldArray => [...oldArray, reader.result])
                }
            }

            reader.readAsDataURL(file)
            // console.log(reader)
        })
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
                        <Box component="form" noValidate onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>

                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="name"
                                label="Name"
                                name="name"
                                autoFocus
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                error={formik.touched.name && Boolean(formik.errors.name)}
                                helperText={formik.touched.name && formik.errors.name}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="email"
                                label="Email"
                                type="email"
                                id="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                error={formik.touched.email && Boolean(formik.errors.email)}
                                helperText={formik.touched.email && formik.errors.email}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                error={formik.touched.password && Boolean(formik.errors.password)}
                                helperText={formik.touched.password && formik.errors.password}
                            />
                            <Grid>
                                <Grid item xs={12} md={6}>
                                    <InputLabel>Upload an image</InputLabel>
                                    <TextField
                                        fullWidth
                                        name="avatar"
                                        type="file"
                                        id="avatar"
                                        accept="images/*"
                                        onChange={onChange}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <InputLabel>Upload a Cover image(s)</InputLabel>
                                    <TextField
                                        type='file'
                                        fullWidth
                                        name='images'
                                        inputProps={{
                                            multiple: true
                                        }}
                                        id='customFile'
                                        onChange={imagesOnChange}
                                        multiple
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    {imagesPreview.map(img => (
                                        <img src={img} key={img} alt="Images Preview" className="mt-3 mr-2" width="100" height="100" />
                                    ))}
                                </Grid>
                            </Grid>

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2, backgroundColor: 'black' }}
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