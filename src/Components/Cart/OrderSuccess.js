import React, { Fragment, useEffect } from 'react'
import { Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import MetaData from '../Layout/Metadata'

const OrderSuccess = ({ state, setState }) => {

    useEffect(() => {
        setState({
            ...state,
            cartItems: [],
        });
    })

    sessionStorage.removeItem('orderInfo');
    localStorage.clear();
    localStorage.removeItem('cartItems');

    return (
        <Fragment>
            <MetaData title={'Order Success'} />

            <div className="row justify-content-center">
                <div className="col-6 mt-5 text-center">
                    <img className="my-5 img-fluid d-block mx-auto" src="https://res.cloudinary.com/dwkmutbz3/image/upload/v1699772529/Kickz/logo/Success.png" alt="Order Success" width="700" height="700" />
                    <Typography variant="h3">Your Order has been placed successfully.</Typography>
                </div>
            </div>

        </Fragment>
    )
}

export default OrderSuccess