import React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const Product = ({ product }) => {
    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
            <div style={{ width: '345px', margin: '10px' }}>
                <Card sx={{ maxWidth: 345 }}>
                    <CardMedia
                        sx={{ height: 200 }}
                        image={product.images[0].url}
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            {product.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'left' }}>
                            Colorway: {product.colorway}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'left' }}>
                            Brand: {product.brand}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'left' }}>
                            Size: {product.size}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small">Add to cart</Button>
                        <Button size="small">Details</Button>
                    </CardActions>
                </Card>
            </div>
        </div>
    );
}
export default Product;