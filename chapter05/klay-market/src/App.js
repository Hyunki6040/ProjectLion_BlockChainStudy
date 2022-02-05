import React, {useState} from "react";
import QRCode from "qrcode.react";
import {getBalance, fetchCardsOf} from './api/UseCaver';
import * as KlipAPI from "./api/UseKlip";
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import "./market.css"
import { Alert, Container, Card } from "react-bootstrap";
import { MARKET_CONTRACT_ADDRESS } from "./constants";


const DEFAULT_QR_CODE = 'DEFAULT';
const DEFAULT_ADDRESS = "0x00000000000000000000000000";
function App() {
	// State Data
	
	// Global Data(Domain Data)
	// address
	// nft
	const [nfts, setNfts] = useState([]); // {tokenId: '101', tokenUri: ""}
	const [myBalance, setMyBalance] = useState("0");
	const [myAddress, setMyAddress] = useState(DEFAULT_ADDRESS);
	
	// UI
	const [qrvalue, setQrvalue] = useState(DEFAULT_QR_CODE);
	// tab
	//mintInput
	
	// Modal
	
	//fetchMarketNFT
	const fetchMarketNFTs = async () => {
		const _nfts = await fetchCardsOf(MARKET_CONTRACT_ADDRESS);
		setNfts(_nfts);
	}
	//fetchMyNFTs
	const fetchMyNFTs = async () => {
		const _nfts = await fetchCardsOf(myAddress);
		setNfts(_nfts);
		// [{tokenId:100, tokenUri: "https://~~.png}, {tokenId:100, tokenUri: "https://~~.jpg}]
		// balanceOf -> 내가 가진 전체 NFT 토큰 개수를 가져온다
		// tokenOfOwnerByIndex -> 내가 가진 NFT token Id를 하나씩 가져온다 -> 배열로
		// 주소, 0 -> 100
		// 주소, 1 -> 101
		// tokenURI -> 앞에서 가져온 tokenId를 이요해서 tokenURI를 하나씩 가져온다.
		// 100 -> ~~.png
		// 101 -> ~~.jpg
	}
	// onClickMint
	// onClickMyCard
	// onClickMarketCard
	
	// getUserData
	const getUserData = () => {
		KlipAPI.getAddress(setQrvalue, async (address) => {
			setMyAddress(address);
			const _balance = await getBalance(address);
			setMyBalance(_balance);
		});
	};
  return (
    <div className="App">
		<div style={{backgroundColor: "black", padding: 10}}>
			<div style={{fontSize:30, fontWeight: "bold", paddingLeft:5, marginTop:10}}>내 지갑</div>
			{myAddress}
			<br/>
			<Alert 
				onClick={getUserData}
				variant={"balance"} style={{backgroundColor:"skyblue", fontSize: 25 }}>{myBalance}</Alert>
			
			{/* 갤러리(마켓, 내 지갑) */}
			
			<div className="container" style={{padding:0, width:"100%"}}>
				<Card>
					{nfts.map((nft, index) => (
						<Card.Img className="img-responsive" src={nfts[index].uri} />
					)
					)}
				</Card>
				
			</div>
	  	</div>
		{/* 주소 잔고 */}
  		<Container style={{backgroundColor:'white', width:300, height:300, padding:20}}>
			<QRCode value={qrvalue} size={256} style={{ margin: "auto"}}/>	
	  	</Container>
	  	<button onClick={fetchMyNFTs}>
	  		NFT 가져오기
		  </button>
		
		{/* 발행페이지 */}
		{/* 탭 */}
		{/* 모달 */}	
    </div>
  );
}

export default App;
