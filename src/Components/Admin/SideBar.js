import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CategoryIcon from '@mui/icons-material/Category';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InventoryIcon from '@mui/icons-material/Inventory';
import PeopleIcon from '@mui/icons-material/People';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AllInboxIcon from '@mui/icons-material/AllInbox';
import { Link } from 'react-router-dom';

const Sidebar = () => {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <React.Fragment>
            <ListItemButton>
                <ListItemIcon>
                    <Link to="/dashboard" style={{ textDecoration: 'none', color: 'inherit' }}><DashboardIcon /></Link>
                </ListItemIcon>
                <Link to="/dashboard" style={{ textDecoration: 'none', color: 'inherit' }}><ListItemText primary="Dashboard" /></Link>
            </ListItemButton>
            <ListItemButton>
                <ListItemIcon>
                    <ShoppingCartIcon />
                </ListItemIcon>
                <ListItemText primary="Orders" />
            </ListItemButton>
            <ListItemButton>
                <ListItemIcon>
                    <PeopleIcon />
                </ListItemIcon>
                <ListItemText primary="Users" />
            </ListItemButton>
            <ListItemButton onClick={handleClick}>
                <ListItemIcon>
                    <CategoryIcon />
                </ListItemIcon>
                <ListItemText primary="Products" />
                <KeyboardArrowDownIcon />
            </ListItemButton>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                getContentAnchorEl={null}
            >
                <MenuItem onClick={handleClose}><AllInboxIcon style={{ marginRight: 10 }} />
                    <Link to="/admin/products" style={{ textDecoration: 'none', color: 'inherit' }}>All</Link>
                </MenuItem>
                <MenuItem onClick={handleClose}><AddCircleIcon style={{ marginRight: 10 }} />Create</MenuItem>
            </Menu>
            <ListItemButton>
                <ListItemIcon>
                    <InventoryIcon />
                </ListItemIcon>
                <ListItemText primary="Supplier" />
            </ListItemButton>
        </React.Fragment>
    );
};

export default Sidebar;
