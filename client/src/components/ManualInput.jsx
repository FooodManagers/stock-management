import React, { useRef } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { Input, Button, Divider, Spacer, Card} from '@heroui/react';

const ManualInput = () => {
  const navigate = useNavigate();
  const itemNameRef = useRef();
  const quantityRef = useRef();
  const expirationDateRef = useRef();
  const expirationTypeRef = useRef();
  const nasiRef = useRef();
  const recipeNameRef = useRef();
  const buyDateRef = useRef();
  // const mailRef = useRef();

  const [mail, setMail] = useState([]);

  useEffect(() => {
    const fetchMail = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/auth/getEmail`,{
            
            headers: {
              'Authorization': Cookies.get('token')
            }
        });
        setMail(response.data);
        console.log('メールアドレス:', response.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchMail();
  }, []);


  const handleSubmit = async () => {
    // const hasExpiration = nasiRef.current.checked;
    // const expirationDate = hasExpiration ? expirationDateRef.current.value : "1990-01-01";
    // const expirationType = hasExpiration ? expirationTypeRef.current.value : "なし";
    const expirationDate = expirationDateRef.current.value;
    const expirationType = expirationTypeRef.current.value;

    const dataToSend = {
      jan_code: null,
      item_name: itemNameRef.current.value,
      quantity: quantityRef.current.value,
      expiration_date: expirationDate,
      expiration_type: expirationType,
      has_expiration: false,
      recipe_name: recipeNameRef.current.value,
      buy_date: buyDateRef.current.value,
      mail: mail.email
    };
    console.log('データ登録:', dataToSend);

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}/auth/stockRegister`, { data: dataToSend });
      console.log('データ登録成功:', response.data);
      navigate('/'); // homeに戻る
    } catch (error) {
      console.error('データ登録エラー:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow">
  <h2 className="text-xl font-bold mb-4">手入力でデータを登録</h2>
  <div className="mb-4">
    <label className="block mb-1 font-semibold">商品名</label>
    <input
      type="text"
      ref={itemNameRef}
      placeholder="商品名を入力してください"
      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
    />
  </div>
  <div className="mb-4">
    <label className="block mb-1 font-semibold">数量</label>
    <input
      type="number"
      ref={quantityRef}
      placeholder="数量を入力してください"
      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
    />
  </div>
  <div className="mb-4">
    <label className="block mb-1 font-semibold">賞味期限・消費期限</label>
    <input
      type="date"
      ref={expirationDateRef}
      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
    />
  </div>
  <div className="mb-4">
    <label className="block mb-1 font-semibold">期限タイプ</label>
    <select
      ref={expirationTypeRef}
      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
    >
      <option value="賞味期限">賞味期限</option>
      <option value="消費期限">消費期限</option>
      <option value="なし">なし</option>
    </select>
  </div>
  <div className="mb-4">
    <label className="block mb-1 font-semibold">レシピ名</label>
    <input
      type="text"
      ref={recipeNameRef}
      placeholder="レシピ名を入力してください"
      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
    />
  </div>
  <div className="mb-4">
    <label className="block mb-1 font-semibold">購入日</label>
    <input
      type="date"
      ref={buyDateRef}
      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
    />
  </div>
  <Button
    onPress={handleSubmit}
    color="success"
    className="w-full py-2  text-white font-semibold rounded"
  >
    登録
  </Button>
</div>
  );
};

export default ManualInput;
