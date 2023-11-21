import React, { Fragment, useState } from 'react';
import { createTheme, ThemeProvider, Box } from '@mui/material';
import MetaData from '../Layout/Metadata';
import Navigation from './Navigation';
import Loader from '../Layout/Loader';

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
                    {/* {loading ? <Loader /> : (
                        <Fragment>
                            
                        </Fragment>
                    )} */}
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default Dashboard;
