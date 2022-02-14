import axios from "axios";
import { NFT_CONTRACT_ADDRESS } from "../constants/index";

const A2P_API_PREPAR_URL = "https://a2a-api.klipwallet.com/v2/a2a/prepare";
const APP_NAME = "KLAY_MARKET";

export const mintCardWithURI = async (toAddress, tokenId, uri, setQrvalue, callback) =>{
	const functionJSON = '{ "constant": false, "inputs": [ { "name": "to", "type": "address" }, { "name": "tokenId", "type": "uint256" }, { "name": "tokenURI", "type": "string" } ], "name": "mintWithTokenURI", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }';
	executeContract(NFT_CONTRACT_ADDRESS, functionJSON, "0", `["${toAddress}","${tokenId}","${uri}"]`, setQrvalue, callback);
};

export const executeContract = (txTo, functionJSON, value, params, setQrvalue, callback) => {
	axios.post(
		A2P_API_PREPAR_URL,{
			bapp: {
				name: APP_NAME
			},
			type: "execute_contract",
			transaction: {
				to: txTo,
				abi: functionJSON,
				value: value,
				params: params
			}
		}
	).then((response) => {
		const {request_key} = response.data;
		const qrcode = `https://klipwallet.com/?target=/a2a?request_key=${request_key}`;
		setQrvalue(qrcode);
		
		let timerId = setInterval(() => {
			axios.get(`https://a2a-api.klipwallet.com/v2/a2a/result?request_key=${request_key}`).then((res) => {
				if (res.data.result) {
					console.log(`[Result] (${JSON.stringify(res.data.result)}`);
					callback(res.data.result);
					if(res.data.result.status === 'sccess'){
						clearInterval(timerId);
					}
				}
			});
		}, 1000)
	});
};


export const getAddress = (setQrvalue, callback) => {
	axios.post(
		A2P_API_PREPAR_URL,{
			bapp: {
				name: APP_NAME
			},
			type: "auth"
		}
	).then((response) => {
		const {request_key} = response.data;
		const qrcode = `https://klipwallet.com/?target=/a2a?request_key=${request_key}`;
		setQrvalue(qrcode);
		
		let timerId = setInterval(() => {
			axios.get(`https://a2a-api.klipwallet.com/v2/a2a/result?request_key=${request_key}`).then((res) => {
				if (res.data.result) {
					console.log(`[Result] (${JSON.stringify(res.data.result)}`);
					callback(res.data.result.klaytn_address);
					clearInterval(timerId);
				}
			});
		}, 1000)
	})
}

// export const setCount = (count, setQrvalue) => {
// 	axios.post(
// 		A2P_API_PREPAR_URL,{
// 			bapp: {
// 				name: APP_NAME
// 			},
// 			type: "execute_contract",
// 			transaction: {
// 				to: COUNT_CONTRACT_ADDRESS,
// 				abi: '{ "constant": false, "inputs": [ { "name": "_count", "type": "uint256" } ], "name": "setCount", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }',
// 				value: "0",
// 				params: `["${count}"]`
// 			}
// 		}
// 	).then((response) => {
// 		const {request_key} = response.data;
// 		const qrcode = `https://klipwallet.com/?target=/a2a?request_key=${request_key}`;
// 		setQrvalue(qrcode);
		
// 		let timerId = setInterval(() => {
// 			axios.get(`https://a2a-api.klipwallet.com/v2/a2a/result?request_key=${request_key}`).then((res) => {
// 				if (res.data.result) {
// 					console.log(`[Result] (${JSON.stringify(res.data.result)}`);
// 					if(res.data.result.status === 'sccess'){
// 						clearInterval(timerId);
// 					}
// 				}
// 			});
// 		}, 1000)
// 	});
// }