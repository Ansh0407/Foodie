import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MyOrders.css"; // Import the CSS file for styles

const MyOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("https://ansh-foodie-backend.vercel.app/api/orders", {
          withCredentials: true,
        });

        // Convert the order.items to the desired format
        const updatedOrders = response.data.map((order) => ({
          ...order,
          items: Object.entries(order.items).map(([foodId, quantity]) => ({
            foodId: parseInt(foodId, 10), // Ensure foodId is a number
            quantity: quantity,
          })),
          delivery_data: JSON.parse(order.delivery_data),
        }));

        setOrders(updatedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    console.log(orders);
  }, [orders]);

  if (!orders.length) {
    return <h1>Fetching orders...</h1>;
  }

  return (
    <div className="orders-container">
      <h2>My Orders</h2>
      {orders.map((order) => (
        <div className="order-card" key={order.id}>
          <h3>Order #{order.id}</h3>

          {/* Items Table */}
          <h4>Items</h4>
          <table className="items-table">
            <thead>
              <tr>
                <th>Food ID</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {order.items
                .filter((item) => item.quantity > 0) // Filter items with quantity > 0
                .map((item) => (
                  <tr key={item.foodId}>
                    <td>{item.foodId}</td>
                    <td>{item.quantity}</td>
                  </tr>
                ))}
            </tbody>
          </table>

          {/* Delivery Info Table */}
          <h4>Delivery Info</h4>
          <table className="delivery-table">
            <tbody>
              <tr>
                <td>City</td>
                <td>{order.delivery_data.city}</td>
              </tr>
              <tr>
                <td>Email</td>
                <td>{order.delivery_data.email}</td>
              </tr>
              <tr>
                <td>Phone</td>
                <td>{order.delivery_data.phone}</td>
              </tr>
              <tr>
                <td>State</td>
                <td>{order.delivery_data.state}</td>
              </tr>
              <tr>
                <td>Street</td>
                <td>{order.delivery_data.street}</td>
              </tr>
              <tr>
                <td>Country</td>
                <td>{order.delivery_data.country}</td>
              </tr>
              <tr>
                <td>Zipcode</td>
                <td>{order.delivery_data.zipcode}</td>
              </tr>
              <tr>
                <td>Last Name</td>
                <td>{order.delivery_data.lastName}</td>
              </tr>
              <tr>
                <td>First Name</td>
                <td>{order.delivery_data.firstName}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default MyOrders;
