import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../../context/appContext.js";
import { UserContext } from "../../App.js";
import { useNavigate } from "react-router-dom";
import cartEmpty from "../../img/cart-empty.jpg";
import "./Cart.css";

export default function Cart() {
  const navigate = useNavigate();
  const { cartItems, setCartItems, products, orders, setOrders } = useContext(
    AppContext
  );
  const { user } = useContext(UserContext);
  const [order, setOrder] = useState({});
  const [orderValue, setOrderValue] = useState(0);

  useEffect(() => {
    setOrderValue(
      products.reduce((total, product) => {
        return total + product.price * (cartItems[product.id] ?? 0);
      }, 0)
    );
  }, [cartItems, products]);

  const updateCart = (id, qty) => {
    setCartItems((prevCartItems) => ({ ...prevCartItems, [id]: qty }));
  };

  const submitOrder = () => {
    const newOrder = {
      date: new Date().toDateString(),
      email: user.email,
      details: cartItems,
      total: orderValue,
      status: "pending"
    };
    setOrders((prevOrders) => [...prevOrders, newOrder]);
    setOrder({});
    setCartItems({});
    navigate("/ecomm-react/order");
  };

  return (
    <div className="Cart-container">
      {Object.keys(cartItems).length > 0 ? (
        <>
          <div className="Cart-div-left">
            <table className="Cart-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const cartQuantity = cartItems[product.id] || 0;
                  if (cartQuantity > 0) {
                    return (
                      <tr key={product.id} className="Cart-items">
                        <td className="Cart-item-name">{product.name}</td>
                        <td className="Cart-item-cells">₹{product.price}</td>
                        <td className="Cart-item-buttons">
                          <button
                            className="Cart-button"
                            onClick={() => updateCart(product.id, cartQuantity - 1)}
                          >
                            -
                          </button>
                          <span style={{ padding: "5px" }}>{cartQuantity}</span>
                          <button
                            className="Cart-button"
                            onClick={() => updateCart(product.id, cartQuantity + 1)}
                          >
                            +
                          </button>
                        </td>
                        <td className="Cart-item-cells">
                          ₹{product.price * cartQuantity}
                        </td>
                      </tr>
                    );
                  }
                  return null;
                })}
              </tbody>
            </table>
          </div>
          <div className="Cart-div-right">
            <div className="Cart-order-value">Cart items: {Object.keys(cartItems).length}</div>
            <div className="Cart-order-value">Total: ₹{orderValue}</div>
            <div className="Cart-order-value">
              <button onClick={submitOrder} className="Cart-place-order">
                Proceed to Buy
              </button>
            </div>
          </div>
        </>
      ) : (
        <div>
          <img src={cartEmpty} alt="Cart is empty" />
        </div>
      )}
    </div>
  );
}
