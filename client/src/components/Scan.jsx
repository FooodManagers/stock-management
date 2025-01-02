import "../output.css"
import "../scan.css"
import React, { useRef, useState } from 'react';
import Quagga from 'quagga';
import { useNavigate } from "react-router-dom";
export const Scan = () => {
  const navigete = useNavigate();
  const [codes, setCodes] = useState([]);//jancode(20回分)が入る配列の宣言
  const [detectedCode, setDetectedCode] = useState(null); // 状態の初期化
  let jancode;
  const result = useRef();
  const Jancode = useRef();

  const my_start = () => {//スキャンボタンを押したとき
    console.log("scannerスタート");
    Quagga.init(
      {
        inputStream: {//カメラ起動の準備
          name: "Live",
          type: "LiveStream",
          target: document.querySelector("#my_quagga"),//HTMLの要素を取得
          constraints: {
            video: { facingMode: "environment" },//リアカメラ
          },
        },
        decoder: {
          readers: ["ean_reader"],//eanコードはjanコードの海外での名称
        },
      },
      (err) => {//quaggaが起動できない場合
        if (err) {
          console.error(err);
          return;
        }
        console.log("Quaggaを初期化済");
        Quagga.start();
      }
    );


    Quagga.onDetected((result) => {
      const code = result.codeResult.code;
      setCodes((prevCodes) => {
        const newCodes = [...prevCodes, code];
        if (newCodes.length === 20) {//jancode候補が20個集まったら
          Quagga.stop();//カメラをストップする
          sendCodesToServer(newCodes);
          console.log("janCode_check:", detectedCode);
          console.log("jancode:", jancode);
          sendJanToServer(4902105280102);
          //sendJanToServer(detectedCode);
        }
        return newCodes;
      });
    });
  };

  const sendCodesToServer = (codes) => {
    fetch("http://localhost:3001/jancode", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ codes }),//javascriptオブジェクトをJSON形式の文字列に変換
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          console.log("janCode:", data.adoptedValue);
          jancode = data.adoptedValue;
          setDetectedCode(data.adoptedValue);
        } else {
          console.error("コード処理エラー");
        }
      })
      .catch((err) => console.error(err));
  };
  const sendJanToServer = (input) => {
    fetch("http://localhost:3002/jancodefinish", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: input }),//javascriptオブジェクトをJSON形式の文字列に変換
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          console.log("check0");
          const { item } = result;
          console.log("check1");
          item.textContent = data.itemName;
          console.log("check2");
          console.log("image:", data.itemImageUrl);

        } else {
          console.error("コード処理エラー");
        }
      })
      .catch((err) => console.error(err));
  };

  const my_stop = () => {//キャンセルボタンを押したとき
    console.log("ストップ");
    Quagga.stop();
  };
  const Hand = () => {
    navigete('/Hand');
  }
  return (
    <div>
      navigete('/Scanfinish');
      <div id="my_container">
        <div id="my_inner">
          <input type="text" ref={result} defaultValue="" size="20" />
          <div>バーコードを映してください</div>
          <div>
            <button onClick={my_start}>スキャン</button>
          </div>
          <div id="my_quagga"></div>
          <p>Detected Code: {detectedCode}</p>
          <input ref={Jancode} defaultValue={4902105280102} />
          <div className="hand">
            <div id="triangle"></div>
            <button onClick={Hand}>手入力する</button>
          </div>
          <button onClick={my_stop}>キャンセル</button>
        </div>
      </div>
    </div>
  );

};

export default Scan;//他のファイルでこのファイルを読み込む(import)ときに好きな名前を付けられる