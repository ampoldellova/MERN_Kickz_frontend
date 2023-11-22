import React, { useState, useEffect } from 'react';
import { createTheme, ThemeProvider, CssBaseline, Container, Grid, Box, TextField, InputLabel, Button } from '@mui/material';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { getToken } from '../../utils/helpers';
import MetaData from '../Layout/Metadata';
import Navigation from './Navigation';
import Loader from '../Layout/Loader';

const defaultTheme = createTheme();

const UpdateBrand = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState([]);
    const [oldImages, setOldImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);
    const [error, setError] = useState('');
    const [brand, setbrand] = useState({});
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

    const getBrandDetails = async (id) => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/admin/brand/${id}`)
            setbrand(data.brand)
            setLoading(false)

        } catch (error) {
            setError(error.response.data.message)

        }
    }

    const UpdateBrand = async (id, brandData) => {
        try {

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                }
            }
            const { data } = await axios.put(`${process.env.REACT_APP_API}/api/v1/admin/brand/${id}`, brandData, config)
            setIsUpdated(data.success)

        } catch (error) {
            setUpdateError(error.response.data.message)

        }
    }

    useEffect(() => {
        if (brand && brand._id !== id) {
            getBrandDetails(id)
        } else {
            setName(brand.name);
            setDescription(brand.description);
            setOldImages(brand.images);
        }
        if (error) {
            errMsg(error)

        }
        if (updateError) {
            errMsg(updateError);

        }
        if (isUpdated) {
            navigate('/admin/brands');
            successMsg('brand updated successfully');

        }
    }, [error, isUpdated, updateError, brand, id])

    const submitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.set('name', name);
        formData.set('description', description);

        images.forEach(image => {
            formData.append('images', image)
        })
        UpdateBrand(brand._id, formData)
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
            <MetaData title={'Update Brand'} />
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
                                                    label="Brand Name"
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
                                                <InputLabel>Upload Brand Image(s)</InputLabel>
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
                                            Update Brand
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

export default UpdateBrand;
