import React, { useState } from 'react';
import './Products.css';
import axios from 'axios';
import { useSelector } from 'react-redux';

 const products = [
  { id: 1, name: 'USB Cable', price: 200, discount: 10, rating: 4.5, image: '' },
  { id: 2, name: 'Mouse Pad', price: 150, discount: 5, rating: 4.2, image: '' },
  { id: 3, name: 'HDMI Cable', price: 400, discount: 15, rating: 4.6, image: '' },
  { id: 4, name: 'Phone Stand', price: 300, discount: 8, rating: 4.3, image: '' },
  { id: 5, name: 'Laptop Sleeve', price: 800, discount: 12, rating: 4.7, image: '' },
  { id: 6, name: 'Wireless Mouse', price: 750, discount: 10, rating: 4.4, image: '' },
  { id: 7, name: 'Bluetooth Speaker', price: 1500, discount: 20, rating: 4.8, image: '' },
  { id: 8, name: 'Portable Charger', price: 1200, discount: 18, rating: 4.6, image: '' },
  { id: 9, name: 'Keyboard Cover', price: 250, discount: 6, rating: 4.1, image: '' },
  { id: 10, name: 'Webcam Cover', price: 100, discount: 5, rating: 4.0, image: '' },
  { id: 11, name: 'MicroSD Card', price: 600, discount: 14, rating: 4.5, image: '' },
  { id: 12, name: 'Laptop Stand', price: 900, discount: 11, rating: 4.7, image: '' },
  { id: 13, name: 'Noise Cancelling Earbuds', price: 2200, discount: 22, rating: 4.9, image: '' },
  { id: 14, name: 'USB-C Hub', price: 1300, discount: 17, rating: 4.6, image: '' },
  { id: 15, name: 'LED Desk Lamp', price: 850, discount: 9, rating: 4.4, image: '' }
];


export default function ProductPage() {
  const [cart, setCart] = useState({});
  const { user } = useSelector((state) => state.user);

  const handleAddToCart = (product) => {
    setCart((prev) => ({
      ...prev,
      [product.id]: { ...product, quantity: 1 }
    }));
  };

  const increment = (id) => {
    setCart((prev) => ({
      ...prev,
      [id]: { ...prev[id], quantity: prev[id].quantity + 1 }
    }));
  };

  const decrement = (id) => {
    setCart((prev) => {
      const updated = { ...prev };
      if (updated[id].quantity === 1) {
        delete updated[id];
      } else {
        updated[id].quantity -= 1;
      }
      return updated;
    });
  };

  const totalPrice = Object.values(cart).reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handlePlaceOrder = async () => {
    if (!user || !user._id) {
      alert("Please login before placing an order.");
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/transaction/purchase', {
        userId: user._id,
        amount: totalPrice
      });

      alert(` ${res.data.message}`);
      setCart({});
    } catch (err) {
      console.error(err);
      alert(' Failed to place order');
    }
  };

  return (
    <>
      <h1 className="tagline">🛍️ Shop Smart, Earn Smarter – Refer & Earn While You Buy!</h1>
      <div className="shop-container">
        {/* Products */}
        <div className="product-list">
          {products.map((product) => {
            const inCart = cart[product.id];
            return (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  {/* Placeholder image */}
                  <img
                    src="https://via.placeholder.com/100"
                    alt={product.name}
                  />
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p>Price: ₹{product.price}</p>
                  <p>Discount: {product.discount}%</p>
                  <p>⭐ {product.rating} / 5</p>

                  {!inCart ? (
                    <button className="btn-add" onClick={() => handleAddToCart(product)}>
                      Add to Cart
                    </button>
                  ) : (
                    <div className="cart-controls">
                      <button onClick={() => decrement(product.id)}>-</button>
                      <span>{inCart.quantity}</span>
                      <button onClick={() => increment(product.id)}>+</button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Cart */}
        <div className="cart">
          <h2>🛒 Your Cart</h2>
          {Object.keys(cart).length === 0 ? (
            <p>Cart is empty</p>
          ) : (
            <>
              <ul>
                {Object.values(cart).map((item) => (
                  <li key={item.id}>
                    {item.name} × {item.quantity} — ₹{item.price * item.quantity}
                  </li>
                ))}
              </ul>
              <div className="total">
                <strong>Total:</strong> ₹{totalPrice}
              </div>
              <button className="btn-order" onClick={handlePlaceOrder}>Place Order</button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
