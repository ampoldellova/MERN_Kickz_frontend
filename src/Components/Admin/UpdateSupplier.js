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

const UpdateSupplier = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState([]);
    const [oldImages, setOldImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);
    const [error, setError] = useState('');
    const [supplier, setSupplier] = useState({});
    const [loading, setLoading] = useState(true);
    const [updateError, setUpdateError] = useState('');
    const [isUpdated, setIsUpdated] = useState(false);

    let { id } = useParams();
    let navigate = useNavigate();

    const errMsg = (message = '') => toast.error(message, {
        position: toast.POSITION.BOTTOM_CENTER
    });
    const successMsg = (message = '') => toast.success(message, {
        position: toast.POSITION.BOTTOM_CENTER
    });

    const getSupplierDetails = async (id) => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/admin/supplier/${id}`)
            setSupplier(data.supplier)
            setLoading(false)

        } catch (error) {
            setError(error.response.data.message)

        }
    }

    const updateSupplier = async (id, supplierData) => {
        try {

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                }
            }
            const { data } = await axios.put(`${process.env.REACT_APP_API}/api/v1/admin/supplier/${id}`, supplierData, config)
            setIsUpdated(data.success)

        } catch (error) {
            setUpdateError(error.response.data.message)

        }
    }

    useEffect(() => {
        if (supplier && supplier._id !== id) {
            getSupplierDetails(id)
        } else {
            setName(supplier.name);
            setDescription(supplier.description);
            setOldImages(supplier.images);
        }
        if (error) {
            errMsg(error)

        }
        if (updateError) {
            errMsg(updateError);

        }
        if (isUpdated) {
            navigate('/admin/suppliers');
            successMsg('Supplier updated successfully');

        }
    }, [error, isUpdated, updateError, supplier, id])

    const submitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.set('name', name);
        formData.set('description', description);

        images.forEach(image => {
            formData.append('images', image)
        })
        updateSupplier(supplier._id, formData)
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
            <MetaData title={'Update Supplier'} />
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
                                    <Box component="form" noValidate onSubmit={submitHandler} sx={{ mt: 3 }}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <TextField
                                                    required
                                                    fullWidth
                                                    label="Supplier Name"
                                                    id="name"
                                                    name="name"
                                                    autoFocus
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}

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
                                                    value={description}
                                                    onChange={(e) => setDescription(e.target.value)}
                                                />
                                            </Grid>

                                            <Grid item xs={12}>
                                                <InputLabel>Upload Shoe Image(s)</InputLabel>
                                                <input
                                                    type='file'
                                                    name='images'
                                                    className='custom-file-input'
                                                    id='customFile'
                                                    accept="images/*"
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
                                            Update Supplier
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

export default UpdateSupplier;
