import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CategoryIcon from '@mui/icons-material/Category';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InventoryIcon from '@mui/icons-material/Inventory';
import PeopleIcon from '@mui/icons-material/People';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Link } from 'react-router-dom';

const Sidebar = () => {
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
                    <Link to="/admin/orders" style={{ textDecoration: 'none', color: 'inherit' }}><ShoppingCartIcon /></Link>
                </ListItemIcon>
                <Link to="/admin/orders" style={{ textDecoration: 'none', color: 'inherit' }}><ListItemText primary="Orders" /></Link>
            </ListItemButton>
            <ListItemButton>
                <ListItemIcon>
                    <Link to="/admin/users" style={{ textDecoration: 'none', color: 'inherit' }}><PeopleIcon /></Link>
                </ListItemIcon>
                <Link to="/admin/users" style={{ textDecoration: 'none', color: 'inherit' }}><ListItemText primary="Users" /></Link>
            </ListItemButton>
            <ListItemButton>
                <ListItemIcon>
                    <Link to="/admin/products" style={{ textDecoration: 'none', color: 'inherit' }}><CategoryIcon /></Link>
                </ListItemIcon>
                <Link to="/admin/products" style={{ textDecoration: 'none', color: 'inherit' }}><ListItemText primary="Products" /></Link>
            </ListItemButton>
            <ListItemButton>
                <ListItemIcon>
                    <Link to="/admin/suppliers" style={{ textDecoration: 'none', color: 'inherit' }}><InventoryIcon /></Link>
                </ListItemIcon>
                <Link to="/admin/suppliers" style={{ textDecoration: 'none', color: 'inherit' }}><ListItemText primary="Supplier" /></Link>
            </ListItemButton>
        </React.Fragment>
    );
};

export default Sidebar;
