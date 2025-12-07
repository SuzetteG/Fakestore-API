// src/pages/Cart.jsx
import { useDispatch, useSelector } from "react-redux";
import {
  selectCartItems,
  selectCartTotalPrice,
  selectCartTotalQuantity,
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
  clearCart,
} from "../features/cartSlice";
import { useState } from "react";

export default function Cart() {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const totalQuantity = useSelector(selectCartTotalQuantity);
  const totalPrice = useSelector(selectCartTotalPrice);
  const [checkoutMessage, setCheckoutMessage] = useState("");

  const handleIncrement = (id) => {
    dispatch(incrementQuantity(id));
  };

  const handleDecrement = (id) => {
    dispatch(decrementQuantity(id));
  };

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleCheckout = () => {
    if (items.length === 0) return;

    dispatch(clearCart());
    setCheckoutMessage("Thank you! Your order has been placed and your cart is now empty.");
  };

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <h1>Your Shopping Cart</h1>
        {checkoutMessage && (
          <p className="checkout-message success">{checkoutMessage}</p>
        )}
        <p>Your cart is currently empty.</p>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Your Shopping Cart</h1>

      {checkoutMessage && (
        <p className="checkout-message success">{checkoutMessage}</p>
      )}

      <div className="cart-layout">
        {/* Left: Items */}
        <div className="cart-items">
          {items.map((item) => (
            <div key={item.id} className="cart-item">
              <img
                src={item.image}
                alt={item.title}
                className="cart-item-image"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://via.placeholder.com/80x80?text=No+Image";
                }}
              />
              <div className="cart-item-info">
                <h2 className="cart-item-title">{item.title}</h2>
                <p className="cart-item-price">
                  Price: ${item.price.toFixed(2)}
                </p>
                <p className="cart-item-subtotal">
                  Subtotal: ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>

              <div className="cart-item-controls">
                <div className="quantity-controls">
                  <button onClick={() => handleDecrement(item.id)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => handleIncrement(item.id)}>+</button>
                </div>
                <button
                  className="remove-button"
                  onClick={() => handleRemove(item.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Summary */}
        <div className="cart-summary">
          <h2>Order Summary</h2>
          <p>
            Total items: <strong>{totalQuantity}</strong>
          </p>
          <p>
            Total price: <strong>${totalPrice.toFixed(2)}</strong>
          </p>

          <button className="checkout-button" onClick={handleCheckout}>
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
