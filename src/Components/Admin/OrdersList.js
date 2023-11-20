import React, { useState, useEffect, Fragment } from 'react';
import { styled, createTheme, ThemeProvider, CssBaseline, Drawer as MuiDrawer, AppBar as MuiAppBar, Toolbar, List, Typography, Divider, IconButton, Box, } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MetaData from '../Layout/Metadata';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SideBar from './SideBar';
import { getToken } from '../../utils/helpers';

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

const OrdersList = () => {
    const [open, setOpen] = useState(true);

    const toggleDrawer = () => {
        setOpen(!open);
    };

    let navigate = useNavigate();
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [allOrders, setAllOrders] = useState([])
    const [isDeleted, setIsDeleted] = useState(false)
    const errMsg = (message = '') => toast.error(message, {
        position: toast.POSITION.BOTTOM_CENTER
    });
    const successMsg = (message = '') => toast.success(message, {
        position: toast.POSITION.BOTTOM_CENTER
    });

    const listOrders = async () => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                }
            }
            const { data } = await axios.get(`http://localhost:4002/api/v1/admin/orders`, config)
            setAllOrders(data.orders)
            setLoading(false)
        } catch (error) {
            setError(error.response.data.message)
        }
    }
    const deleteOrder = async (id) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                }
            }
            const { data } = await axios.delete(`http://localhost:4002/api/v1/admin/order/${id}`, config)
            setIsDeleted(data.success)
            setLoading(false)
        } catch (error) {
            setError(error.response.data.message)

        }
    }
    useEffect(() => {
        listOrders()
        if (error) {
            errMsg(error)
            setError('')
        }
        if (isDeleted) {
            successMsg('Order deleted successfully');
            navigate('/admin/orders');
        }
    }, [error, isDeleted])
    const deleteOrderHandler = (id) => {
        deleteOrder(id)
    }
    const setOrders = () => {
        const data = {
            columns: [
                {
                    headerName: 'Order ID',
                    field: 'id',
                    width: 300,
                    sort: 'asc'
                },

                {
                    headerName: 'No of Items',
                    field: 'numofItems',
                    width: 300,
                    sort: 'asc'
                },
                {
                    headerName: 'Amount',
                    field: 'amount',
                    width: 300,
                    sort: 'asc'
                },
                {
                    headerName: 'Status',
                    field: 'status',
                    width: 300,
                    sort: 'asc',
                    renderCell: ({ value }) => {
                        return value && String(value).includes('Delivered') ? (
                            <Typography style={{ color: 'green' }}>{value}</Typography>
                        ) : (
                            <Typography style={{ color: 'red' }}>{value}</Typography>
                        );
                    },
                },
                {
                    headerName: 'Actions',
                    field: 'actions',
                    width: 300,
                    renderCell: ({ value }) => (
                        <Fragment>
                            <Link to={`/admin/order/${value}`}>
                                <Button
                                    variant='contained'
                                    sx={{
                                        color: 'white'
                                    }}>
                                    <EditIcon />
                                </Button>
                            </Link>
                            <Button
                                variant='contained'
                                sx={{
                                    color: 'white',
                                    backgroundColor: 'red',
                                    marginLeft: 1
                                }}
                                onClick={() => deleteOrderHandler(value)}
                            >
                                <DeleteIcon />
                            </Button>
                        </Fragment>
                    ),
                },
            ],
            rows: []
        }

        allOrders.forEach(order => {
            data.rows.push({
                id: order._id,
                numofItems: order.orderItems.length,
                amount: `₱ ${order.totalPrice}`,
                status: order.orderStatus,
                actions: order._id
            })
        })
        return data;
    }

    return (
        <ThemeProvider theme={defaultTheme}>
            <MetaData title={'OrdersList'} />
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
                            Orders List
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
                    <div style={{ height: 'auto', width: '100%', marginTop: 68 }}>
                        <DataGrid
                            rows={setOrders().rows}
                            columns={setOrders().columns}
                            initialState={{
                                pagination: {
                                    paginationModel: { page: 0, pageSize: 10 },
                                },
                            }}
                            pageSizeOptions={[10, 20]}
                        />
                    </div>
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default OrdersList;
