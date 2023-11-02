import React, { Fragment, useState, useEffect } from 'react'
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardImage, MDBTypography } from 'mdb-react-ui-kit';
import { Button, Box, Menu, MenuItem, IconButton, Avatar } from '@mui/material';
import { getToken } from '../../utils/helpers';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MoreIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import Metadata from '../Layout/Metadata';
import Loader from '../Layout/Loader';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const Profile = () => {
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState('')
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
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
                <Link className="dropdown-item" to="#">My Orders</Link>
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
                            <MDBRow className="justify-content-center align-items-center h-100">
                                <MDBCol lg="9" xl="7">
                                    <MDBCard>
                                        <div className="rounded-top text-white d-flex flex-row" style={{ backgroundColor: '#000', height: '200px' }}>
                                            <div className="ms-4 mt-5 d-flex flex-column" style={{ width: '150px' }}>
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
                                            <div className="ms-3" style={{ marginTop: '130px' }}>
                                                <MDBTypography tag="h5">{user.name}</MDBTypography>
                                                <MDBCardText>{user.email}</MDBCardText>
                                            </div>
                                        </div>
                                        <div className="p-4 text-black" style={{ backgroundColor: '#f8f9fa' }}>
                                            <div className="d-flex justify-content-end text-center py-1">
                                                <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                                                    <div>
                                                        <Link to="#">
                                                            <Button variant='outlined' style={{ border: '1px solid black', color: 'black' }}>
                                                                My Orders
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                    <div className="px-3">
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
                        </MDBContainer>
                    </div>
                </Fragment>
            )}
            {renderMobileMenu}
        </Fragment>
    )
}

export default Profile