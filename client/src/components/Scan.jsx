import "../output.css"
import "../scan.css"
import $ from 'jquery';
import React, { useState } from 'react';
import Quagga from 'quagga';
export const Scan = () => {

  const [codes, setCodes] = useState([]);//jancode(20回分)が入る配列の宣言
  const [detectedCode, setDetectedCode] = useState(null);

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
      (err) => {
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
        if (newCodes.length === 20) {
          Quagga.stop();
          sendCodesToServer(newCodes);
        }
        return newCodes;
      });
    });
  };

  const sendCodesToServer = (codes) => {
    fetch("http://localhost:3001/barcode", {
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
          setDetectedCode(data.adoptedValue);
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

  return (
    <div>
      <div id="my_container">
        <div id="my_inner">
          <div>バーコードを映してください</div>
          <div>
            <button onClick={my_start}>スキャン</button>
          </div>
          <div id="my_quagga"></div>
          <div class="hand">
            <div id="triangle"></div>
            <import type="text">手入力する</import>
          </div>
          <button onClick={my_stop}>キャンセル</button>
        </div>
      </div>
    </div>
  );

};

export default Scan;//他のファイルでこのファイルを読み込む(import)ときに好きな名前を付けられる