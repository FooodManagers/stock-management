import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Card, CardBody, Button, Divider, Spacer, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,Input, DatePicker, } from "@heroui/react";
import {DateValue, now, parseAbsoluteToLocal} from "@internationalized/date";
import {useDateFormatter} from "@react-aria/i18n";

const ItemList = ({ stocks, fetchStocks }) => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [reload, setReload] = useState(false);
  const [product, setProduct] = useState(null);
  const [date, setDate] = useState(now());
  const [formData, setFormData] = useState({
    itemName: '',
    quantity: '',
    expirationDate: '',
    expirationType: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      console.log('fetchData');
      const token = Cookies.get('token');
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/auth/stock`, {
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

  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const onOpenDelete = (stock) => {
    setSelectedStock(stock);
    setIsOpenDelete(true);
  };

  const onOpenEdit = async (stock) => {
    setIsOpenEdit(true);
    setSelectedStock(stock);
    console.log(stock.jan_code);
    await getProduct(stock.jan_code);
    setFormData({
      itemName: stock.item_name,
      quantity: stock.quantity,
      expirationDate: stock.expiration_date,
      expirationType: stock.expiration_type,
      recipe_name: stock.recipe_name,
    });
    setDate(parseAbsoluteToLocal(stock.expiration_date));
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
      await axios.delete(`${process.env.REACT_APP_BACKEND_BASE_URL}/auth/stock/${selectedStock.stock_id}`, {
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
  const handleEdit = async () => {
    try {
      const token = Cookies.get('token');
      await axios.put(`${process.env.REACT_APP_BACKEND_BASE_URL}/auth/stockedit/${selectedStock.stock_id}`, {
        item_name: formData.itemName,
        quantity: formData.quantity,
        expiration_date: formatDate(formData.expirationDate),
        expiration_type: formData.expirationType,
        recipe_name: formData.recipe_name,
      }, {
        headers: {
          'Authorization': token
        }
      });
      setReload(!reload); // ストックリストを再取得
      onClose();
    } catch (error) {
      console.error('Error editing stock:', error);
    }
  };

  const getProduct = async (jan_code) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/auth/product`, {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div>
      {items.map((stock) => (
        <div key={stock.stock_id}>
          <Card className='shadow bg-default-100' onPress={() => {console.log('pressed')}}>
            <CardBody>
                <div key={stock.stock_id}>
                    <h1 className='text-lg font-bold'>{stock.item_name}</h1>
                    {console.log(stock.item_name)}
                  <Divider />
                  <div className='flex gap-2'>
                  <p className='flex gap-2'><span className='font-semibold'>購入日</span>：{formatDate(stock.buy_date)}</p>
                    {stock.expiration_type !== 'なし' && (
                     <p className='flex gap-2 pl-5'><span className='font-semibold'>{stock.expiration_type}</span>：<span>{formatDate(stock.expiration_date)}</span></p>
                    )}
                  </div>
                  <div className='flex gap-2'>
                  <p className='flex gap-2 w-full'><span className='font-semibold'>数量</span>：<span>{stock.quantity}</span></p>
                    {console.log(stock.quantity)}
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
                <Input
                  label="商品名"
                  name="itemName"
                  value={formData.itemName}
                  onChange={handleChange}
                  fullWidth
                />
                <Input
                  label="数量"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  fullWidth
                />
                <input
                  type="date"
                  name="expirationDate"
                  value={formatDateForInput(formData.expirationDate)}
                  onChange={handleChange}
                  className="w-full"
                />
                <Input
                  label="有効期限の種類"
                  name="expirationType"
                  value={formData.expirationType}
                  onChange={handleChange}
                  fullWidth
                />
                <Input
                  label="レシピ名"
                  name='recipe_name'
                  value={formData.recipe_name}
                  onChange={handleChange}
                  fullWidth
                />
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  キャンセル
                </Button>
                <Button color="success" onPress={handleEdit}>
                  保存
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
