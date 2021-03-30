import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import Product from '../Product/Product';

const ProductDetail = () => {
    const {productKey} = useParams();
    const [product, setProduct]=useState({});
    useEffect(()=>{
        fetch('http://localhost:5000/products/'+productKey)
        .then(res => res.json())
        .then(data=>setProduct(data))
    },[productKey]);

    console.log(product);
    return (
        <div>
            <h1>Product Detail</h1>
            <Product product={product} showAddToCart={false}></Product>
        </div>
    );
};

export default ProductDetail;