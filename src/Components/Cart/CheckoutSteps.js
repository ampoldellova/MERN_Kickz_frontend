import React, { useState } from 'react';
import { Card, Box, Container, Stepper, Step, StepLabel, Button, Typography } from '@mui/material';
import Shipping from './Shipping';

const steps = ['Shipping address', 'Payment details', 'Review your order'];

function getStepContent(step) {
    switch (step) {
        case 0:
            return <Shipping shipping saveShippingInfo/>;
        case 1:
            return;
        case 2:
            return;
        default:
            throw new Error('Unknown step');
    }
}

const Checkout = () => {
    
    const [activeStep, setActiveStep] = useState(0);

    const handleNext = () => {
        setActiveStep(activeStep + 1);
    };

    const handleBack = () => {
        setActiveStep(activeStep - 1);
    };

    return (
        <React.Fragment>
            <Container component="main" maxWidth="sm" sx={{ mb: 4, mt: 20 }}>
                <Card variant="outlined" className="rounded-3" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 }, border: '1px solid' }}>
                    <Typography component="h1" variant="h4" align="center">
                        Checkout
                    </Typography>
                    <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    {activeStep === steps.length ? (
                        <React.Fragment>
                            <Typography variant="h5" gutterBottom>
                                Thank you for your order.
                            </Typography>
                            <Typography variant="subtitle1">
                                Your order number is #2001539. We have emailed your order confirmation, and will send you an update when your order has shipped.
                            </Typography>
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            {getStepContent(activeStep)}
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                {activeStep !== 0 && (
                                    <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                                        Back
                                    </Button>
                                )}

                                <Button variant="contained" onClick={handleNext} sx={{ mt: 3, ml: 1 }}>
                                    {activeStep === steps.length - 1 ? 'Place order' : 'Next'}
                                </Button>
                            </Box>
                        </React.Fragment>
                    )}
                </Card>
            </Container>
        </React.Fragment>
    );
};

export default Checkout;