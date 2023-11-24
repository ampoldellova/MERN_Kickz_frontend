import React, { Fragment, useState } from 'react';
import { createTheme, ThemeProvider, Box, Container, Grid, Paper, Typography } from '@mui/material';
import MetaData from '../Layout/Metadata';
import Navigation from './Navigation';
import Loader from '../Layout/Loader';
import ProductSalesChart from './Charts/ProductSalesChart';
import MonthlySalesChart from './Charts/MonthlySalesChart';
import UserSalesChart from './Charts/UserSalesChart';

const defaultTheme = createTheme();

const Dashboard = () => {
    const [loading, setLoading] = useState(true)

    return (
        <ThemeProvider theme={defaultTheme}>
            <MetaData title={'Dashboard'} />
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
                    <Container maxWidth="lg" sx={{ mt: 4, mb: 4, marginTop: 15 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={12} lg={4}>
                                <Typography variant='h5'>User Sales Chart</Typography>
                                <Paper
                                    sx={{
                                        p: 2,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        height: 240,
                                    }}
                                >
                                    <UserSalesChart />
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={12} lg={8}>
                                <Typography variant='h5'>Top 5 Best Selling Shoes</Typography>
                                <Paper
                                    sx={{
                                        p: 2,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        height: 240,
                                    }}
                                >
                                    <ProductSalesChart />
                                </Paper>
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant='h5'>Monthly Sales Chart</Typography>
                                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 340 }}>
                                    <MonthlySalesChart />
                                </Paper>
                            </Grid>
                        </Grid>
                    </Container>
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default Dashboard;
