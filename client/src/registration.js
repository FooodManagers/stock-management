const btn = document.getElementById('button');
const goodsname = document.getElementById('result');
const select = document.getElementById('su');
const recipe = document.getElementById('recipe');
const deadline = document.getElementById('date');
let nasi = document.getElementById('nasi');
const buydate = document.getElementById('buydate');
nasi.checked = true;
btn.addEventListener('click', () => {
    if (nasi.checked) {
        nasi.checked = true;
    } else {
        nasi.checked = false;
    }
    if (deadline.value !== "" && nasi.checked === true) {//「なし」のチェックボックスと消費期限が両方入力されているとき
        let message = "「賞味期限・消費期限」と「期限なし」を同時選択することはできません"
        document.getElementById('checkmessage').innerHTML = message;
    } else {
        console.log(goodsname.textContent);//商品名取得
        console.log(select.value);//select.value:個数取得
        console.log(nasi.checked);//渡される値:チェックありtrueチェックなしfalse
        console.log(recipe.value);
        console.log(deadline.value);
        console.log(buydate.value);
    }
})