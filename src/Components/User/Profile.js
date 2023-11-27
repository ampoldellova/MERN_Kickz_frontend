import React, { Fragment, useState, useEffect } from 'react'
import { MDBCol, MDBContainer, MDBRow, MDBCard } from 'mdb-react-ui-kit';
import { Carousel } from 'react-bootstrap';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Box, Menu, MenuItem, IconButton, Avatar, Typography, Container, TableContainer, Paper } from '@mui/material';
import { getToken } from '../../utils/helpers';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MoreIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import Metadata from '../Layout/Metadata';
import Loader from '../Layout/Loader';
import 'react-toastify/dist/ReactToastify.css';
import '../../CSS/Profile.css'
import axios from 'axios';

const Profile = () => {
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState('')
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
    const [error, setError] = useState('')
    const [myOrdersList, setMyOrdersList] = useState([])
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMobileMenuOpen = (event) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            <MenuItem>
                <IconButton
                    size="large"
                    aria-label="My Orders"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit"
                >
                    <ShoppingCartIcon />
                </IconButton>
                <Link className="dropdown-item" to="/orders/me">My Orders</Link>
            </MenuItem>

            <MenuItem >
                <IconButton
                    size="large"
                    aria-label="Change Password"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit"
                >
                    <EditIcon />
                </IconButton>
                <Link className="dropdown-item" to="/password/update">Change Password</Link>
            </MenuItem>
        </Menu >
    );


    const getProfile = async () => {
        const config = {
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        }
        try {
            const { data } = await axios.get(`http://localhost:4002/api/v1/me`, config)
            console.log(data)
            setUser(data.user)
            setLoading(false)
        } catch (error) {
            console.log(error)
            toast.error("Invalid user or password", {
                position: toast.POSITION.BOTTOM_RIGHT
            })
        }

    }

    const myOrders = async () => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${getToken()}`
                }
            }
            const { data } = await axios.get(`http://localhost:4002/api/v1/orders/me`, config)
            console.log(data)
            setMyOrdersList(data.orders)
            setLoading(false)

        } catch (error) {
            setError(error.response.data.message)
        }
    }
    useEffect(() => {
        myOrders();
        if (error) {
            toast.error(error, {
                position: toast.POSITION.BOTTOM_RIGHT
            });
        }
    }, [error])

    const setOrders = () => {
        const data = {
            columns: [
                {
                    field: 'id',
                    headerName: 'Order ID',
                    width: 300,
                    sort: 'asc',
                    align: 'center',
                    headerAlign: 'center'
                },
                {
                    field: 'numOfItems',
                    headerName: 'Number of Items',
                    width: 130,
                    sort: 'asc',
                    align: 'center',
                    headerAlign: 'center'
                },
                {
                    field: 'amount',
                    headerName: 'Amount',
                    width: 300,
                    sort: 'asc',
                    align: 'center',
                    headerAlign: 'center'
                },
                {
                    field: 'status',
                    headerName: 'Status',
                    width: 200,
                    sort: 'asc',
                    align: 'center',
                    headerAlign: 'center',
                    renderCell: ({ value }) => {
                        return value && String(value).includes('Delivered') ? (
                            <Typography style={{ color: 'green' }}>{value}</Typography>
                        ) : (
                            <Typography style={{ color: 'red' }}>{value}</Typography>
                        );
                    },
                },
                {
                    field: 'actions',
                    headerName: 'Actions',
                    width: 200,
                    sort: 'asc',
                    headerAlign: 'center',
                    renderCell: ({ value }) => (
                        <Container style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Link to={`/order/${value}`} className="btn btn-primary">
                                <Button endIcon={<VisibilityIcon />} sx={{ color: 'white', height: 20 }}>View</Button>
                            </Link>
                        </Container>
                    ),
                },
            ],
            rows: [],
        };

        myOrdersList.forEach(order => {
            data.rows.push({
                id: order._id,
                numOfItems: order.orderItems.length,
                amount: `₱ ${order.totalPrice}`,
                status: order.orderStatus,
                actions: order._id,
            });
        });

        return data;
    };

    useEffect(() => {
        getProfile()

    }, [])
    return (
        <Fragment>
            <Metadata title={'Profile'} />
            {loading ? <Loader /> : (
                <Fragment>
                    <div className="gradient-custom-2"
                        style={{
                            background: 'linear-gradient(109.6deg, rgb(245, 239, 249) 30.1%, rgb(207, 211, 236) 100.2%)',
                            height: '100vh'
                        }}>
                        <MDBContainer className="py-5 h-100">
                            <MDBRow className="justify-content-center" style={{ marginTop: 50 }}>
                                <MDBCol xl="12">
                                    <MDBCard>
                                        <div className="rounded-top text-white d-flex flex-row" style={{
                                            height: '250px',
                                            background: 'radial-gradient(circle at -8.9% 51.2%, rgb(255, 124, 0) 0%, rgb(255, 124, 0) 15.9%, rgb(255, 163, 77) 15.9%, rgb(255, 163, 77) 24.4%, rgb(19, 30, 37) 24.5%, rgb(19, 30, 37) 66%)',
                                        }}>
                                            <Carousel data-bs-theme="light" pause='hover' style={{ position: 'absolute', width: '100%' }} fade>
                                                {user.images && user.images.map(image => (
                                                    <Carousel.Item key={image.public_id}>
                                                        <img src={image.url} style={{ height: '250px', width: '100%', objectFit: 'cover' }} alt='' />
                                                    </Carousel.Item>
                                                ))}
                                            </Carousel>
                                            <div className="ms-4 d-flex flex-column" style={{ width: '150px', marginTop: 170 }}>
                                                <Avatar src={user.avatar.url}
                                                    variant="rounded"
                                                    alt={user.name}
                                                    className="mt-4 mb-2 img-thumbnail"
                                                    fluid
                                                    sx={{
                                                        width: '150px',
                                                        height: '150px',
                                                        zIndex: '1'
                                                    }} />
                                                <Link to="/me/update">
                                                    <Button
                                                        variant='outlined'
                                                        style={{
                                                            border: '1px solid black',
                                                            color: 'black',
                                                            overflow: 'visible'
                                                        }}
                                                        endIcon={<EditIcon />}>
                                                        Edit Profile
                                                    </Button>
                                                </Link>
                                            </div>
                                            <div className="ms-3" style={{ marginTop: '270px', zIndex: 1 }}>
                                                <Typography variant='h5' color='black'>{user.name}</Typography>
                                                <Typography color='black'>{user.email}</Typography>
                                            </div>
                                        </div>
                                        <div className="p-4 text-black" style={{ height: '175px', backgroundColor: '#f8f9fa' }}>
                                            <div className="d-flex justify-content-end text-center py-1">
                                                <Box sx={{ display: { xs: 'none', md: 'flex' }, marginTop: 6.5 }}>
                                                    <div>
                                                        <Link to="/orders/me">
                                                            <Button variant='outlined' style={{ border: '1px solid black', color: 'black', marginRight: 10 }}>
                                                                My Orders
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                    <div>
                                                        <Link to="/password/update">
                                                            <Button variant='outlined' style={{ border: '1px solid black', color: 'black' }}>
                                                                Change Password
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </Box>
                                                <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                                                    <IconButton
                                                        size="large"
                                                        aria-label="show more"
                                                        aria-controls={mobileMenuId}
                                                        aria-haspopup="true"
                                                        onClick={handleMobileMenuOpen}
                                                        color="inherit"
                                                    >
                                                        <MoreIcon />
                                                    </IconButton>
                                                </Box>
                                            </div>
                                        </div>
                                    </MDBCard>
                                </MDBCol>

                            </MDBRow>

                            <Box sx={{ display: { xs: 'none', md: 'flex' }, marginTop: 5 }}>
                                <TableContainer component={Paper}>
                                    <DataGrid
                                        rows={setOrders().rows}
                                        columns={setOrders().columns}

                                        initialState={{
                                            pagination: {
                                                paginationModel: { page: 0, pageSize: 5 },
                                            },
                                        }}
                                        pageSizeOptions={[10, 20]}
                                    />
                                </TableContainer>
                            </Box>
                        </MDBContainer>

                    </div>
                </Fragment>
            )}
            {renderMobileMenu}
        </Fragment>
    )
}

export default Profile