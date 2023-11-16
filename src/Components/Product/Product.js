import React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import MoreVertIcon from '@mui/icons-material/MoreVert';
// import '../../CSS/Image.css';

const Product = ({ product }) => {

    return (

        <div style={{ display: 'inline-block' }}>
            <div style={{ width: '345px', margin: '10px' }}>
                <Card variant="outlined" sx={{ maxWidth: 350, borderRadius: '10px' }}>
                    <div className="card">
                        <CardMedia
                            sx={{ height: 300 }}
                            image={product.images[0].url}
                        />
                    </div>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            {product.name}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'left' }}>
                            Price: ₱ {product.price}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'left' }}>
                            Colorway: {product.colorway}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'left' }}>
                            Type: {product.type}
                        </Typography>
                        {/* <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'left' }}>
                            Brand: {product.brand}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'left' }}>
                            Size: {product.size}
                        </Typography> */}
                    </CardContent>
                    <CardActions>
                        <Link to={`/product/${product._id}`} size="small"><Button size="small" startIcon={<MoreVertIcon />}>Check Details</Button></Link>
                    </CardActions>
                </Card>
            </div>
        </div>
    );
}
export default Product;