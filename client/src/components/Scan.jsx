import "../scan.css"
import React, { useRef, useState } from 'react';
import Quagga from 'quagga';
import { useNavigate } from "react-router-dom";
import { Button } from "@heroui/react";

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

  //jancode20個から一番多いjancodeを見つけるためにcode.jsに送る関数
  const sendCodesToServer = (codes) => {
    console.log("sendCodes:", codes);
    fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/code`, {
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
          sendJanToServer(jancode);/*商品情報を得て、登録画面に遷移する関数*/
        } else {
          alert('JANCODEが見つかりませんでした。\n「手入力する」を選択して登録してください。');
          console.error("コード処理エラー");
        }
      })
      .catch((err) => console.error(err));
  };

  //jancodeを元にJANCODELOOKUPAPIからデータを得るためにjan.jsにデータを送り、Scanfinish.jsxへ遷移する関数
  const sendJanToServer = (input) => {
    fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/jan`, {
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

  // カメラをストップする関数
  const my_stop = () => {
    console.log("ストップ");
    Quagga.stop();
  };
  
  const handleManualInput = () => {
    navigate('/ManualInput');
  };

  return (
    <div>
      <div className="w-max h-max justify-center mx-auto mt-2 bg-gray-100 shadow-md  rounded-md">
        <div className="text-center text-3xl p-3">バーコードを映してください</div>
        <div className="flex justify-center items-center">
          <div className="m-2 mx-auto" id="my_quagga"/>
        </div>
        <div className="flex flex-col items-center">
          <Button color="success"onPress={my_start} size="lg" fullWidth="true" className="mt-3 text-white"> スキャン </Button>
          <Button color="default" onPress={my_stop} size="lg" fullWidth="true" className="mt-3 mb-3 ">キャンセル</Button>
        </div>
      </div>
      <button onClick={handleManualInput} className="hand mx-auto mt-3 text-blue-500 text-lg">手入力する</button>
      {/* <ManualInput />手入力画面を表示 */}
      <div style={{ position: 'absolute', bottom: 120, width: '100%', textAlign: 'center' }}>
        <a href="https://www.jancodelookup.com/" target="_blank" rel="noopener noreferrer">
          Web Services by JANCODE LOOKUP
        </a>
      </div>
    </div>

  );

};

export default Scan;
