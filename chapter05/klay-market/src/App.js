import React, {useState, useEffect} from "react";
import QRCode from "qrcode.react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faWallet, faPlus } from "@fortawesome/free-solid-svg-icons";
import {getBalance, fetchCardsOf} from './api/UseCaver';
import * as KlipAPI from "./api/UseKlip";
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import "./market.css"
import { Alert, Container, Card, Nav, Button, Form, Modal, Row, Col} from "react-bootstrap";
import { MARKET_CONTRACT_ADDRESS } from "./constants";


const DEFAULT_QR_CODE = 'DEFAULT';
const DEFAULT_ADDRESS = "0x00000000000000000000000000";
function App() {
	// nft
	const [nfts, setNfts] = useState([]); // {tokenId: '101', tokenUri: ""}
	const [myBalance, setMyBalance] = useState("0");
	const [myAddress, setMyAddress] = useState(DEFAULT_ADDRESS);
	
	// UI
	const [qrvalue, setQrvalue] = useState(DEFAULT_QR_CODE);
	const [tab, setTab] = useState("MARKET"); // MARKET, MINT, WALLET
	const [mintImageUrl, setMintImageUrl] = useState("");
	
	// Modal
	const [showModal, setShowModal] = useState(false);
	const [modalProps, setModalProps] = useState({
		title: "MODAL",
		onConfirm: () => {},
		
	});
	const rows = nfts.slice(nfts.length / 2);
	//fetchMarketNFT
	const fetchMarketNFTs = async () => {
		const _nfts = await fetchCardsOf(MARKET_CONTRACT_ADDRESS);
		setNfts(_nfts);
	}
	//fetchMyNFTs
	const fetchMyNFTs = async () => {
		if(myAddress === DEFAULT_ADDRESS){
			alert("NO ADDRESS");
			return;
		}
		const _nfts = await fetchCardsOf(myAddress);
		
		setNfts(_nfts);
		// [{id:100, uri: "https://~~.png}, {id:100, uri: "https://~~.jpg}]
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
		if(myAddress === DEFAULT_ADDRESS){
			alert("NO ADDRESS");
			return;
		}
		const randomTokenId = parseInt(Math.random() * 100000000);
		KlipAPI.mintCardWithURI(
			myAddress, randomTokenId, uri, setQrvalue, (result) => {
				alert(JSON.stringify(result));
		})
	}
	const onClickCard = (id) => {
		
		if (tab === 'WALLET'){
			setModalProps({
				title: "NTF를 마켓에 올리시겠습니까?",
				onConfirm: () => {
					onClickMyCard(id);	
				}
			});
			setShowModal(true);
			
		}
		if (tab === 'MARKET'){
			setModalProps({
				title: "NTF를 구매하겠습니까?",
				onConfirm: () => {
					onClickMarketCard(id);	
				}
			});
			setShowModal(true);
			
		}
	}
	const onClickMyCard = (tokenId) => {
		KlipAPI.listingCard(myAddress, tokenId, setQrvalue, (result) =>{
			alert(JSON.stringify(result));
		});
	}
	const onClickMarketCard = (tokenId) => {
		KlipAPI.buyCard(tokenId, setQrvalue, (result) =>{
			alert(JSON.stringify(result));
		});
	}
	// onClickMyCard
	// onClickMarketCard
	
	// getUserData
	const getUserData = () => {
		setModalProps({
			title: "Klip 지갑을 연결하시겠습니까?",
			onConfirm: () => {
				KlipAPI.getAddress(setQrvalue, async (address) => {
					setMyAddress(address);
					const _balance = await getBalance(address);
					setMyBalance(_balance);
				});
			}
		});
		setShowModal(true);
	};
	
	useEffect(() => {
		getUserData();
		fetchMarketNFTs();
   	}, [])
  return (
    <div className="App">
		<div style={{backgroundColor: "black", padding: 10}}>
			{/* 주소 잔고 */}
			<div style={{fontSize:30, fontWeight: "bold", paddingLeft:5, marginTop:10}}>내 지갑</div>
			{myAddress}
			<br/>
			<Alert 
				onClick={getUserData}
				variant={"balance"} style={{backgroundColor:"skyblue", fontSize: 25 }}>
				{myAddress !== DEFAULT_ADDRESS ? `${myBalance} KLAY` : "지갑 연동하기"}
				
			</Alert>
			{qrvalue !== 'DEFAULT' ? (
			<Container style={{backgroundColor:'white', width:300, height:300, padding:20}}>
				<QRCode value={qrvalue} size={256} style={{ margin: "auto"}}/>
			</Container>
			): null}
			<br/><br/>
			{/* 갤러리(마켓, 내 지갑) */}
			{tab === "MARKET" || tab === "WALLET" ? (
				<div className="container" style={{padding:0, width:"100%"}}>
					{rows.map((o, rowIndex) => (
						<Row>
							<Col style={{marginRight: 0, paddingRight:0}}>
								<Card onClick={() => {
										onClickCard(nfts[rowIndex * 2].id);
								}}>
									<Card.Img src={nfts[rowIndex * 2].uri} />
								</Card>
								[{nfts[rowIndex * 2].id}]NFT
							</Col>
							<Col style={{marginRight: 0, paddingRight:0}}>
								{nfts.length > rowIndex * 2 + 1 ? (
										<Card onClick={() => {
												onClickCard(nfts[rowIndex * 2 + 1].id);
										}}>
											<Card.Img src={nfts[rowIndex * 2 + 1].uri} />
										</Card>	
									): null}
								{nfts.length > rowIndex * 2 + 1 ? (<>[{nfts[rowIndex * 2 + 1].id}]NFT</>) : null}
									
								
							</Col>
						</Row>
					))}
					{/*<Card>
						{nfts.map((nft, index) => (
							<Card.Img 
								key={`imagekey${index}`}
								onClick={()=>{
									onClickCard(nft.id)
								}} 
								className="img-responsive" 
								src={nfts[index].uri} 
								height={"15%"}
								/>
						)
						)}
					</Card>*/}

				</div>	
			) : null}
			{/* 발행페이지 */}
			{tab === "MINT" ? 
				<div className="container" style={{padding:0, width:"100%"}}>
					<Card className="text-center" style={{color:"black", height:"50%", borderColor:"#C5B358"}}>
						<Card.Body style={{oppacity: 0.9, backgroundColor:"black"}}>
							{mintImageUrl !== "" ? (
								<Card.Img  src={mintImageUrl} height={"30%"} />
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
		<br/><br/><br/><br/><br/><br/><br/>
		{/* 모달 */}	
		<Modal
		centered
		size="sm"
		show={showModal}
		onHide={() => {
			setShowModal(false);	  
  		}}>
			<Modal.Header style={{border:0, backgroundColor: "black", opacity: 0.8}}>
			<Modal.Title>{modalProps.title}</Modal.Title>
			</Modal.Header>
			<Modal.Footer style={{border: 0, backgroundColor:"black", opacity: 0.8}}>
				<Button variant="primary"
					onClick={() => {
						modalProps.onConfirm();
						setShowModal(false);
					}}
					style={{ backgroundColor: "cadetblue", borderColor: "cadetblue"}}
				>진행</Button>
				<Button
					variant="secondray"
					onClick={() => {
						setShowModal(false);
					}}
					>닫기</Button>
			</Modal.Footer>
		</Modal>
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
						<div><FontAwesomeIcon color="white" size="lg" icon={faHome}/></div>
					</div>
					<div onClick={()=>{
							setTab("MINT");
						}}
						className = "row d-flex flex-column justify-content-center align-items-center"
						>
						<div><FontAwesomeIcon color="white" size="lg" icon={faPlus}/></div>
					</div>
					<div onClick={()=>{
							setTab("WALLET");
							fetchMyNFTs();
						}}
						className = "row d-flex flex-column justify-content-center align-items-center"
						>
						<div><FontAwesomeIcon color="white" size="lg" icon={faWallet}/></div>
					</div>
				</div>
			</Nav>
		  </nav>
    </div>
  );
}

export default App;
