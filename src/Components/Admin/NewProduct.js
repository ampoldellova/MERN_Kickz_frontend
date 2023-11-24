import React, { useState, useEffect } from 'react';
import { MenuItem, createTheme, ThemeProvider, CssBaseline, Container, Grid, Box, Button, TextField, InputLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { getToken } from '../../utils/helpers';
import MetaData from '../Layout/Metadata';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import Navigation from './Navigation';

const validationSchema = Yup.object({
    name: Yup.string().required('Shoe Name is required'),
    price: Yup.number().typeError('Invalid price').required('Shoe price is required'),
    description: Yup.string().required('Shoe description is required'),
    type: Yup.string().required('Shoe type is required'),
    stock: Yup.number().required('Shoe stock is required'),
    colorway: Yup.string().required('Shoe color is required'),
    brand: Yup.string().required('Shoe brand is required'),
    images: Yup.mixed().required('Shoe image(s) is required'),
    size: Yup.number().typeError('Invalid Shoe size').required('Shoe size is required'),
});

const defaultTheme = createTheme();

const NewProduct = () => {
    const [brands, setBrands] = useState([]);
    const [images, setImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([])
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)
    const [success, setSuccess] = useState('')
    const [product, setProduct] = useState({})

    const types = [
        'High-tops',
        'Mid-cut',
        'Low-tops',
        'Slip-ons'
    ]

    const formik = useFormik({
        initialValues: {
            name: '',
            price: '',
            description: '',
            type: '',
            stock: '',
            colorway: '',
            brand: '',
            images: '',
            size: ''
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            const formData = new FormData();
            formData.set('name', values.name);
            formData.set('price', values.price);
            formData.set('description', values.description);
            formData.set('type', values.type);
            formData.set('stock', values.stock);
            formData.set('colorway', values.colorway);
            formData.set('brand', values.brand);
            formData.set('size', values.size);

            images.forEach(image => {
                formData.append('images', image)
            })

            newProduct(formData)
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
    const newProduct = async (formData) => {

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                }
            }

            const { data } = await axios.post(`${process.env.REACT_APP_API}/api/v1/admin/product/new`, formData, config)
            setLoading(false)
            setSuccess(data.success)
            setProduct(data.product)
        } catch (error) {
            setError(error.response.data.message)

        }
    }
    useEffect(() => {

        axios
            .get(`${process.env.REACT_APP_API}/api/v1/admin/brands`)
            .then((response) => {
                console.log('Brands data:', response.data);
                setBrands(response.data.brand);
            })
            .catch((error) => {
                console.error('Failed to fetch brands:', error);
            });

        if (error) {
            toast.error(error, {
                position: toast.POSITION.BOTTOM_RIGHT
            });
        }

        if (success) {
            navigate('/admin/products');
            toast.success('Product created successfully', {
                position: toast.POSITION.BOTTOM_RIGHT
            })

        }

    }, [error, success])

    return (
        <ThemeProvider theme={defaultTheme}>
            <MetaData title={'Add Shoe Product'} />
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
                            <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 3 }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            label="Shoe Name"
                                            id="name"
                                            name="name"
                                            autoFocus
                                            value={formik.values.name}
                                            onChange={formik.handleChange}
                                            error={formik.touched.name && Boolean(formik.errors.name)}
                                            helperText={formik.touched.name && formik.errors.name}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            label="Shoe Price"
                                            id="price"
                                            name="price"
                                            value={formik.values.price}
                                            onChange={formik.handleChange}
                                            error={formik.touched.price && Boolean(formik.errors.price)}
                                            helperText={formik.touched.price && formik.errors.price}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            label="Shoe Type"
                                            id="type"
                                            name="type"
                                            select
                                            value={formik.values.type}
                                            onChange={formik.handleChange}
                                            error={formik.touched.type && Boolean(formik.errors.type)}
                                            helperText={formik.touched.type && formik.errors.type}
                                        >
                                            {types.map(type => (
                                                <MenuItem key={type} value={type} >{type}</MenuItem >
                                            ))}
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            label="Shoe Brand"
                                            id="brand"
                                            name="brand"
                                            select
                                            value={formik.values.brand}
                                            onChange={formik.handleChange}
                                            error={formik.touched.brand && Boolean(formik.errors.brand)}
                                            helperText={formik.touched.brand && formik.errors.brand}

                                        >
                                            {brands && brands.map(brand => (
                                                <MenuItem key={brand._id} value={brand._id} >{brand.name}</MenuItem >
                                            ))}
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            label="Shoe Description"
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
                                    <Grid item xs={4}>
                                        <TextField
                                            required
                                            fullWidth
                                            label="Stock"
                                            type='number'
                                            id="stock"
                                            name="stock"
                                            value={formik.values.stock}
                                            onChange={formik.handleChange}
                                            error={formik.touched.stock && Boolean(formik.errors.stock)}
                                            helperText={formik.touched.stock && formik.errors.stock}
                                        />
                                    </Grid>
                                    <Grid item xs={8}>
                                        <TextField
                                            required
                                            fullWidth
                                            label="Color"
                                            id="colorway"
                                            name="colorway"
                                            value={formik.values.colorway}
                                            onChange={formik.handleChange}
                                            error={formik.touched.colorway && Boolean(formik.errors.colorway)}
                                            helperText={formik.touched.colorway && formik.errors.colorway}
                                        />
                                    </Grid>
                                    <Grid item xs={8}>
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
                                            multiple
                                        />
                                        <InputLabel>Upload Shoe Image(s)</InputLabel>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <TextField
                                            required
                                            fullWidth
                                            label="Size"
                                            id="size"
                                            name="size"
                                            value={formik.values.size}
                                            onChange={formik.handleChange}
                                            error={formik.touched.size && Boolean(formik.errors.size)}
                                            helperText={formik.touched.size && formik.errors.size}
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
                                    Create Shoe Product
                                </Button>
                            </Box>
                        </Box>
                    </Container>

                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default NewProduct;
