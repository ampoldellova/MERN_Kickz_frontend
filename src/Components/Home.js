import React, { Fragment, useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import MetaData from './Layout/Metadata';
import Product from './Product/Product';
import Loader from './Layout/Loader';
import Pagination from 'react-js-pagination';
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
    const [price, setPrice] = useState([1, 1000]);
    const [category, setCategory] = useState('');
    let { keyword } = useParams();

    const createSliderWithTooltip = Slider.createSliderWithTooltip;
    const Range = createSliderWithTooltip(Slider.Range);

    const getProducts = async (currentPage = 1, keyword = '', price, category = '') => {
        let link = `http://localhost:4002/api/v1/products?page=${currentPage}&keyword=${keyword}`

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
        <>
            <div id="carouselExample" className="carousel slide" data-ride="carousel" style={{ marginTop: -1 }}>
                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <img className="d-block w-100" src="/images/banner2.png" alt="First slide" />
                    </div>
                    <div className="carousel-item">
                        <img className="d-block w-100" src="/images/banner3.png" alt="Second slide" />
                    </div>
                    <div className="carousel-item">
                        <img className="d-block w-100" src="/images/banner4.png" alt="Third slide" />
                    </div>
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>

            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                fontFamily: 'sans-serif',
                marginTop: 10
            }}>
                <h1><b>Our Products</b></h1>
            </div>

            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                fontFamily: 'sans-serif',
                margin: '0% 30%',
                textAlign: 'center',
            }}>
                <h6>
                    Welcome to Kickz! We are thrilled to offer you a wide range of shoes from
                    Adidas, Nike, and Vans that will not only make you look stylish but also feel comfortable.
                </h6>

            </div>

            {loading ? <Loader /> : (
                <Fragment>
                    <MetaData title={'Home'} />
                    <div className="container">
                        {keyword ? (
                            <Fragment>
                                <div className="col-6 col-md-3 mt-5 mb-5">
                                    <div className="px-5">
                                        <Range
                                            marks={{
                                                1: `$1`,
                                                100000: `$100000`
                                            }}
                                            min={1}
                                            max={100000}
                                            defaultValue={[1, 100000]}
                                            tipFormatter={value => `$${value}`}
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

                                <div className="col-6 col-md-9">
                                    <div className="row">
                                        {products.map(product => (
                                            <Product key={product._id} product={product} col={4} />
                                        ))}
                                    </div>
                                </div>
                            </Fragment>
                        ) : (
                            products.map(product => (
                                <Product key={product._id} product={product} col={4} />
                            ))
                        )}
                    </div>
                    {resPerPage <= count && (
                        <div className="d-flex justify-content-center mt-5">
                            <Pagination
                                activePage={currentPage}
                                itemsCountPerPage={resPerPage}
                                totalItemsCount={productsCount}
                                onChange={setCurrentPageNo}
                                nextPageText={'Next'}
                                prevPageText={'Prev'}
                                firstPageText={'First'}
                                lastPageText={'Last'}
                                itemClass="page-item"
                                linkClass="page-link"
                            />
                        </div>)}
                </Fragment>
            )}
        </>

    )
}

export default Home