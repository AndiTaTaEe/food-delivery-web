import React from "react";
import "./Cart.css";
import { useContext, useState, useEffect } from "react";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cartItems, food_list, removeFromCart, getTotalCartAmmount, url} = useContext(StoreContext);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(false);
  const [promoError, setPromoError] = useState("");
  
  const navigate = useNavigate();

  //hardcoded promocodes and their discounts
  const validPromoCodes = {
    "SAVE10": 0.10,
    "SPECIAL20": 0.20,
    "FREESHIP": 1.00, // free ship,
    "ANDISTEFANFREE": 0.95 // 95% off
  }

  const handlePromoSubmit = () => {
    setPromoError("");
    if (!promoCode.trim()) {
      setPromoError("Please enter a promo code.");
      return;
    }

    const normalizedPromoCode = promoCode.trim().toUpperCase();
    if(validPromoCodes.hasOwnProperty(normalizedPromoCode)) {
      setAppliedPromo({
        code: normalizedPromoCode,
        discount: validPromoCodes[normalizedPromoCode]
      });
      localStorage.setItem("appliedPromo", JSON.stringify({
        code: normalizedPromoCode,
        discount: validPromoCodes[normalizedPromoCode]
      }));
      setPromoError("");
    } else {
      setPromoError("Invalid promo code");
      setAppliedPromo(null);
    }
  };

  const getDiscountAmount = () => {
    if(!appliedPromo) return 0;

    const subtotal = getTotalCartAmmount()+2;
    let discountAmount = 0;

    if(appliedPromo.code === "FREESHIP") {
      discountAmount = subtotal === 0 ? 0 : 2;
    } else {
      discountAmount = subtotal * appliedPromo.discount;
    }
    return parseFloat(discountAmount.toFixed(2));
  }

  const getFinalTotal = () => {
    const subtotal = getTotalCartAmmount();
    if(subtotal === 0) return 0;
    const deliveryFee = 2;
    const discountAmount = getDiscountAmount();

    let total;
    if(appliedPromo && appliedPromo.code === "FREESHIP") {
      total = subtotal;
    } else {
      total = subtotal + deliveryFee - discountAmount;
    }
    return parseFloat(total.toFixed(2));
  }

  useEffect(() => {
    const savedPromo = localStorage.getItem("appliedPromo");
    if(savedPromo) {
      setAppliedPromo(JSON.parse(savedPromo));
    }
  }, []);

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
                  <img src={url+"/images/"+item.image} alt={item.name} />
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
              <p>${getTotalCartAmmount()===0?0:(appliedPromo.code==="FREESHIP"?0:2)}</p>
            </div>
            {appliedPromo && (
              <>
              <hr />
              <div className="cart-total-details promo-discount">
                <p>Discount ({appliedPromo.code})</p>
                <p>-${getDiscountAmount()}</p>
              </div>
              </>
            )}
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>${getFinalTotal()}</b>
            </div>
          </div>
          <button onClick={()=>navigate('/order')} disabled={getTotalCartAmmount()===0}>PROCEED TO CHECKOUT</button>
        </div>
        <div className="cart-promocode">
          <div>
            <p>If you have a promo code, enter it here</p>
            <div className="cart-promocode-input">
              <input type="text" placeholder='promo code' value={promoCode} onChange={(e) => setPromoCode(e.target.value)}/>
              <button onClick={handlePromoSubmit}>Submit</button>
            </div>
            {promoError && <p className="promo-error">{promoError}</p>}
            {appliedPromo && (
              <p className="promo-success">Promo code {appliedPromo.code} applied successfully!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
