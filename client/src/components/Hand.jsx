import "../output.css";
import "../hand.css";
import React, { useRef } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export const Hand = () => {
  const navigate = useNavigate();
  const result = useRef();
  const su = useRef();
  const recipe = useRef();
  const date = useRef();
  const nasi = useRef();
  const buydate = useRef();
  const date_type = useRef();
  let kigen_Nasi = useRef();
  nasi.current = { checked: true };

  const finish = async () => {
    let Nasi = nasi.current;
    let expiration_type = date_type.current.value;
    if (Nasi.checked) {
      kigen_Nasi = 1;
      date.current.value = "1990-01-01";
      expiration_type = "なし";
    } else {
      kigen_Nasi = 0;
    }
    if (date.current.value !== "1990-01-01" && Nasi.checked === true) {
      console.log("ダメ");
      let message = "「賞味期限・消費期限」と「期限なし」を同時選択することはできません";
      document.getElementById('checkmessage').innerHTML = message;
    } else {
      console.log("商品名", result.current.value);
      console.log("個数", su.current.value);
      console.log("期限なし", kigen_Nasi.checked);
      console.log("レシピ名称", recipe.current.value);
      console.log("賞味消費期限", date.current.value);
      console.log("買った日", buydate.current.value);
      console.log("賞味消費期限タイプ", expiration_type);

      /* stockRegisterへ渡すデータ */
      const dataToSend = {
        itemName: result.current.value,
        quantity: su.current.value,
        expiration_date: date.current.value,
        expiration_type: expiration_type,
        nasi: kigen_Nasi,
        recipe_name: recipe.current.value,
        buy_date: buydate.current.value
      };

      try {
        const response = await axios.post('http://it232044-pc.tail6d80a5.ts.net:5000/api/auth/stockRegister', { data: dataToSend });
        console.log('データ登録成功:', response.data);
      } catch (error) {
        console.error('データ登録エラー:', error);
      }

      navigate('/'); /* homeに戻る */
    }
  };

  const Scan = () => {
    navigate('/scan');
  };

  return (
    <div>
      <div className="page">
        <div className="goodsname">
          <div id="goodsName" name="name">商品名</div>
          <input type="text" ref={result} defaultValue="" size="20" placeholder="商品名を入力してください" />
        </div>
        <div id="kigen">賞味期限・消費期限</div>
        <div id="kigen_type">
          <select ref={date_type} name="deadline">
            <option defaultValue="消費期限">賞味期限</option>
            <option defaultValue="消費期限">消費期限</option>
          </select>
          <label className="date-edit"><input type="date" ref={date} defaultValue="" name="deadline" /></label>
          <label className="date-edit"><input type="checkbox" name="nasi" ref={nasi} />期限なし</label>
        </div>
        <p id="checkmessage" style={{ color: "red" }}></p>
        <div className="tag">
          <div className="display">
            <label>購入日<input type="date" ref={buydate} name="buydate" required /></label>
          </div>
          <div>購入数</div>
          <select ref={su} name="su">
            <option defaultValue="1">1</option>
            <option defaultValue="2">2</option>
            <option defaultValue="3">3</option>
            <option defaultValue="4">4</option>
            <option defaultValue="5">5</option>
            <option defaultValue="6">6</option>
            <option defaultValue="7">7</option>
            <option defaultValue="8">8</option>
            <option defaultValue="9">9</option>
          </select>
          <div>レシピ用名称</div>
          <input type="text" ref={recipe} name="recipename" defaultValue="" size="20" placeholder="入力してください" required /><br></br>
        </div>
        <div className="finish">
          <button onClick={finish}>登録</button>
        </div>
        <div className="scan">
          <div id="triangle"></div>
          <button onClick={Scan}>スキャン画面に戻る</button>
        </div>
      </div>
    </div>
  );
};

