import "../output.css"
import "../hand.css"
import React, { useRef } from 'react';
import { useNavigate } from "react-router-dom";
export const Hand = () => {
    const navigate = useNavigate();
    const result = useRef();
    const su = useRef();
    const recipe = useRef();
    const date = useRef();
    let nasi = useRef();
    const buydate = useRef();
    nasi.checked = true;
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
            console.log(result.textContent);//商品名取得
            console.log(su.value);//select.value:個数取得
            console.log(Nasi.checked);//渡される値:チェックありtrueチェックなしfalse
            console.log(recipe.value);
            console.log(su.value);
            console.log(date.value);
            console.log(buydate.value);
        }
    }
    const Scan = () => {
        navigate('/scan');
    }
    return (
        <div>
            <div className="page">
                <div className="goodsname">
                    <div id="goodsName" name="name">商品名</div>
                    <input type="text" ref={result} defaultValue="" size="20" placeholder="商品名を入力してください" />
                </div>
                <div className="tag">
                    <div id="kigen">賞味期限・消費期限</div>
                    <label className="date-edit"><input type="date" ref={date} defaultValue="" name="deadline" /></label>
                    <label className="date-edit"><input type="checkbox" name="nasi" ref={nasi} />期限なし</label>
                    <p id="checkmessage" style={{ color: "red" }}></p>

                    <div>購入日</div>
                    <label className="date-edit"><input type="date" ref={buydate} name="buydate" required /></label>
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
                    <input type="text" ref={recipe} name="recipename" defaultValue="" required /><br></br>
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