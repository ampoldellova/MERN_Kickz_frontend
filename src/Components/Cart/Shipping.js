import React, { useState } from 'react';
import { Grid, Typography, TextField, MenuItem, Button, Container, Paper, Card } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useNavigate } from 'react-router-dom';
import { countries } from 'countries-list';
import MetaData from '../Layout/Metadata';
import { Box } from '@mui/system';
import CheckoutSteps from './CheckoutSteps';


const Shipping = ({ shipping, saveShippingInfo }) => {
    const countriesList = Object.values(countries);
    const [address, setAddress] = useState(shipping.address);
    const [city, setCity] = useState(shipping.city);
    const [postalCode, setPostalCode] = useState(shipping.postalCode);
    const [phoneNo, setPhoneNo] = useState(shipping.phoneNo);
    const [country, setCountry] = useState(shipping.country);
    const navigate = useNavigate();

    const submitHandler = (e) => {
        e.preventDefault();

        saveShippingInfo({ address, city, phoneNo, postalCode, country });
        navigate('/confirm');
    };

    return (
        <>
            <MetaData title={'Shipment Info'} />
            <CheckoutSteps shipping />
            <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
                <Card variant="outlined" className="rounded-3" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }} style={{border: '1px solid'}}>
                    <Typography component="h1" variant="h4" align="center" >
                        Checkout
                    </Typography><hr/>  
                    <Typography variant="h6" gutterBottom>
                        Shipping address
                    </Typography>
                    <Box component="form" onSubmit={submitHandler}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    id="address"
                                    name="address"
                                    label="Address"
                                    fullWidth
                                    variant="standard"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    id="city"
                                    name="city"
                                    label="City"
                                    fullWidth
                                    variant="standard"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    type="number"
                                    id="phone"
                                    name="phone"
                                    label="Phone"
                                    fullWidth
                                    variant="standard"
                                    value={phoneNo}
                                    onChange={(e) => setPhoneNo(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    type="number"
                                    id="zip"
                                    name="zip"
                                    label="Zip / Postal code"
                                    fullWidth
                                    variant="standard"
                                    value={postalCode}
                                    onChange={(e) => setPostalCode(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    select
                                    id="country"
                                    label="Country"
                                    fullWidth
                                    variant="standard"
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}
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
                                endIcon={<NavigateNextIcon/>}
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
