import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Card, CardBody, Button, Divider, Spacer, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/react";
import "../output.css";

const ItemList = ({ stocks, fetchStocks }) => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [reload, setReload] = useState(false);

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
  }, [reload]);

  if (error) {
    return <p>{error}</p>;
  }
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const onOpen = (stock) => {
    setSelectedStock(stock);
    setIsOpen(true);
  };

  const onClose = () => {
    setIsOpen(false);
    setSelectedStock(null);
  };

  const handleDelete = async () => {
    try {
      const token = Cookies.get('token');
      await axios.delete(`http://localhost:5000/api/auth/stock/${selectedStock.stock_id}`, {
        headers: {
          'Authorization': token
        }
      });
      setReload(!reload) // ストックリストを再取得
      onClose();
    } catch (error) {
      console.error('Error deleting stock:', error);
    }
  };

  return (
    <div>
      {items.map((stock) => (
        <div key={stock.stock_id}>
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
                      <Button auto size='small' onPress={() => onOpen(stock)}>編集</Button>
                    </div>
                  </div>
                </div>
            </CardBody>
          </Card>
          <Spacer y={2} />
        </div>
      ))}
      <Modal isOpen={isOpen} onOpenChange={onClose} placement='center'>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">削除確認</ModalHeader>
              <ModalBody>
                <p>本当に削除しますか？</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  キャンセル
                </Button>
                <Button color="primary" onPress={handleDelete}>
                  削除
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
