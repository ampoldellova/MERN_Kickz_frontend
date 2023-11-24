import React, { Fragment, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Pagination, Container, Grid, List, Card, CardContent} from '@mui/material';
import MetaData from './Layout/Metadata';
import Product from './Product/Product';
import Loader from './Layout/Loader';
import Carousel from 'react-bootstrap/Carousel';
import Slider from 'rc-slider';
import axios from 'axios';
import 'rc-slider/assets/index.css';
const categories = [
    'High-tops',
    'Mid-Cut',
    'Low-tops',
    'Slip-ons'
]

const Home = () => {
    const [loading, setLoading] = useState(true)
    const [products, setProducts] = useState([])
    const [productsCount, setProductsCount] = useState(0)
    const [currentPage, setCurrentPage] = useState(1);
    const [resPerPage, setResPerPage] = useState(0)
    const [filteredProductsCount, setFilteredProductsCount] = useState(0)
    const [price, setPrice] = useState([1, 50000]);
    const [category, setCategory] = useState('');
    let { keyword } = useParams();

    const createSliderWithTooltip = Slider.createSliderWithTooltip;
    const Range = createSliderWithTooltip(Slider.Range);

    const getProducts = async (currentPage = 1, keyword = '', price, category = '') => {
        let link = `http://localhost:4002/api/v1/products?page=${currentPage}&keyword=${keyword}&price[lte]=${price[1]}&price[gte]=${price[0]}`

        if (category) {
            link = `http://localhost:4002/api/v1/products?keyword=${keyword}&page=${currentPage}&price[lte]=${price[1]}&price[gte]=${price[0]}&type=${category}`
        }

        let res = await axios.get(link)

        setProducts(res.data.products)
        setResPerPage(res.data.resPerPage)
        setProductsCount(res.data.productsCount)
        setFilteredProductsCount(res.data.filteredProductsCount)
        setLoading(false)

    }
    let count = productsCount;

    if (keyword) {
        count = filteredProductsCount
    }

    function setCurrentPageNo(pageNumber) {
        setCurrentPage(pageNumber)
    }

    useEffect(() => {
        getProducts(currentPage, keyword, price, category)
    }, [currentPage, keyword, price, category])

    return (
        <Fragment>
            <MetaData title={'Home'} />
            {loading ? <Loader /> : (
                <Fragment>
                    {keyword ? (
                        <Fragment>
                            <Container style={{ display: 'flex' }}>
                                <Grid container spacing={2} style={{ marginTop: 100, maxWidth: 1200 }}>
                                    <Grid item xs={12} md={4}>
                                        <Card variant="outlined" sx={{ borderRadius: 3 }}>
                                            <CardContent>
                                                <Typography variant='h6'>Price Range</Typography>
                                                <Container item>
                                                    <Range
                                                        marks={{
                                                            1: `₱1`,
                                                            50000: `₱50000`
                                                        }}
                                                        min={1}
                                                        max={50000}
                                                        defaultValue={[1, 50000]}
                                                        tipFormatter={value => `₱${value}`}
                                                        tipProps={{
                                                            placement: "top",
                                                            visible: true
                                                        }}
                                                        value={price}
                                                        onChange={price => setPrice(price)}
                                                        style={{
                                                            width: 'auto',
                                                            margin: 'auto',
                                                            marginBottom: 50,
                                                            marginTop: 20
                                                        }}
                                                    />
                                                </Container><hr />

                                                <Typography variant='h6'>Categories</Typography>

                                                <List>
                                                    {categories.map(category => (
                                                        <Container item>
                                                            <List item
                                                                style={{
                                                                    cursor: 'pointer',
                                                                    listStyleType: 'none'
                                                                }}
                                                                key={category}
                                                                onClick={() => {
                                                                    setCategory(category)
                                                                }}
                                                            >
                                                                {category}
                                                            </List>
                                                        </Container>
                                                    ))}
                                                </List>
                                            </CardContent>
                                        </Card>
                                    </Grid>

                                    <Grid item xs={12} md={8}>
                                        {products.map(product => (
                                            <Product key={product._id} product={product} col={4} />
                                        ))}
                                    </Grid>
                                </Grid>
                            </Container>
                        </Fragment>
                    ) : (
                        <Fragment>
                            <Carousel data-bs-theme="light" style={{ marginTop: -1 }}  fade>
                                <Carousel.Item>
                                    <img
                                        className="d-block w-100"
                                        src="/images/banner2.png"
                                        alt="First slide"
                                    />
                                </Carousel.Item>
                                <Carousel.Item>
                                    <img
                                        className="d-block w-100"
                                        src="/images/banner3.png"
                                        alt="Second slide"
                                    />
                                </Carousel.Item>
                                <Carousel.Item>
                                    <img
                                        className="d-block w-100"
                                        src="/images/banner4.png"
                                        alt="Third slide"
                                    />
                                </Carousel.Item>
                            </Carousel>

                            <Typography
                                variant="h3"
                                component="h2"
                                style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    justifyContent: 'center',
                                    textAlign: 'center',
                                    marginTop: 100,
                                    fontWeight: 1000,
                                }}>
                                GIFTS THAT MOVE YOU.
                            </Typography>

                            <Typography
                                variant="subtitle1"
                                component="h2"
                                style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    justifyContent: 'center',
                                    fontFamily: 'sans-serif',
                                    textAlign: 'center',
                                    margin: '1% 30% 4%',
                                }}>
                                Welcome to Kickz! We are thrilled to offer you a wide range of shoes from
                                Adidas, Nike, and Vans that will not only make you look stylish but also feel comfortable.
                            </Typography>

                            <div className="container-fluid" style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
                                {products.map(product => (
                                    <Product key={product._id} product={product} col={4} />
                                ))}
                            </div>
                        </Fragment>
                    )}
                    {/* </div> */}
                    {resPerPage <= count && (
                        <div className="d-flex justify-content-center mt-5">
                            <Pagination
                                count={Math.ceil(productsCount / resPerPage)}
                                page={currentPage}
                                onChange={(event, page) => setCurrentPageNo(page)}
                                boundaryCount={2}
                                variant="outlined"
                                shape="rounded"
                                style={{ marginBottom: 50 }}
                            />
                        </div>)}
                </Fragment>
            )
            }
        </Fragment >
    )
}

export default Home;
