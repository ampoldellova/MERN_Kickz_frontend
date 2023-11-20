import React, { useState, Fragment, useEffect } from 'react';
import { MenuItem, styled, createTheme, ThemeProvider, CssBaseline, Drawer as MuiDrawer, AppBar as MuiAppBar, Toolbar, List, Typography, Divider, IconButton, Container, Grid, Box, Avatar, Button, TextField, FormControlLabel, Checkbox, Link as MuiLink, InputLabel } from '@mui/material';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { getToken } from '../../utils/helpers';
import MetaData from '../Layout/Metadata';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import SideBar from './SideBar';

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        '& .MuiDrawer-paper': {
            position: 'relative',
            whiteSpace: 'nowrap',
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
            boxSizing: 'border-box',
            ...(!open && {
                overflowX: 'hidden',
                transition: theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
                width: theme.spacing(7),
                [theme.breakpoints.up('sm')]: {
                    width: theme.spacing(9),
                },
            }),
        },
    }),
);

const defaultTheme = createTheme();

const NewProduct = () => {
    const [open, setOpen] = useState(true);

    const toggleDrawer = () => {
        setOpen(!open);
    };

    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('');
    const [type, setType] = useState('');
    const [stock, setStock] = useState(0);
    const [colorway, setColor] = useState('');
    const [brand, setBrand] = useState('');
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

    let navigate = useNavigate()

    const submitHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.set('name', name);
        formData.set('price', price);
        formData.set('description', description);
        formData.set('type', type);
        formData.set('stock', stock);
        formData.set('colorway', colorway);
        formData.set('brand', brand);

        images.forEach(image => {
            formData.append('images', image)
        })

        newProduct(formData)
    }

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

            const { data } = await axios.post(`http://localhost:4002/api/v1/admin/product/new`, formData, config)
            setLoading(false)
            setSuccess(data.success)
            setProduct(data.product)
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
            navigate('/admin/products');
            toast.success('Product created successfully', {
                position: toast.POSITION.BOTTOM_RIGHT
            })

        }

    }, [error, success,])

    return (
        <ThemeProvider theme={defaultTheme}>
            <MetaData title={'Add Shoe Product'} />
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar position="absolute" open={open}>
                    <Toolbar
                        sx={{
                            pr: '24px',
                            backgroundColor: 'black'
                        }}
                    >
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            onClick={toggleDrawer}
                            sx={{
                                marginRight: '36px',
                                ...(open && { display: 'none' }),
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography
                            component="h1"
                            variant="h6"
                            color="inherit"
                            noWrap
                            sx={{ flexGrow: 1 }}
                        >
                            Add Shoe Product
                        </Typography>
                        <Link to="/">
                            <img src="https://res.cloudinary.com/dwkmutbz3/image/upload/v1699103432/Kickz/logo/kickz_piufvo.png"
                                style={{
                                    width: 40,
                                    height: 40,
                                    cursor: 'pointer'
                                }} alt="Kickz" />
                        </Link>
                    </Toolbar>
                </AppBar>
                <Drawer variant="permanent" open={open}>
                    <Toolbar
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            px: [1],
                        }}
                    >
                        <IconButton onClick={toggleDrawer}>
                            <ChevronLeftIcon />
                        </IconButton>
                    </Toolbar>
                    <Divider />
                    <List component="nav">
                        <SideBar />
                        <Divider sx={{ my: 1 }} />
                    </List>
                </Drawer>
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
                                            <TextField
                                                required
                                                fullWidth
                                                label="Shoe Name"
                                                autoFocus
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                required
                                                fullWidth
                                                label="Shoe Price"
                                                value={price}
                                                onChange={(e) => setPrice(e.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                required
                                                fullWidth
                                                label="Shoe Type"
                                                select
                                                value={type}
                                                onChange={(e) => setType(e.target.value)}
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
                                                value={brand}
                                                onChange={(e) => setBrand(e.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                required
                                                fullWidth
                                                label="Shoe Description"
                                                multiline
                                                rows={8}
                                                value={description} onChange={(e) => setDescription(e.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={4}>
                                            <TextField
                                                required
                                                fullWidth
                                                label="Stock"
                                                type='number'
                                                value={stock}
                                                onChange={(e) => setStock(e.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={8}>
                                            <TextField
                                                required
                                                fullWidth
                                                label="Color"
                                                value={colorway}
                                                onChange={(e) => setColor(e.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <InputLabel>Upload Shoe Image(s)</InputLabel>
                                            <input
                                                type='file'
                                                name='images'
                                                className='custom-file-input'
                                                id='customFile'
                                                onChange={onChange}
                                                multiple
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
                    </ThemeProvider>
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default NewProduct;
