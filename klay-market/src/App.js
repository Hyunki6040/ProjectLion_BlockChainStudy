import logo from './logo.svg';
import Caver from 'caver-js';
import './App.css';


const COUNT_CONTRACT_ADDRESS = '0x806e9E165eA5e16c49a4be0240f87A4691Ee3361';
const ACCESS_KEY_ID = 'KASKQUNUUKKMP4ELRJCRJYPU';
const SECRET_ACCESS_KEY = 'rML5JEad6M8kOOd_9VofClY5pqTaNVmJxl105DBA';

const CHAIN_ID = '1001'; // MAINNET 8217 TESTNET 1001
const COUNT_ABI = '[ { "constant": true, "inputs": [], "name": "count", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getBlockNumber", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_count", "type": "uint256" } ], "name": "setCount", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" } ]';

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
const CountContract = new caver.contract(JSON.parse(COUNT_ABI), COUNT_CONTRACT_ADDRESS);
const readCount = async () => {
	const _count = await CountContract.methods.count().call();
	console.log(_count);
}

const getBalance = (address) => {
	return caver.rpc.klay.getBalance(address).then((respose) => {
		const balance = caver.utils.convertFromPeb(caver.utils.hexToNumberString(respose));
		console.log(`BALANCE: ${balance}`); 
		return balance;
	})
}

const setCount = async (newCount) => {
	// 사용할 account 설정
	try{
		const privatekey = '0x646e24fdef558df6b75b6522af48b4b70510233a46b57c4da119cf05feeb88f9';
		const deployer = caver.wallet.keyring.createFromPrivateKey(privatekey);
		caver.wallet.add(deployer);
		// 스마트 컨트랙트 실행 트랜젝션 날리기
		// 결과 확인

		const receipt = await CountContract.methods.setCount(newCount).send({
			from: deployer.address, // address
			gas: "0x4bfd200"//
		});
		console.log(receipt);
	}catch(e) {
		console.log(`[ERROR_SET_COUNT]${e}`);
	}
	
}
// 1 Smart contract 배포 주소 파악(가져오기)
// 2 caver.js 이용해서 스마트 컨드랙트 연동하기
// 3 가져온 스마트 컨트랙스 실행 결과(데이터) 웹에 표현하기

function App() {
	readCount();
	getBalance('0x85b598e19777db1b2f395c926b91d14fcb83bc53');
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
		  <button title={'카운트 변경'} onCClick={()=>{setCount(90)}} />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
