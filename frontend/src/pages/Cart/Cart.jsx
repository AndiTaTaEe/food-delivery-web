import React from "react";
import "./Cart.css";
import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";

const Cart = () => {
  const { cartItems, food_list, removeFromCart } = useContext(StoreContext);

  return (
    <div className="cart" data-testid="cart-page">
      <div className="cart-items" >
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {food_list.map((item, index) => {
          if (cartItems[item._id] > 0) {
            return (
              <div data-testid={`cart-item-${item._id}`} >
                <div className="cart-items-title cart-items-item"  >
                  <img src={item.image} alt={item.name} />
                  <p>{item.name}</p>
                  <p data-testid={`cart-item-price-${item._id}`}>${item.price}</p>
                  <p data-testid={`cart-item-qty-${item._id}`}>{cartItems[item._id]}</p>
                  <p data-testid={`cart-item-total-${item._id}`}>${item.price * cartItems[item._id]}</p>
                  <p data-testid = {`cart-item-remove-${item._id}`} onClick={() => removeFromCart(item._id)} className="cross" >x</p>
                </div>
                <hr />
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};

export default Cart;
