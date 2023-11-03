import React, { Fragment, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Carousel } from 'react-bootstrap'
import Loader from '../Layout/Loader'
import MetaData from '../Layout/Metadata'
import axios from 'axios'
import { Container, Typography } from '@mui/material'

const ProductDetails = ({ addItemToCart, cartItems }) => {

    const [loading, setLoading] = useState(true)
    const [product, setProduct] = useState({})
    const [error, setError] = useState('')
    const [quantity, setQuantity] = useState(0)


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
                                    <input className="form-control text-center me-3" id="inputQuantity" type="num" value="1" style={{ maxWidth: '3rem' }} readOnly />
                                    <button className="btn btn-outline-dark flex-shrink-0" type="button">
                                        <i className="bi-cart-fill me-1"></i>
                                        Add to cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            )}
        </Fragment>
    )

}
export default ProductDetails