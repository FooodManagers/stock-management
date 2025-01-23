import React, { useState, useEffect } from 'react';
import "../output.css";

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
      <h1>買い物リスト</h1>
      <input
        type="text"
        value={newItem}
        onChange={(e) => setNewItem(e.target.value)}
        placeholder="アイテムを入力"
      />
      <button onClick={handleAddItem}>追加</button>
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            {item}
            <button onClick={() => handleDeleteItem(index)}>削除</button>
          </li>
        ))}
      </ul>
    </div>
  );
};