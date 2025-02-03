import "../jan.css"
import React, { useRef } from 'react';
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
export const Scanfinish = () => {
    const navigate = useNavigate();
    const result = useRef();
    const su = useRef();
    const recipe = useRef();
    const date = useRef();
    let nasi = useRef();
    let kigen_Nasi = useRef();
    const buydate = useRef();
    const date_type = useRef();
    nasi.checked = true;
    const location = useLocation();
    const receivedData = location.state; /* Scan.jsxから渡されたデータを取得*/
    const itemData = JSON.parse(JSON.stringify(receivedData)); /* Scan.jsxから渡されたデータをJSON化して読込み*/
    console.log(itemData.itemName); /*スキャンした商品名*/
    console.log(itemData.itemImageUrl); /*スキャンした商品イメージのURL*/

    const [mail, setMail] = useState([]);

  useEffect(() => {
    // メールアドレスを取得
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
    const finish = () => {
        let Nasi = nasi.current;
        let expiration_type = date_type.current.value;
        if (Nasi.checked) {
            Nasi.checked = true;
            kigen_Nasi = 1;
            date.current.value = "1990-01-01";
            expiration_type = "なし";
        } else {
            Nasi.checked = false;
            kigen_Nasi = 0;
        }
        if (date.current.value !== "1990-01-01" && Nasi.checked === true) {//「なし」のチェックボックスと消費期限が両方入力されているとき
            let message = "「賞味期限・消費期限」と「期限なし」を同時選択することはできません"
            console.log("ダメ");
            document.getElementById('checkmessage').innerHTML = message;
        } else {
            console.log("商品名", result.current.textContent);//商品名取得
            console.log("個数", su.current.value);//select.value:個数取得
            console.log("期限なし", kigen_Nasi);//渡される値:チェックありtrueチェックなしfalse
            console.log("レシピ用名称", recipe.current.value);
            console.log("期限", date.current.value);
            console.log("賞味消費期限タイプ", expiration_type);
            console.log("買った日", buydate.current.value);
            console.log("会社名", itemData.makerName);
            console.log("ブランド名", itemData.brandName);
            console.log("jancode", itemData.jancode);
            /*jandbへ渡すデータ*/
            
            const dataToSend = {
                jan_code: itemData.jancode, itemName: itemData.itemName, itemImageUrl: itemData.itemImageUrl, brandName: itemData.brandName, makerName: itemData.makerName,
                quantity: su.current.value, expiration_date: date.current.value, expiration_type: expiration_type, nasi: kigen_Nasi, recipe_name:
                    recipe.current.value, buy_date: buydate.current.value, mail: mail.email
            };
            sendDBToServer(dataToSend);/*jandbにデータを送る*/
        };
        navigate('/'); /*homeに戻る*/
    };

    const sendDBToServer = (input) => {
        fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/jandb`, {/*jancodeを元にJANCODELOOKUPAPIからデータを得るためにjan.jsにデータを送る*/
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ data: input }),/*javascriptオブジェクトをJSON形式の文字列に変換*/
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.succsess) {
                    console.log(data.succsess);
                    console.log(data.brandName);
                    console.log(data.makerName);
                    console.log(data.itemName);/*商品の名前*/
                    console.log("image:", data.itemImageUrl);/*商品の画像URL*/
                    /*jandb.jsへのデータ渡しと画面遷移*/
                    /*console.log(dataToSend);*/
                } else {
                    console.error("コード処理エラー");
                }
            })
            .catch((err) => console.error(err));
    };



    return (
        <div>
            <div className="page">
                <div className="goods">
                    <div><img id='image' src={`${itemData.itemImageUrl}`} alt=""></img></div>
                    <div className="goodsname">
                        <div id="goodsname" name="name">商品名</div>
                        <div ref={result}>{itemData.itemName}</div>
                    </div>
                </div>
                <div className="tag"></div>
                <div id="kigen">賞味期限・消費期限</div>
                <div id="kigen_type">
                    <select ref={date_type} name="deadline">
                        <option defaultValue="賞味期限">賞味期限</option>
                        <option defaultValue="消費期限">消費期限</option>
                    </select>
                    <label className="date-edit"><input type="date" ref={date} defaultValue="" name="deadline" /></label><br></br>
                    <label><input type="checkbox" name="nasi" ref={nasi} />期限なし</label>
                </div>
                <p id="checkmessage" style={{ color: "red" }}></p>
                <div className="tag">
                    <div className="display">
                        <label>購入日<input type="date" ref={buydate} defaultValue="" name="buydate" required /></label>
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
                    <input type="text" ref={recipe} name="recipename" defaultValue="" placeholder="入力してください入力してください" required />
                    <div className="finish">
                        <button onClick={finish}>登録</button>
                    </div>
                </div>
            </div>
        </div >
    );
};
