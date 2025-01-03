import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import {Card, CardBody} from "@nextui-org/react";
import "../output.css"

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = Cookies.get('token');
      try {
        const response = await axios.get('http://localhost:5000/api/auth/stock', {
          headers: {
            'Authorization': token
          }
        });
        setItems(response.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data.');
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Item List</h1>
      {items.map((stock) => (
      <Card>
        <CardBody>
            <div key={stock.stock_id}>
              <h1>{stock.item_name}</h1>
              <div className='flex gap-3'>
                <h2>{stock.buy_date}</h2>
                <p>{stock.expiration_date}</p>
              </div>
              <p>{stock.quantity}</p>
            </div>
        </CardBody>
      </Card>
      ))}
    </div>
  );
};

export default ItemList;
