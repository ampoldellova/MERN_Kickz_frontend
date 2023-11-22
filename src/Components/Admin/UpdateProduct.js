import React, { useState, Fragment, useEffect } from 'react';
import { MenuItem, styled, createTheme, ThemeProvider, CssBaseline, Drawer as MuiDrawer, AppBar as MuiAppBar, Toolbar, List, Typography, Divider, IconButton, Container, Grid, Box, Avatar, Button, TextField, FormControlLabel, Checkbox, Link as MuiLink, InputLabel } from '@mui/material';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { getToken } from '../../utils/helpers';
import MetaData from '../Layout/Metadata';
import Navigation from './Navigation';
import Loader from '../Layout/Loader';

import { useFormik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
    name: Yup.string().required('Shoe Name is required'),
    price: Yup.number().typeError('Invalid price').required('Shoe price is required'),
    description: Yup.string().required('Shoe description is required'),
    type: Yup.string().required('Shoe type is required'),
    stock: Yup.number().required('Shoe stock is required'),
    colorway: Yup.string().required('Shoe color is required'),
    brand: Yup.string().required('Shoe brand is required'),
});

const defaultTheme = createTheme();

const UpdateProduct = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [stock, setStock] = useState(0);
    const [colorway, setColor] = useState('');
    const [brand, setBrand] = useState('');
    const [images, setImages] = useState([]);
    const [oldImages, setOldImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);
    const [error, setError] = useState('');
    const [product, setProduct] = useState({});
    const [loading, setLoading] = useState(true);
    const [updateError, setUpdateError] = useState('');
    const [isUpdated, setIsUpdated] = useState(false);


    const categories = [
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

            images.forEach(image => {
                formData.append('images', image)
            })

            updateProduct(id, formData)
        },
    });

    let { id } = useParams();
    let navigate = useNavigate();

    const errMsg = (message = '') => toast.error(message, {
        position: toast.POSITION.BOTTOM_CENTER
    });
    const successMsg = (message = '') => toast.success(message, {
        position: toast.POSITION.BOTTOM_CENTER
    });

    // const getProductDetails = async (id) => {
    //     try {
    //         const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/${id}`)
    //         setProduct(data.product)
    //         setLoading(false)

    //     } catch (error) {
    //         setError(error.response.data.message)

    //     }
    // }

    const updateProduct = async (id, productData) => {
        try {

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                }
            }
            const { data } = await axios.put(`${process.env.REACT_APP_API}/api/v1/admin/product/${id}`, productData, config)
            setIsUpdated(data.success)
            navigate('/admin/products');
            successMsg('Product updated successfully');

        } catch (error) {
            setUpdateError(error.response.data.message)

        }
    }

    // const submitHandler = (e) => {
    //     e.preventDefault();
    //     const formData = new FormData();
    //     formData.set('name', name);
    //     formData.set('price', price);
    //     formData.set('description', description);
    //     formData.set('category', category);
    //     formData.set('stock', stock);
    //     formData.set('colorway', colorway);
    //     formData.set('brand', brand);
    //     images.forEach(image => {
    //         formData.append('images', image)
    //     })
    //     updateProduct(product._id, formData)
    // }

    const getSingleProduct = async () => {

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${getToken()}`
            }
        }

        const { data: { product } } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/${id}`, config);

        formik.setFieldValue('name', product.name);
        formik.setFieldValue('price', product.price);
        formik.setFieldValue('description', product.description);
        formik.setFieldValue('type', product.type);
        formik.setFieldValue('stock', product.stock);
        formik.setFieldValue('colorway', product.colorway);
        formik.setFieldValue('brand', product.brand);
        setImagesPreview(product.images.flatMap(image => image.url));
        setProduct(product)
        setLoading(false)
    }

    const onChange = e => {
        const files = Array.from(e.target.files)
        setImagesPreview([]);
        setImages([])
        setOldImages([])
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImagesPreview(oldArray => [...oldArray, reader.result])
                    setImages(oldArray => [...oldArray, reader.result])
                }
            }
            reader.readAsDataURL(file)
        })
    }

    useEffect(() => {
        getSingleProduct()
    }, [])

    // useEffect(() => {
    //     if (product && product._id !== id) {
    //         getSingleProduct(id)
    //     } else {
    //         setName(product.name);
    //         setPrice(product.price);
    //         setDescription(product.description);
    //         setCategory(product.type);
    //         setBrand(product.brand);
    //         setStock(product.stock);
    //         setColor(product.colorway);
    //     }
    //     if (error) {
    //         errMsg(error)

    //     }
    //     if (updateError) {
    //         errMsg(updateError);

    //     }
    //     if (isUpdated) {
    //         navigate('/admin/products');
    //         successMsg('Product updated successfully');

    //     }
    // }, [error, isUpdated, updateError, product, id])

    return (
        <ThemeProvider theme={defaultTheme}>
            <MetaData title={'Update Product'} />
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
                                    <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 3 }}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <InputLabel>Shoe Name</InputLabel>
                                                <TextField
                                                    name="name"
                                                    required
                                                    fullWidth
                                                    id="name"
                                                    autoFocus
                                                    value={formik.values.name}
                                                    onChange={formik.handleChange}
                                                    error={formik.touched.name && Boolean(formik.errors.name)}
                                                    helperText={formik.touched.name && formik.errors.name}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <InputLabel>Shoe Price</InputLabel>
                                                <TextField
                                                    required
                                                    fullWidth
                                                    id="price"
                                                    name="price"
                                                    value={formik.values.price}
                                                    onChange={formik.handleChange}
                                                    error={formik.touched.price && Boolean(formik.errors.price)}
                                                    helperText={formik.touched.price && formik.errors.price}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <InputLabel>Shoe Type</InputLabel>
                                                <TextField
                                                    required
                                                    fullWidth
                                                    name="type"
                                                    id="type"
                                                    select
                                                    value={formik.values.type}
                                                    onChange={formik.handleChange}
                                                    error={formik.touched.type && Boolean(formik.errors.type)}
                                                    helperText={formik.touched.type && formik.errors.type}
                                                >
                                                    {categories.map(category => (
                                                        <MenuItem key={category} value={category} >{category}</MenuItem >
                                                    ))}
                                                </TextField>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <InputLabel>Brand</InputLabel>
                                                <TextField
                                                    required
                                                    fullWidth
                                                    id="brand"
                                                    value={formik.values.brand}
                                                    onChange={formik.handleChange}
                                                    error={formik.touched.brand && Boolean(formik.errors.brand)}
                                                    helperText={formik.touched.brand && formik.errors.brand}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <InputLabel>Shoe Description</InputLabel>
                                                <TextField
                                                    required
                                                    fullWidth
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
                                                <InputLabel>Stock</InputLabel>
                                                <TextField
                                                    required
                                                    fullWidth
                                                    type='number'
                                                    id="stock"
                                                    value={formik.values.stock}
                                                    onChange={formik.handleChange}
                                                    error={formik.touched.stock && Boolean(formik.errors.stock)}
                                                    helperText={formik.touched.stock && formik.errors.stock}
                                                />
                                            </Grid>
                                            <Grid item xs={8}>
                                                <InputLabel>Colorway</InputLabel>
                                                <TextField
                                                    required
                                                    fullWidth
                                                    id="colorway"
                                                    value={formik.values.colorway}
                                                    onChange={formik.handleChange}
                                                    error={formik.touched.colorway && Boolean(formik.errors.colorway)}
                                                    helperText={formik.touched.colorway && formik.errors.colorway}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <InputLabel>Upload Shoe Image(s)</InputLabel>
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
                                                {oldImages && oldImages.map(img => (
                                                    <img key={img} src={img.url} alt={img.url} className="mt-3 mr-2" width="75" height="75" />
                                                ))}
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
                                            Update Product
                                        </Button>
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

export default UpdateProduct;
