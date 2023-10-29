import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ProductList() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:4002/api/v1/products') // Adjust the URL based on your backend routes
            .then((response) => {
                setProducts(response.data.products);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);

    return (
        <div>
            <h2>Product List</h2>
            {products.map((product) => (
                <li key={product._id}>{product.name}</li>
            ))}
        </div>
    );
}
export default ProductList;