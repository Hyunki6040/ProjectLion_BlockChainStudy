import Caver from 'caver-js';
import KIP17ABI from '../abi/KIP17TokenABI.json';
import {ACCESS_KEY_ID, SECRET_ACCESS_KEY, NFT_CONTRACT_ADDRESS, MARKET_CONTRACT_ADDRESS, CHAIN_ID} from '../constants';

const option = {
	headers: [
		{
			name: "Authorization",
			value: "Basic " + Buffer.from(ACCESS_KEY_ID + ":" + SECRET_ACCESS_KEY).toString("base64")
		},
		{
			name: "x-chain-id", value: CHAIN_ID
		}
	]
}

const caver = new Caver(new Caver.providers.HttpProvider("https://node-api.klaytnapi.com/v1/klaytn", option));
const NFTContract = new caver.contract(KIP17ABI,NFT_CONTRACT_ADDRESS);


export const fetchCardsOf = async (address) => {
	// Fetch getBalance
	const balance = await NFTContract.methods.balanceOf(address).call();
	console.log(`[NFT Balance] ${balance}`);
	// Fetch Token IDs
	const tokenIds = [];
	for(let i =0; i<balance; i++){
		const id = await NFTContract.methods.tokenOfOwnerByIndex(address, i).call();
		tokenIds.push(id);
	}
	
	// Fetch Token URIs
	const tokenUris = [];
	for(let i =0; i<balance; i++){
		const uri = await NFTContract.methods.tokenURI(tokenIds[i]).call();
		tokenUris.push(uri);
	}
	
	const nfts = [];
	for(let i =0; i<balance; i++){
		nfts.push({uri: tokenUris[i], id: tokenIds[i] });
	}
	console.log(nfts);
	return nfts;
}

export const getBalance = (address) => {
	return caver.rpc.klay.getBalance(address).then((respose) => {
		const balance = caver.utils.convertFromPeb(caver.utils.hexToNumberString(respose));
		console.log(`BALANCE: ${balance}`); 
		return balance;
	})
}
