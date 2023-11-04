import React, { Fragment, useEffect, useState } from 'react';
import { AppBar, Avatar, Box, Toolbar, IconButton, Typography, Badge, MenuItem, Menu, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { getUser, logout } from '../../utils/helpers';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MoreIcon from '@mui/icons-material/MoreVert';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LogoutIcon from '@mui/icons-material/Logout';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import Searcher from './Searcher';
import axios from 'axios';
import '../../CSS/Home.css';

const Header = ({ cartItems }) => {
  const [user, setUser] = useState('')
  const navigate = useNavigate()
  const logoutUser = async () => {

    try {
      await axios.get(`http://localhost:4002/api/v1/logout`)
      setUser('')
      logout(() => navigate('/'))
    } catch (error) {
      toast.error(error.response.data.message)

    }
  }
  const logoutHandler = () => {
    logoutUser();
    handleMenuClose();
    toast.success('log out', {
      position: toast.POSITION.BOTTOM_RIGHT
    });
  }
  useEffect(() => {
    setUser(getUser())
  }, [])

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}><AccountCircle style={{ marginRight: 10 }} />
        <Link className="dropdown-item" to="/me">Profile</Link>
      </MenuItem>
      <MenuItem onClick={logoutHandler}><LogoutIcon style={{ marginRight: 10 }} /> Logout</MenuItem>
    </Menu>
  );

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
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={cartItems.length} color="error">
            <Link to="/cart"><ShoppingCartIcon /></Link>
          </Badge>
        </IconButton>
        Cart
      </MenuItem>

      <MenuItem>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <Link className="dropdown-item" to="/me"><AccountCircle /></Link>
        </IconButton>
        <Link className="dropdown-item" to="/me">Profile</Link>
      </MenuItem>

      <MenuItem onClick={logoutHandler}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <LogoutIcon />
        </IconButton>
        Logout
      </MenuItem>
    </Menu>
  );

  return (
    <Fragment>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="fixed" sx={{ backgroundColor: 'black' }}>
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              sx={{ mr: 2 }}
            >
              <Link to="/"> <img src="./images/kickz.png" style={{ width: 40, height: 40, cursor: 'pointer' }} alt='kickz' /></Link>
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ display: { xs: 'none', sm: 'block' } }}
            >
            </Typography>

            <Box sx={{ flexGrow: 1 }} />

            <Searcher />

            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                <Badge badgeContent={cartItems.length} color="error">
                  <Link to="/cart"><ShoppingCartIcon /></Link>
                </Badge>
              </IconButton>
            </Box>

            {user ? (
              <Fragment>
                <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                  <IconButton
                    size="large"
                    edge="end"
                    aria-label="account of current user"
                    aria-controls={menuId}
                    aria-haspopup="true"
                    onClick={handleProfileMenuOpen}
                    color="inherit"
                  >
                    <Avatar alt={user && user.name} src={user.avatar && user.avatar.url} />
                  </IconButton>
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
              </Fragment>) :
              <Link to="/login" className="btn ml-4" id="login_btn">
                <Button variant="contained" style={{ backgroundColor: 'white', color: 'black' }}>Login</Button>
              </Link>}
          </Toolbar>
        </AppBar>
        {renderMobileMenu}
        {renderMenu}
      </Box>
    </Fragment>
  )
}

export default Header