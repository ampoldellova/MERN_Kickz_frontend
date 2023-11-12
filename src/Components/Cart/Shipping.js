import React, { useState } from 'react';
import { Grid, Typography, TextField, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { countries } from 'countries-list';
import MetaData from '../Layout/Metadata';
import { Box } from '@mui/system';
import { Button } from 'react-bootstrap';

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
                            inputProps={{ readOnly: true }}
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
                            inputProps={{ readOnly: true }}
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
                <Button
                    variant="contained"
                    id="shipping_btn"
                    type="submit"
                    className="btn btn-block py-3"
                >
                    NEXT
                </Button>
            </Box>
        </>
    );
};

export default Shipping;
