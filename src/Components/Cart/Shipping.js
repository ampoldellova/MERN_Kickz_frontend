import React, { useState } from 'react';
import { Grid, Typography, TextField, MenuItem, Button, Container, Paper, Card } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useNavigate } from 'react-router-dom';
import { countries } from 'countries-list';
import MetaData from '../Layout/Metadata';
import { Box } from '@mui/system';
import CheckoutSteps from './CheckoutSteps';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
    address: Yup.string().required('Shipping address is required'),
    city: Yup.string().required('City is required'),
    phoneNo: Yup.number().typeError('Invalid phone number').required('Phone number is required'),
    postalCode: Yup.string().required('Postal code is required'),
    country: Yup.string().required('Country is required'),
});

const Shipping = ({ shipping, saveShippingInfo }) => {
    const countriesList = Object.values(countries);
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            address: shipping.address,
            city: shipping.city,
            phoneNo: shipping.phoneNo,
            postalCode: shipping.postalCode,
            country: shipping.country,
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            // values.preventDefault();
            saveShippingInfo({
                address: values.address,
                city: values.city,
                phoneNo: values.phoneNo,
                postalCode: values.postalCode,
                country: values.country,
            });
            navigate('/confirm');
        },
    });

    // const submitHandler = (e) => {
    //     e.preventDefault();

    //     saveShippingInfo({ address, city, phoneNo, postalCode, country });
    //     navigate('/confirm');
    // };

    return (
        <>
            <MetaData title={'Shipment Info'} />
            <CheckoutSteps shipping />
            <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
                <Card variant="outlined" className="rounded-3" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }} style={{ border: '1px solid' }}>
                    <Typography component="h1" variant="h4" align="center" >
                        Checkout
                    </Typography><hr />
                    <Typography variant="h6" gutterBottom>
                        Shipping address
                    </Typography>
                    <Box component="form" onSubmit={formik.handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    id="address"
                                    name="address"
                                    label="Address"
                                    fullWidth
                                    variant="standard"
                                    value={formik.values.address}
                                    onChange={formik.handleChange}
                                    error={formik.touched.address && Boolean(formik.errors.address)}
                                    helperText={formik.touched.address && formik.errors.address}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    id="city"
                                    name="city"
                                    label="City"
                                    fullWidth
                                    variant="standard"
                                    value={formik.values.city}
                                    onChange={formik.handleChange}
                                    error={formik.touched.city && Boolean(formik.errors.city)}
                                    helperText={formik.touched.city && formik.errors.city}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    id="phoneNo"
                                    name="phoneNo"
                                    label="Phone"
                                    fullWidth
                                    variant="standard"
                                    value={formik.values.phoneNo}
                                    onChange={formik.handleChange}
                                    error={formik.touched.phoneNo && Boolean(formik.errors.phoneNo)}
                                    helperText={formik.touched.phoneNo && formik.errors.phoneNo}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    id="postalCode"
                                    name="postalCode"
                                    label="Postal Code"
                                    fullWidth
                                    variant="standard"
                                    value={formik.values.postalCode}
                                    onChange={formik.handleChange}
                                    error={formik.touched.postalCode && Boolean(formik.errors.postalCode)}
                                    helperText={formik.touched.postalCode && formik.errors.postalCode}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    select
                                    id="country"
                                    name="country"
                                    label="Country"
                                    fullWidth
                                    variant="standard"
                                    value={formik.values.country}
                                    onChange={formik.handleChange}
                                    error={formik.touched.country && Boolean(formik.errors.country)}
                                    helperText={formik.touched.country && formik.errors.country}
                                >
                                    {countriesList.map((country) => (
                                        <MenuItem key={country.name} value={country.name}>
                                            {country.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                        </Grid>
                        <Grid container justifyContent="flex-end">
                            <Button
                                variant="contained"
                                id="shipping_btn"
                                type="submit"
                                endIcon={<NavigateNextIcon />}
                                style={{ marginTop: 25, backgroundColor: 'black' }}
                            >
                                Next
                            </Button>
                        </Grid>
                    </Box>
                </Card>
            </Container>
        </>
    );
};

export default Shipping;
