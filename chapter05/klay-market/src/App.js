import React, {useState} from "react";
import QRCode from "qrcode.react";
import {getBalance, fetchCardsOf} from './api/UseCaver';
import * as KlipAPI from "./api/UseKlip";
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import "./market.css"
import { Alert, Container, Card, Nav, Button, Form} from "react-bootstrap";
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
	const [tab, setTab] = useState("MARKET"); // MARKET, MINT, WALLET
	const [mintImageUrl, setMintImageUrl] = useState("");
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
	const onClickMint = async (uri) => {
		if(myAddress === DEFAULT_ADDRESS) alert("NO ADDRESS");
		const randomTokenId = parseInt(Math.random() * 100000000);
		KlipAPI.mintCardWithURI(
			myAddress, randomTokenId, uri, setQrvalue, (result) => {
				alert(JSON.stringify(result));
		})
	}
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
			{/* 주소 잔고 */}
			<div style={{fontSize:30, fontWeight: "bold", paddingLeft:5, marginTop:10}}>내 지갑</div>
			{myAddress}
			<br/>
			<Alert 
				onClick={getUserData}
				variant={"balance"} style={{backgroundColor:"skyblue", fontSize: 25 }}>{myBalance}</Alert>
			
			<Container style={{backgroundColor:'white', width:300, height:300, padding:20}}>
				<QRCode value={qrvalue} size={256} style={{ margin: "auto"}}/>	
			</Container>
			<br/><br/>
			{/* 갤러리(마켓, 내 지갑) */}
			{tab === "MARKET" || tab === "WALLET" ? (
				<div className="container" style={{padding:0, width:"100%"}}>
					<Card>
						{nfts.map((nft, index) => (
							<Card.Img className="img-responsive" src={nfts[index].uri} />
						)
						)}
					</Card>

				</div>	
			) : null}
			{/* 발행페이지 */}
			{tab === "MINT" ? 
				<div className="container" style={{padding:0, width:"100%"}}>
					<Card className="text-center" style={{color:"black", height:"50%", borderColor:"#C5B358"}}>
						<Card.Body style={{oppacity: 0.9, backgroundColor:"black"}}>
							{mintImageUrl !== "" ? (
								<Card.Img src={mintImageUrl} height={"50%"} />
							) : null}
							<Form>
								<Form.Group>
									<Form.Control 
									value={mintImageUrl}
									onChange={(e)=> {
										console.log(e.target.value);
										setMintImageUrl(e.target.value);
									}}
									type="text"
										placeholder="이미지 주소를 입력해주세요"
									/>
								</Form.Group>
								<br/>
								<Button
									onClick={() => {
										onClickMint(mintImageUrl);
									}}
									variant="primary" style={{backgroundColor:"cadetblue", borderColor:"cadetblue"}}>발행하기</Button>
							</Form>
						</Card.Body>
					</Card>
			 </div>
				: null}
	  	</div>
	  	<button onClick={fetchMyNFTs}>
	  		NFT 가져오기
		  </button>
		
		{/* 모달 */}	
	  	{/* 탭 */}
		<nav style={{backgroundColor: "#1b1717", height: 45}}
			className="navbar fixed-bottom navbar-light" 
			role="navigation">
	  		<Nav className="w-100">
				<div className="d-flex flex-row justify-content-around w-100">
					<div 
						onClick={()=>{
							setTab("MARKET");
							fetchMarketNFTs();
						}}
						className = "row d-flex flex-column justify-content-center align-items-center"
						>
						<div>MARKET</div>
					</div>
					<div onClick={()=>{
							setTab("MINT");
							fetchMarketNFTs();
						}}
						className = "row d-flex flex-column justify-content-center align-items-center"
						>
						<div>MINT</div>
					</div>
					<div onClick={()=>{
							setTab("WALLET");
							fetchMarketNFTs();
						}}
						className = "row d-flex flex-column justify-content-center align-items-center"
						>
						<div>WALLET</div>
					</div>
				</div>
			</Nav>
		  </nav>
    </div>
  );
}

export default App;
