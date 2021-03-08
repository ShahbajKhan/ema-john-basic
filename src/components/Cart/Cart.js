import React from 'react';


const Cart = (props) => {
    const cart = props.cart;
    // total product price calculation using reduce
    const total = cart.reduce((total, prd) => total + prd.price*prd.quantity, 0)
    
    // Using for loop total calculation
    // let total = 0;
    // for (let i = 0; i < cart.length; i++) {
    //     const product = cart[i];
    //     total += product.price;
        
    // }
    let shipping = 0;
    if(total > 35){
        shipping = 0;
    }
    else if(total > 15){
        shipping =  4.99;
    }
    else
        shipping = 0;

    return (
        <div>
            <h4 className="fw-bold text-warning">Order summary</h4>
            <p>Items Ordered: {cart.length}</p>
            <p>Product Price: {total.toFixed(2)}</p>
            <p><small>Shipping Price: {shipping}</small></p>
            <h5>Total price: {(shipping + total).toFixed(2)}</h5>
            {
                props.children
            }
        </div>
    );
};

export default Cart;