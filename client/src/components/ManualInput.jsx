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
        const response = await axios.get('http://it232044-pc.tail6d80a5.ts.net:5000/api/auth/getEmail',{
            
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
      const response = await axios.post('http://it232044-pc.tail6d80a5.ts.net:5000/api/auth/stockRegister', { data: dataToSend });
      console.log('データ登録成功:', response.data);
      navigate('/'); // homeに戻る
    } catch (error) {
      console.error('データ登録エラー:', error);
    }
  };

  return (
    <div>
      <Spacer y={3}/>
      <h2 className='text-lg font-bold'>手入力でデータを登録</h2>
      <div>
        <label >商品名: <input type="text" ref={itemNameRef} placeholder="商品名を入力してください" /></label>
      </div>
      <div>
        <label>数量: <input type="number" ref={quantityRef} placeholder="数量を入力してください" /></label>
      </div>
      <div>
        <label>賞味期限・消費期限: <input type="date" ref={expirationDateRef} /></label>
      </div>
      <div>
        <label>期限タイプ: 
          <select ref={expirationTypeRef}>
            <option value="賞味期限">賞味期限</option>
            <option value="消費期限">消費期限</option>
            <option value="なし">なし</option>
          </select>
        </label>
      </div>
      {/* <div>
        <label>期限なし: <input type="checkbox" ref={nasiRef} /></label>
      </div> */}
      <div>
        <label>レシピ名: <input type="text" ref={recipeNameRef} placeholder="レシピ名を入力してください" /></label>
      </div>
      <div>
        <label>購入日: <input type="date" ref={buyDateRef} /></label>
      </div>
      {/* <div>
      <label>レシピ名: <input type="text" ref={mailRef} placeholder="メールアドレス" /></label>
      </div> */}
      <button onClick={handleSubmit}>登録</button>
    </div>
  );
};

export default ManualInput;