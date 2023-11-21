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

const defaultTheme = createTheme();

const UpdateProduct = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [stock, setStock] = useState(0);
    const [colorway, setColor] = useState('');
    const [seller, setSeller] = useState('');
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

    let { id } = useParams();
    let navigate = useNavigate();

    const errMsg = (message = '') => toast.error(message, {
        position: toast.POSITION.BOTTOM_CENTER
    });
    const successMsg = (message = '') => toast.success(message, {
        position: toast.POSITION.BOTTOM_CENTER
    });

    const getProductDetails = async (id) => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/${id}`)
            setProduct(data.product)
            setLoading(false)

        } catch (error) {
            setError(error.response.data.message)

        }
    }

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

        } catch (error) {
            setUpdateError(error.response.data.message)

        }
    }
    useEffect(() => {
        if (product && product._id !== id) {
            getProductDetails(id)
        } else {
            setName(product.name);
            setPrice(product.price);
            setDescription(product.description);
            setCategory(product.type);
            setSeller(product.brand);
            setStock(product.stock);
            setColor(product.colorway);
            setOldImages(product.images);
        }
        if (error) {
            errMsg(error)

        }
        if (updateError) {
            errMsg(updateError);

        }
        if (isUpdated) {
            navigate('/admin/products');
            successMsg('Product updated successfully');

        }
    }, [error, isUpdated, updateError, product, id])

    const submitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.set('name', name);
        formData.set('price', price);
        formData.set('description', description);
        formData.set('category', category);
        formData.set('stock', stock);
        formData.set('colorway', colorway);
        formData.set('seller', seller);
        images.forEach(image => {
            formData.append('images', image)
        })
        updateProduct(product._id, formData)
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
                                    <Box component="form" onSubmit={submitHandler} noValidate sx={{ mt: 3 }}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <InputLabel>Shoe Name</InputLabel>
                                                <TextField
                                                    name="Product Name"
                                                    required
                                                    fullWidth
                                                    id="productName"
                                                    autoFocus
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <InputLabel>Shoe Price</InputLabel>
                                                <TextField
                                                    required
                                                    fullWidth
                                                    id="Price"
                                                    name="Price"
                                                    value={price}
                                                    onChange={(e) => setPrice(e.target.value)}
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
                                                    value={category}
                                                    onChange={(e) => setCategory(e.target.value)}
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
                                                    id="type"
                                                    value={seller}
                                                    onChange={(e) => setSeller(e.target.value)}
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
                                                    value={description} onChange={(e) => setDescription(e.target.value)}
                                                />
                                            </Grid>
                                            <Grid item xs={4}>
                                                <InputLabel>Stock</InputLabel>
                                                <TextField
                                                    required
                                                    fullWidth
                                                    type='number'
                                                    id="stock"
                                                    value={stock}
                                                    onChange={(e) => setStock(e.target.value)}
                                                />
                                            </Grid>
                                            <Grid item xs={8}>
                                                <InputLabel>Colorway</InputLabel>
                                                <TextField
                                                    required
                                                    fullWidth
                                                    id="colorway"
                                                    value={colorway}
                                                    onChange={(e) => setColor(e.target.value)}
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
                                                    onChange={onChange}
                                                    multiple
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
