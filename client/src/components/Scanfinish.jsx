import "../output.css"
import "../jan.css"
import React, { useRef } from 'react';
import { useLocation } from "react-router-dom";
export const Scanfinish = () => {
    const result = useRef();
    const su = useRef();
    const recipe = useRef();
    const date = useRef();
    let nasi = useRef();
    const buydate = useRef();
    nasi.checked = true;
    const location = useLocation();
    const receivedData = location.state; /* Scan.jsxから渡されたデータを取得*/
    const itemData = JSON.parse(JSON.stringify(receivedData)); /* Scan.jsxから渡されたデータをJSON化して読込み*/
    console.log(itemData.itemName); /*スキャンした商品名*/
    console.log(itemData.itemImageUrl); /*スキャンした商品イメージのURL*/
    const finish = () => {
        let Nasi = nasi.current;
        if (Nasi.checked) {
            Nasi.checked = true;
        } else {
            Nasi.checked = false;
        }
        if (date.value !== "" && Nasi.checked === true) {//「なし」のチェックボックスと消費期限が両方入力されているとき
            let message = "「賞味期限・消費期限」と「期限なし」を同時選択することはできません"
            document.getElementById('checkmessage').innerHTML = message;
        } else {
            console.log("商品名", result.current.textContent);//商品名取得
            console.log("個数", su.current.value);//select.value:個数取得
            console.log("期限なし", Nasi.checked);//渡される値:チェックありtrueチェックなしfalse
            console.log("レシピ用名称", recipe.current.value);
            console.log("消費賞味期限", date.current.value);
            console.log("買った日", buydate.current.value);
        }
    }
    return (
        <div>
            <h1>Scanfinish</h1>
            <div className="page">
                <div className="goods">
                    <div><img id='image' src={`${itemData.itemImageUrl}`} alt=""></img></div>
                    <div className="goodsname">
                        <div id="goodsname" name="name">商品名</div>
                        <div ref={result}>{itemData.itemName}</div>
                    </div>
                </div>
                <div id="kigen">賞味期限・消費期限</div>
                <label className="date-edit"><input type="date" ref={date} defaultValue="" name="deadline" /></label>
                <label><input type="checkbox" name="nasi" ref={nasi} />期限なし</label>
                <p id="checkmessage" style={{ color: "red" }}></p>
                <div className="tag">
                    <div>購入日</div>
                    <label className="date-edit"><input type="date" ref={buydate} defaultValue="" name="buydate" required /></label>
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
                    <input type="text" ref={recipe} name="recipename" defaultValue="" required />
                    <button onClick={finish}>登録</button>
                </div>
            </div>
        </div>
    );
};