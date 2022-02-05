import React, {useState} from "react";
import QRCode from "qrcode.react";
import {getBalance} from './api/UseCaver';
import * as KlipAPI from "./api/UseKlip";
import './App.css';


const DEFAULT_QR_CODE = 'DEFAULST'
function App() {
	// State Data
	
	// Global Data(Domain Data)
	// address
	// nft
	const [balance, setBalance] = useState("0");
	
	// UI
	const [qrvalue, setQrvalue] = useState(DEFAULT_QR_CODE);
	// tab
	//mintInput
	
	// Modal
	
	//fetchMarketNFT
	//fetchMyNFTs
	// onClickMint
	// onClickMyCard
	// onClickMarketCard
	
	// getUserData
	// getBalance('0x85b598e19777db1b2f395c926b91d14fcb83bc53');
	const onClickgetAddres = () => {
		KlipAPI.getAddress(setQrvalue);
	};
	
	const onClickSetCount = () => {
		KlipAPI.setCount(2000,setQrvalue);
	};
  return (
    <div className="App">
      <header className="App-header">
		{/* 주소 잔고 */}
		{/* 갤러리(마켓, 내 지갑) */}
		{/* 발행페이지 */}
		{/* 탭 */}
	  	{/* 모달 */}	
		<button onClick={()=>{
				onClickgetAddres();
			  }} 
			  >주소가져오기
		</button>
		<button onClick={()=>{
				onClickSetCount();
			  }} 
			  >카운트 값 변경
		</button>
		<br/><br/><br/><br/>
		<QRCode value={qrvalue} />
      </header>
    </div>
  );
}

export default App;
