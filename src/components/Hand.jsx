import "../output.css"
import "../hand.css"
import React, { useRef } from 'react';
export const Hand = () => {
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
    return (
        <div>
            <h1>Hand</h1>
            <div class="page">
                <div class="goods">
                    <div><img id='image'></img></div>
                    <div class="goodsname">
                        <div id="goodsname" name="name">商品名</div>
                        <input type="text" ref={result} value="" size="20" placeholder="商品名を入力してください"></input>
                    </div>
                </div>
                <div id="kigen">賞味期限・消費期限</div>
                <label class="date-edit"><input type="date" ref={date} value="" name="deadline"></input></label>
                <label><input type="checkbox" name="nasi" ref={nasi}>期限なし</input></label>
                <p id="checkmessage" style="color: red;"></p>
                <div class="tag">
                    <div>購入日</div>
                    <label class="date-edit"><input type="date" ref={buydate} name="buydate" required></input></label>
                    <div>購入数</div>
                    <select ref={su} name="su">
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                    </select>
                    <div>レシピ用名称</div>
                    <input type="text" ref={recipe} name="recipename" value="" required></input>
                    <button onClick={finish}>登録</button>
                </div>
            </div>
        </div>
    );
};