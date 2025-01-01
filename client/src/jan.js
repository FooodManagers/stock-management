const urlParams = new URLSearchParams(window.location.search);
const value = urlParams.get('value');
console.log("値", value);
const url = `https://api.jancodelookup.com/?appId=e4c2c84cc860d50e4df967f1535645f3&query=${value}`;
const item = document.getElementById('result');
const image = document.getElementById('image');
fetch(url)
    .then(responce => {
        if (!responce.ok) {
            throw new Error('ネットワークエラーが発生しました');
        }
        return responce.json();
    })
    .then((result) => {
        Example(result);
    })
    .catch(error => {
        console.error('処理中にエラーが発生しました', error);
    });
function Example(jsonObj) {
    const data = jsonObj.product[0]
    item.textContent = data.itemName;
    // let result = [data.itemName, data.itemImageUrl];
    // for (let i = 0; i < result.length; i++) {
    //     let li = document.createElement('li');
    //     li.textContent = result[i];
    //     document.getElementById('canvas').appendChild(li);
    // }
    image.src = data.itemImageUrl;
}