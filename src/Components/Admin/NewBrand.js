import React, { useState, useEffect } from 'react';
import { createTheme, ThemeProvider, CssBaseline, Container, Grid, Box, Button, TextField, InputLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { getToken } from '../../utils/helpers';
import MetaData from '../Layout/Metadata';
import Navigation from './Navigation';

import { useFormik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
    name: Yup.string().required('Brand Name is required'),
    description: Yup.string().required('Brand description is required'),
    images: Yup.mixed().required('Brand image(s) is required'),
});

const defaultTheme = createTheme();

const NewBrand = () => {
    const [images, setImages] = useState([]);
    const [error, setError] = useState('')
    const [imagesPreview, setImagesPreview] = useState([]);
    const [loading, setLoading] = useState(true)
    const [success, setSuccess] = useState('')
    const [Brand, setBrand] = useState({})

    const formik = useFormik({
        initialValues: {
            name: '',
            description: '',
            images: ''
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            const formData = new FormData();
            formData.set('name', values.name);
            formData.set('description', values.description);

            images.forEach(image => {
                formData.append('images', image)
            })

            NewBrand(formData)
        },
    });

    let navigate = useNavigate()

    const onChange = e => {
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

    const NewBrand = async (formData) => {

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                }
            }

            const { data } = await axios.post(`${process.env.REACT_APP_API}/api/v1/admin/brand/new`, formData, config)
            setLoading(false)
            setSuccess(data.success)
            setBrand(data.product)
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

        if (success) {
            navigate('/admin/brands');
            toast.success('Brand created successfully', {
                position: toast.POSITION.BOTTOM_RIGHT
            })

        }

    }, [error, success])


    return (
        <ThemeProvider theme={defaultTheme}>
            <MetaData title={'Add Brand'} />
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
                            <Box component="form" noValidate onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            label="Brand Name"
                                            id="name"
                                            name="name"
                                            autoFocus
                                            value={formik.values.name}
                                            onChange={formik.handleChange}
                                            error={formik.touched.name && Boolean(formik.errors.name)}
                                            helperText={formik.touched.name && formik.errors.name}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            label="Description"
                                            id="description"
                                            name="description"
                                            multiline
                                            rows={8}
                                            value={formik.values.description}
                                            onChange={formik.handleChange}
                                            error={formik.touched.description && Boolean(formik.errors.description)}
                                            helperText={formik.touched.description && formik.errors.description}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <InputLabel>Upload Brand Image(s)</InputLabel>
                                        <TextField
                                            type='file'
                                            name='images'
                                            fullWidth
                                            inputProps={{
                                                multiple: true
                                            }}
                                            id='customFile'
                                            accept="images/*"
                                            onChange={(e) => {
                                                formik.handleChange(e)
                                                onChange(e)
                                            }}
                                            error={formik.touched.images && Boolean(formik.errors.images)}
                                            helperText={formik.touched.images && formik.errors.images}
                                        />

                                    </Grid>
                                    <Grid item xs={12}>
                                        {imagesPreview.map(img => (
                                            <img src={img} key={img} alt="Images Preview" className="mt-3 mr-2" width="75" height="75" />
                                        ))}
                                    </Grid>
                                </Grid>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                >
                                    Create Brand
                                </Button>
                            </Box>
                        </Box>
                    </Container>

                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default NewBrand;
