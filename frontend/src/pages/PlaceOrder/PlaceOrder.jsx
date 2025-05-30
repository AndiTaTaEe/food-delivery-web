import React, { useContext, useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import "./PlaceOrder.css";
import axios from "axios";

const PlaceOrder = () => {
  const { getTotalCartAmmount, token, food_list, cartItems, url } =
    useContext(StoreContext);

  const [appliedPromo, setAppliedPromo] = useState(null);

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
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
    const subtotal = getTotalCartAmmount()+2;
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


  const placeOrder = async (event) => {
    event.preventDefault();
    let orderItems = [];
    food_list.map((item) => {
      if (cartItems[item._id]>0) {
        let itemInfo = item;
        itemInfo["quantity"] = cartItems[item._id];
        orderItems.push(itemInfo);
      }
    })
    let orderData = {
      address: data,
      items: orderItems,
      amount: getFinalTotal(), //delivery fee
      discountCode: appliedPromo ? appliedPromo.code : null,
      discountAmount: getDiscountAmount()
    }
    let response = await axios.post(url+ "/api/order/place", orderData, {headers: {token}});
    if (response.data.success) {
      const {session_url} = response.data;
      window.location.replace(session_url);
    } else {
      alert("Error");
    }
  }


  const navigate = useNavigate();

  useEffect(() => {
    if(!token) {
      navigate('/cart');
    } else if (getTotalCartAmmount() === 0) {
      navigate('/cart');
    }

    const savedPromo = localStorage.getItem("appliedPromo");
    if(savedPromo) {
      setAppliedPromo(JSON.parse(savedPromo));
    }
  }, [token]);
  
  return (
    <form onSubmit={placeOrder} className="place-order" data-testid="order-page">
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input required
            name="firstName"
            onChange={onChangeHandler}
            value={data.firstName}
            type="text"
            placeholder="First Name"
          />
          <input required
            name="lastName"
            onChange={onChangeHandler}
            value={data.lastName}
            type="text"
            placeholder="Last Name"
          />
        </div>
        <input required
          name="email"
          onChange={onChangeHandler}
          value={data.email}
          type="email"
          placeholder="Email adress"
        />
        <input required
          name="street"
          onChange={onChangeHandler}
          value={data.street}
          type="text"
          placeholder="Street"
        />
        <div className="multi-fields">
          <input required
            name="city"
            onChange={onChangeHandler}
            value={data.city}
            type="text"
            placeholder="City"
          />
          <input required
            name="state"
            onChange={onChangeHandler}
            value={data.state}
            type="text"
            placeholder="State"
          />
        </div>
        <div className="multi-fields">
          <input required
            name="zipcode"
            onChange={onChangeHandler}
            value={data.zipcode}
            type="text"
            placeholder="Zip code"
          />
          <input required
            name="country"
            onChange={onChangeHandler}
            value={data.country}
            type="text"
            placeholder="Country"
          />
        </div>
        <input required
          name="phone"
          onChange={onChangeHandler}
          value={data.phone}
          type="text"
          placeholder="Phone"
        />
      </div>
      <div className="place-order-right">
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
              <p>${getTotalCartAmmount() === 0 ? 0 : (appliedPromo?.code ==="FREESHIP" ? 0 : 2)}</p>
            </div>
            {appliedPromo && (
              <>
              <hr />
              <div className="cart-total-details promo-discount">
                <p>Discount ({appliedPromo.code})</p>
                <p>-${getDiscountAmount()}</p>
              </div>
              </>
            )

            }
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>
                ${getFinalTotal()}
              </b>
            </div>
            {appliedPromo && (
              <div className="promo-applied">
                <p>Promo code applied: <span>{appliedPromo.code}</span></p>
              </div>
            )}
          </div>
          <button type="submit">PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
