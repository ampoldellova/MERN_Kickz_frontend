import React, { Fragment, useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { Typography, Pagination } from '@mui/material';
import MetaData from './Layout/Metadata';
import Product from './Product/Product';
import Loader from './Layout/Loader';
// import Pagination from 'react-js-pagination';
import Carousel from 'react-bootstrap/Carousel';
import Slider from 'rc-slider';
import axios from 'axios';
import 'rc-slider/assets/index.css';

const categories = [
    'Nike',
    'Adidas',
    'Vans'
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
            link = `http://localhost:4002/api/v1/products?keyword=${keyword}&page=${currentPage}&price[lte]=${price[1]}&price[gte]=${price[0]}&category=${category}`
        }

        let res = await axios.get(link)
        console.log(res)
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
                            <div className="container-fluid" style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
                                <div className="col-6 col-md-3 mt-5 mb-5">
                                    <div className="px-5">
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
                                        />
                                        <hr className="my-5" />
                                        <div className="mt-5">
                                            <h4 className="mb-3">
                                                Categories
                                            </h4>
                                            <ul className="pl-0">
                                                {categories.map(category => (
                                                    <li
                                                        style={{
                                                            cursor: 'pointer',
                                                            listStyleType: 'none'
                                                        }}
                                                        key={category}
                                                        onClick={() => setCategory(category)}
                                                    >
                                                        {category}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {products.map(product => (
                                    <Product key={product._id} product={product} col={4} />
                                ))}
                            </div>

                        </Fragment>
                    ) : (
                        <Fragment>
                            <Carousel data-bs-theme="dark" style={{ marginTop: -1 }} fade>
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
            )}
        </Fragment>
    )
}

export default Home;
