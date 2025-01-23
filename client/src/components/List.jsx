import React, { useState, useEffect } from 'react';
import "../output.css";
import { Input, Button, Divider, Spacer, Card} from '@heroui/react';

export const List = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');

  useEffect(() => {
    // ローカルストレージからデータを読み込む
    const savedItems = JSON.parse(localStorage.getItem('shoppingList')) || [];
    setItems(savedItems);
  }, []);

  useEffect(() => {
    // データをローカルストレージに保存する
    localStorage.setItem('shoppingList', JSON.stringify(items));
  }, [items]);

  const handleAddItem = () => {
    if (newItem.trim() !== '') {
      setItems([...items, newItem]);
      setNewItem('');
    }
  };

  const handleDeleteItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  return (
    <div>
      <Spacer y={2}/>
      <h1 className='text-lg font-bold'>買い物リスト</h1>
      <Divider className='my-4' />
      <div className='flex w-full mx-auto md:flex-nowrap gap-4'>
        <Input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          label="商品名"
          fullWidth
          className='mx-4'
        />
        <Button onPress={handleAddItem} className='my-auto mr-3'>追加</Button>
      </div>
      <Spacer y={4} />
      {items.map((item, index) => (
        <div key={index}>
          <Card >
            <div className='flex justify-between'>
              <h1 className='text-lg font-bold my-auto mx-2'>{item}</h1>
              <Button onPress={() => handleDeleteItem(index)} className='m-2'>削除</Button>
            </div>
          </Card>
          <Spacer y={2} />
        </div>
      ))}
    </div>
  );
};