import "../output.css"
import "../scan.css"
import React, { useRef, useState } from 'react';
import Quagga from 'quagga';
import { useNavigate } from "react-router-dom";

export const Scan = () => {
  const navigate = useNavigate();
  const [codes, setCodes] = useState([]);/*jancode(20回分)が入る配列の宣言*/
  const [detectedCode, setDetectedCode] = useState(null); /* 状態の初期化*/
  let jancode;
  const result = useRef();
  const Jancode = useRef();
  const my_start = () => {/*スキャンボタンを押したとき*/
    console.log("scannerスタート");
    Quagga.init(
      {
        inputStream: {/*カメラ起動の準備*/
          name: "Live",
          type: "LiveStream",
          target: document.querySelector("#my_quagga"),/*HTMLの要素を取得*/
          constraints: {
            video: { facingMode: "environment" },/*リアカメラ*/
          },
        },
        decoder: {
          readers: ["ean_reader"],/*eanコードはjanコードの海外での名称*/
        },
      },
      (err) => {/*quaggaが起動できない場合*/
        if (err) {
          console.error(err);
          return;
        }
        console.log("Quaggaを初期化済");
        Quagga.start();
      }
    );

    // バーコードが読み取られたときの処理
    Quagga.onDetected((result) => {
      const code = result.codeResult.code;
      setCodes((prevCodes) => {
        const newCodes = [...prevCodes, code];
        if (newCodes.length === 20) {/*jancode候補が20個集まったら*/
          Quagga.stop();/*カメラをストップする*/
          sendCodesToServer(newCodes);
          console.log("codes:", newCodes);
        }
        return newCodes;
      });
    });
  };

  const sendCodesToServer = (codes) => {/*jancode20個から一番多いjancodeを見つけるためにcode.jsに送る*/
    console.log("sendCodes:", codes);
    fetch("http://localhost:5000/api/code", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ codes }),/*javascriptオブジェクトをJSON形式の文字列に変換*/
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          console.log("janCode:", data.adoptedValue);/*jancodeが入る*/
          jancode = data.adoptedValue;
          setDetectedCode(data.adoptedValue);
          sendJanToServer(jancode);/*75行目のsendJanToServerの処理を行う*/
        } else {
          alert('JANCODEが見つかりませんでした。\n「手入力する」を選択して登録してください。');
          console.error("コード処理エラー");
        }
      })
      .catch((err) => console.error(err));
  };

  const sendJanToServer = (input) => {
    fetch("http://localhost:5000/api/jan", {/*jancodeを元にJANCODELOOKUPAPIからデータを得るためにjan.jsにデータを送る*/
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
          console.log(data.brandName);/*ブランド名*/
          console.log(data.makerName);/*会社名*/
          console.log(data.jancode);/*jancode:*/
          console.log(data.itemName);/*商品の名前*/
          console.log("image:", data.itemImageUrl);/*商品の画像URL*/
          /*Scanfinish.jsxへのデータ渡しと画面遷移*/
          const dataToSend = { itemName: data.itemName, itemImageUrl: data.itemImageUrl, brandName: data.brandName, makerName: data.makerName, jancode: data.jancode };/*Scanfinishへ渡すデータ*/
          /*console.log(dataToSend);*/
          navigate('/scanfinish', { state: dataToSend }); /*stateにデータを渡す*/
        } else {
          console.error("コード処理エラー");
        }
      })
      .catch((err) => console.error(err));
  };

  const my_stop = () => {/*キャンセルボタンを押したとき*/
    console.log("ストップ");
    Quagga.stop();
  };
  const Hand = () => {
    navigate('/Hand');
  }
  const ManualInput = () => {
    navigate('/ManualInput');
  }
  const handleManualInput = () => {
    navigate('/ManualInput');
  };
  return (
    <div>
      <div className="w-max h-max justify-center mx-auto mt-2 bg-gray-100 shadow-md  rounded-md">
          <div className="text-center text-3xl p-3">バーコードを映してください</div>
          <div className="m-2" id="my_quagga"/>
          <div className="flex justify-center">
            <button onClick={my_start}>スキャン</button>
            <button onClick={my_stop}>キャンセル</button>
          </div>
      </div>
      <button onClick={handleManualInput} className="hand">手入力する</button>
      {/* <ManualInput />手入力画面を表示 */}
    </div>
  );

};

export default Scan;/*他のファイルでこのファイルを読み込む(import)ときに好きな名前を付けられる*/