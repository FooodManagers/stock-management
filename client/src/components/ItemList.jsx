import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Card, CardBody, Button, Divider, Spacer, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/react";
import "../output.css";

const ItemList = ({ stocks, fetchStocks }) => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [reload, setReload] = useState(false);
  const [product, setProduct] = useState(null);

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

  const onOpenDelete = (stock) => {
    setSelectedStock(stock);
    setIsOpenDelete(true);
  };

  const onOpenEdit = async (stock) => {
    setIsOpenEdit(true);
    setSelectedStock(stock);
    await getProduct(stock.jan_code)
  };

  const onClose = () => {
    setIsOpenDelete(false);
    setIsOpenEdit(false);
    setSelectedStock(null);
    setProduct(null);
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

  const getProduct = async (jan_code) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/auth/product`, {
        headers: {
          'jan_code': jan_code
        }
      });
      setProduct(response.data[0]);
      console.log(response.data[0]);
    } catch (error) {
      console.error('Error editing stock:', error);
    }
  }

  return (
    <div>
      {items.map((stock) => (
        <div key={stock.stock_id}>
          <Card className='shadow bg-default-100' onPress={() => {console.log('pressed')}}>
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
                      <Button auto size='small' color='success' variant='flat' onPress={() => onOpenEdit(stock)}>編集</Button>
                      <Spacer x={1} />
                      <Button auto size='small' color='danger' variant='flat' onPress={() => onOpenDelete(stock)}>削除</Button>
                    </div>
                  </div>
                </div>
            </CardBody>
          </Card>
          <Spacer y={2} />
        </div>
      ))}
      <Modal isOpen={isOpenDelete} onOpenChange={onClose} placement='center'>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">削除確認</ModalHeader>
              <ModalBody>
                <p>本当に削除しますか？</p>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  キャンセル
                </Button>
                <Button color="danger" onPress={handleDelete}>
                  削除
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal isOpen={isOpenEdit} onOpenChange={onClose} placement='center'>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">編集</ModalHeader>
              <ModalBody>
              {product && (
                  <div>
                    <p>商品名: {product.goods_name}</p>
                    <p>メーカー名: {product.maker_name}</p>
                    <img src={product.image_url} alt={product.goods_name} />
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  キャンセル
                </Button>
                <Button color="success" onPress={onClose}>
                  編集
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
