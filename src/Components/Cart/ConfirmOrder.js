import React, { Fragment, useState } from 'react';
import { Typography, List, ListItem, ListItemText, Grid, Container, Card, Button } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import CheckoutSteps from './CheckoutSteps';
import MetaData from '../Layout/Metadata';
import { Link, useNavigate } from 'react-router-dom'
import { getUser } from '../../utils/helpers'
const payments = [
    { name: 'Card type', detail: 'Visa' },
    { name: 'Card holder', detail: 'Mr John Smith' },
    { name: 'Card number', detail: 'xxxx-xxxx-xxxx-1234' },
    { name: 'Expiry date', detail: '04/2024' },
];
const ConfirmOrder = ({ cartItems, shippingInfo }) => {

    const [user, setUser] = useState(getUser() ? getUser() : {})
    let navigate = useNavigate();
    const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
    const shippingPrice = itemsPrice > 200 ? 0 : 25
    const taxPrice = Number((0.05 * itemsPrice).toFixed(2))
    const totalPrice = (itemsPrice + shippingPrice + taxPrice).toFixed(2)

    const processToPayment = () => {
        const data = {
            itemsPrice: itemsPrice.toFixed(2),
            shippingPrice,
            taxPrice,
            totalPrice
        }

        sessionStorage.setItem('orderInfo', JSON.stringify(data))
        navigate('/payment')
    }

    return (
        <React.Fragment>
            <MetaData title={'Confirm Order'} />
            <CheckoutSteps shipping confirmOrder />
            <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
                <Card variant="outlined" className="rounded-3" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 }, border: '1px solid' }}>
                    <Typography component="h1" variant="h4" align="center" >
                        Checkout
                    </Typography><hr />
                    <Typography variant="h6" gutterBottom>
                        Order summary
                    </Typography>
                    <List disablePadding>
                        {cartItems.map(item => (
                            <ListItem key={item.name} sx={{ py: 1, px: 0 }}>
                                <ListItemText><img src={item.image} alt={item.name} height="100" width="100" /></ListItemText>
                                <ListItemText primary={item.name} secondary={item.desc} />
                                <Typography variant="body2">₱ {item.price}</Typography>
                            </ListItem>
                        ))}
                    </List><hr />
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                                Shipping
                            </Typography>
                            <Typography gutterBottom>
                                {getUser() && <p>{user && user.name}</p>}
                            </Typography>
                            <Typography gutterBottom>
                                {`${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.postalCode}, ${shippingInfo.country}`}
                            </Typography>
                        </Grid>
                        <Grid item container direction="column" xs={12} sm={6}>
                            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                                Payment details
                            </Typography>
                            <Grid container>
                                <Grid item xs={8}>
                                    <Typography variant='subtitle1'>Subtotal: ₱ {itemsPrice}</Typography>
                                </Grid>
                                <Grid item xs={8}>
                                    <Typography variant='subtitle1'>Shipping: ₱ {shippingPrice}</Typography>
                                </Grid>
                                <Grid item xs={8}>
                                    <Typography variant='subtitle1'>Tax: ₱ {taxPrice}</Typography>
                                </Grid>
                                <Grid item xs={8}>
                                    <Typography variant='subtitle1' sx={{ fontWeight: 1000 }}>Total: ₱ {totalPrice}</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid container justifyContent="flex-end">
                        <Button
                            variant="contained"
                            onClick={processToPayment}
                            endIcon={<NavigateNextIcon/>}
                            style={{ marginTop: 25, backgroundColor: 'black' }}
                        >
                            Next
                        </Button>
                    </Grid>
                </Card>
            </Container>
        </React.Fragment>
    );
};

export default ConfirmOrder;
