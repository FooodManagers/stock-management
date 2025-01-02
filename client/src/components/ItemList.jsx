import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {Card, CardBody} from "@nextui-org/react";

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/stock');
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
      <ul>
        {items.map((stock) => (
          <li key={stock.stock}>{stock.buy_date}</li> // id, nameはテーブルのカラム名
        ))}
      </ul>
      <Card>
        <CardBody>
          {items.map((stock) => (
            <div key={stock.stock_id}>
              <h2>{stock.buy_date}</h2>
              <p>{stock.stock}</p>
              <p>{stock.price}</p>
              <p>{stock.quantity}</p>
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  );
};

export default ItemList;
