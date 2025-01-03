import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Card, CardBody, Button, Divider, Spacer, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import "../output.css";

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

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
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  

  return (
    <div>
      {items.map((stock) => (
        <div>
          <Card className='bg-black shadow bg-default-100' onPress={() => {console.log('pressed')}}>
            <CardBody>
                <div key={stock.stock_id}>
                  <h1 className='text-lg font-bold'>{stock.item_name}</h1>
                  <Divider />
                  <div className='flex gap-2'>
                    <p className='flex gap-2'><p className='font-semibold'>購入日</p>：{formatDate(stock.buy_date)}</p>
                    {stock.expiration_type !== 'なし' && (
                    <p className='flex gap-2 pl-5'><p className='font-semibold'>{stock.expiration_type}</p>： {formatDate(stock.expiration_date)}</p>
                    )}
                  </div>
                  <div className='flex gap-2'>
                    <p className='flex gap-2 w-full'><p className='font-semibold'>数量</p>：{stock.quantity}</p>
                    <div className='flex justify-end w-full'>
                      <Button auto size='small' onPress={onOpen}>編集</Button>
                    </div>
                  </div>
                </div>
            </CardBody>
          </Card>
          <Spacer y={2} />
        </div>
      ))}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement='center'>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1"></ModalHeader>
              <ModalBody>
                <p>Modal Content</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ItemList;