///////////////////////////////////////////////////
// import "../output.css"
// import "../hand.css"
// import React, { useRef } from 'react';
// import { useNavigate } from "react-router-dom";
// export const Hand = () => {
//     const navigate = useNavigate();
//     const result = useRef();
//     const su = useRef();
//     const recipe = useRef();
//     const date = useRef();
//     let nasi = useRef();
//     const buydate = useRef();
//     const date_type = useRef();
//     let kigen_Nasi = useRef();
//     nasi.checked = true;
//     const finish = () => {
//         let Nasi = nasi.current;
//         let expiration_type = date_type.current.value;
//         if (Nasi.checked) {
//             Nasi.checked = true;
//             kigen_Nasi = 1;
//             date.current.value = "1990-01-01";
//             expiration_type = "なし";
//         } else {
//             Nasi.checked = false;
//             kigen_Nasi = 0;
//         }
//         if (date.current.value !== "1990-01-01" && Nasi.checked === true) {//「なし」のチェックボックスと消費期限が両方入力されているとき
//             console.log("ダメ");
//             let message = "「賞味期限・消費期限」と「期限なし」を同時選択することはできません"
//             document.getElementById('checkmessage').innerHTML = message;
//         } else {
//             console.log("商品名", result.current.value);//商品名取得
//             console.log("個数", su.current.value);//select.value:個数取得
//             console.log("期限なし", kigen_Nasi);//渡される値:チェックありtrueチェックなしfalse
//             console.log("レシピ名称", recipe.current.value);
//             console.log("賞味消費期限", date.current.value);
//             console.log("買った日", buydate.current.value);
//             console.log("賞味消費期限タイプ", expiration_type);

//             /*jandbへ渡すデータ*/
//             const dataToSend = {
//                 itemName: result.current.value, quantity: su.current.value, expiration_date: date.current.value, expiration_type: expiration_type, nasi: kigen_Nasi, recipe_name:
//                     recipe.current.value, buy_date: buydate.current.value
//             };
//             sendDBToServer(dataToSend);/*jandbにデータを送る*/
//         };
//         navigate('/'); /*homeに戻る*/
//     };
//     const sendDBToServer = (input) => {
//         fetch("http://localhost:3003/jandb", {/*jancodeを元にJANCODELOOKUPAPIからデータを得るためにjan.jsにデータを送る*/
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ data: input }),/*javascriptオブジェクトをJSON形式の文字列に変換*/
//         })
//             .then((res) => res.json())
//             .then((data) => {
//                 if (data.succsess) {
//                     console.log(data.succsess);
//                     console.log(data.brandName);
//                     console.log(data.makerName);
//                     console.log(data.itemName);/*商品の名前*/
//                     console.log("image:", data.itemImageUrl);/*商品の画像URL*/
//                     /*jandb.jsへのデータ渡しと画面遷移*/
//                     /*console.log(dataToSend);*/
//                 } else {
//                     console.error("コード処理エラー");
//                 }
//             })
//             .catch((err) => console.error(err));
//     };

//     const Scan = () => {
//         navigate('/scan');
//     }
//     return (
//         <div>
//             <div className="page">
//                 <div className="goodsname">
//                     <div id="goodsName" name="name">商品名</div>
//                     <input type="text" ref={result} defaultValue="" size="20" placeholder="商品名を入力してください" />
//                 </div>
//                 <div id="kigen">賞味期限・消費期限</div>
//                 <div id="kigen_type">
//                     <select ref={date_type} name="deadline">
//                         <option defaultValue="消費期限">賞味期限</option>
//                         <option defaultValue="消費期限">消費期限</option>
//                     </select>
//                     <label className="date-edit"><input type="date" ref={date} defaultValue="" name="deadline" /></label>
//                     <label className="date-edit"><input type="checkbox" name="nasi" ref={nasi} />期限なし</label>
//                 </div>
//                 <p id="checkmessage" style={{ color: "red" }}></p>
//                 <div className="tag">
//                     <div className="display">
//                         <label>購入日<input type="date" ref={buydate} name="buydate" required /></label>
//                     </div>
//                     <div>購入数</div>
//                     <select ref={su} name="su">
//                         <option defaultValue="1">1</option>
//                         <option defaultValue="2">2</option>
//                         <option defaultValue="3">3</option>
//                         <option defaultValue="4">4</option>
//                         <option defaultValue="5">5</option>
//                         <option defaultValue="6">6</option>
//                         <option defaultValue="7">7</option>
//                         <option defaultValue="8">8</option>
//                         <option defaultValue="9">9</option>
//                     </select>
//                     <div>レシピ用名称</div>
//                     <input type="text" ref={recipe} name="recipename" defaultValue="" size="20" placeholder="入力してください" required /><br></br>
//                 </div>
//                 <div className="finish">
//                     <button onClick={finish}>登録</button>
//                 </div>
//                 <div className="scan">
//                     <div id="triangle"></div>
//                     <button onClick={Scan}>スキャン画面に戻る</button>
//                 </div>
//             </div>
//         </div>
//     );
// };