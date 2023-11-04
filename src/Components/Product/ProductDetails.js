import React, { Fragment, useEffect, useState } from 'react'
import { Container, Typography, ButtonGroup, Button } from '@mui/material'
import { useParams } from 'react-router-dom'
import { Carousel } from 'react-bootstrap'
import { styled } from "@mui/material/styles";
import { blueGrey } from "@mui/material/colors";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import Metadata from '../Layout/Metadata';
import Loader from '../Layout/Loader';
import axios from 'axios';

const StyledButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(blueGrey[50]),
    backgroundColor: blueGrey[50],
    borderColor: blueGrey[200],
    "&:hover": {
        backgroundColor: blueGrey[100],
        borderColor: blueGrey[300]
    }
}));

const ProductDetails = ({ addItemToCart, cartItems }) => {

    const [loading, setLoading] = useState(true)
    const [product, setProduct] = useState({})
    const [error, setError] = useState('')
    const [quantity, setQuantity] = useState(1)

    let { id } = useParams()

    const productDetails = async (id) => {
        let link = `http://localhost:4002/api/v1/product/${id}`
        console.log(link)
        let res = await axios.get(link)
        console.log(res)
        if (!res)
            setError('Product not found')
        setProduct(res.data.product)
        setLoading(false)
    }

    const increaseQty = () => {
        const count = document.querySelector('.count')
        if (count.valueAsNumber >= product.stock) return;
        const qty = count.valueAsNumber + 1;
        setQuantity(qty)
    }

    const decreaseQty = () => {
        const count = document.querySelector('.count')
        if (count.valueAsNumber <= 1) return;
        const qty = count.valueAsNumber - 1;
        setQuantity(qty)
    }
    const addToCart = async () => {
        await addItemToCart(id, quantity);
    }

    useEffect(() => {
        productDetails(id)
    }, [id,]);

    localStorage.setItem('cartItems', JSON.stringify(cartItems))

    return (
        <Fragment>
            <Metadata title={product.name} />
            {loading ? <Loader /> : (
                <Container className="py-5" style={{ height: '100vh', justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
                    <div className="container px-4 px-lg-5 my-5">
                        <div className="row gx-4 gx-lg-5 align-items-center">
                            <div className="col-md-6">
                                <Carousel pause='hover'>
                                    {product.images && product.images.map(image => (
                                        <Carousel.Item key={image.public_id}>
                                            <img className="d-block w-100" src={image.url} alt={product.title} />
                                        </Carousel.Item>
                                    ))}
                                </Carousel>
                            </div>
                            <div className="col-md-6">
                                <Typography variant='h3' style={{ fontWeight: 1000, fontStyle: 'italic' }}>{product.name}</Typography>
                                <Typography variant='subtitle1'>Colorway: {product.colorway}</Typography>
                                <Typography variant='subtitle1'>Made by: {product.brand}</Typography>
                                <Typography variant='subtitle1'>Size: {product.size}</Typography><hr />
                                <Typography variant='subtitle2' style={{ textAlign: 'justify' }}>{product.description}</Typography>
                                <div class="mt-2 mb-3">
                                    <Typography variant='h6'>Price: ₱ {product.price}</Typography>
                                    <Typography variant='h6'>Status: <span style={{ color: product.stock > 0 ? 'green' : 'red' }}>{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</span></Typography>
                                </div>
                                <div className="d-flex">
                                    <ButtonGroup style={{ marginRight: 10 }}>
                                        <StyledButton onClick={decreaseQty} style={{ marginRight: -5 }}>
                                            <RemoveIcon fontSize="small" />
                                        </StyledButton>
                                        <input
                                            type='number'
                                            size="small"
                                            className="count"
                                            style={{
                                                width: 100,
                                                textAlign: 'center'
                                            }}
                                            value={quantity}
                                            readOnly />
                                        <StyledButton onClick={increaseQty} style={{ marginLeft: -17 }}>
                                            <AddIcon fontSize="small" />
                                        </StyledButton>
                                    </ButtonGroup>

                                    <Button
                                        type="button"
                                        id="cart_btn"
                                        disabled={product.stock === 0}
                                        onClick={addToCart}
                                        variant="contained"
                                        sx={{ backgroundColor: 'black' }}
                                        startIcon={<AddShoppingCartIcon />}
                                    >
                                        Add to cart
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            )}
        </Fragment >
    )

}
export default ProductDetails