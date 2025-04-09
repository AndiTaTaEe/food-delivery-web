import React from "react";
import "./Cart.css";
import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cartItems, food_list, removeFromCart, getTotalCartAmmount} = useContext(StoreContext);
  
  const navigate = useNavigate();

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
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${getTotalCartAmmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${getTotalCartAmmount()===0?0:2}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>${getTotalCartAmmount()===0?0:getTotalCartAmmount()+2}</b>
            </div>
          </div>
          <button onClick={()=>navigate('/order')}>PROCEED TO CHECKOUT</button>
        </div>
        <div className="cart-promocode">
          <div>
            <p>If you have a promo code, enter it here</p>
            <div className="cart-promocode-input">
              <input type="text" placeholder='promo code' />
              <button>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
