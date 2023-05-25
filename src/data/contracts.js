import { toast } from 'react-toastify';
import CallerABI from '../../blockchain/src/truffle_abis/Caller.json';
import NFTABI from './abi/nft.json';
import { CALLER_ADDRESS, NFT_ADDRESS } from './constants';

const Web3 = require('web3');

console.log('NEXT_PUBLIC_BASE_URL: ', process.env.NEXT_PUBLIC_BASE_URL);
// const web3 = new Web3(process.env.NEXT_PUBLIC_GOERLI_URL || 'http://localhost:3000');

export async function loadWeb3() {
	if (window && window.ethereum) {
		window.web3 = new Web3(window.ethereum);
		await window.ethereum.enable();
	} else {
		toast.error('No web3 detected. Falling back to http://localhost:3000. You should remove this fallback when you deploy live');
		console.log('No web3 detected. Falling back to http://localhost:3000. You should remove this fallback when you deploy live');
	}
}

export async function getCurrentAccount() {
	try {
		await loadWeb3();
		console.log('getCurrentAccount');
		const accounts = await window.web3.eth.getAccounts();
		toast.success(`Current Account: ${accounts[0]}`);
		return accounts[0];
	} catch (err) {
		toast.error(`Failed to fetch Current Account`);
		console.log(err);
	}
}

export function _UqUrl() {
	var result = '';
	var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	for (var i = 0; i < 10; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}

// * NFT Minting function
/*
        uint256 _cost,
        uint256 _pid, // 1special | 2-preLaunch| 3-Generic | 4-NonTransferable
        string memory _UqURL,
        string memory _name,
        string memory _description,
        string memory _url,
        string memory _trxnHash,
        address _seller,
        uint256 _validTill
*/

const SAMPLE = {
	cost: 10000,
	pid: 1,
	UqURL: 'https://www.google.com',
	name: 'Default NFT',
	description: 'This is a default NFT',
	url: 'https://www.google.com',
	seller: '0x82b4F2da4b06cD712ccCEEc9f64c0BCfFd3c6147',
	trxnHash: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4',
};

export async function MintNFT(data = SAMPLE) {
	try {
		await loadWeb3();
		let { cost, pid, UqUrl, name, description, url, trxnHash, sellerAddress } = data;
		let validTill = 1616454545;

		const callerAddress = '0xAF1e8d728390eA94ef700D9172FEeEFC34495DD4';
		const account = await getCurrentAccount();
		console.log('account', account);
		const callerContract = new web3.eth.Contract(CallerABI.abi, callerAddress);

		let result = await callerContract.methods
			.createNFT(
				(cost = 1000),
				(pid = 1),
				(UqUrl = 'https://PrashantAmoli.github.io'),
				(name = 'NFT7Feb'),
				(description = 'NFT7Feb'),
				(url = 'https://PrashantAMoli.github.io'),
				(trxnHash = '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4'),
				(sellerAddress = '0x82b4F2da4b06cD712ccCEEc9f64c0BCfFd3c6147'),
				(validTill = 1675769303076)
			)
			.send(
				{
					from: account,
				},
				function (err, result) {
					if (err) {
						console.log('Error');
						console.log(err);
					}
					if (result) {
						console.log('Success', result);
					}
				}
			);
		console.log(cost, pid, UqUrl, name, description, url, trxnHash, sellerAddress, validTill);
		toast.success('Transaction Successfull! NFT minted for this product.');
		return result;
	} catch (error) {
		toast.error('Transaction unsuccessfull! NFT not minted for this product.');
	}

	// const result = await callerContract.methods.mintNFT().send({ from: account }, (err, res) => {
	// 	if (err) {
	// 		console.log('err', err);
	// 	} else {
	// 		console.log('res', res);
	// 	}
	// });
	// console.log('Minted NFT. Transaction: ' + result.transactionHash);
}

export async function viewMyNFTs() {
	try {
		await loadWeb3();
		const contractAddress = NFT_ADDRESS;
		const account = await getCurrentAccount();
		console.log('account', account);
		const nftContract = new web3.eth.Contract(NFTABI.abi, contractAddress);

		let result = await nftContract.methods.viewMyNFTS(account).call(
			{
				from: account,
			},
			(err, res) => {
				if (err) {
					console.log('err', err);
					toast.error(`${JSON.stringify(err)}`);
				} else {
					console.log('res', res);
					toast.success(`NFTs: ${res}`);
				}
			}
		);
		return result;
	} catch (error) {
		console.log('error', error);
		toast.error(`${JSON.stringify(error)}`);
	}
}
export async function viewNFTProp1() {
	try {
		await loadWeb3();
		const contractAddress = NFT_ADDRESS;
		const account = await getCurrentAccount();
		console.log('account', account);
		const nftContract = new web3.eth.Contract(NFTABI.abi, contractAddress);

		let result = await nftContract.methods.viewNFTPropByIndex1(account).call(
			{
				from: account,
			},
			(err, res) => {
				if (err) {
					console.log('err', err);
				} else {
					console.log('res', res);
				}
			}
		);
		result = {
			name: result[0],
			description: result[1],
			url: result[2],
			txnHash: result[3],
			nftType: result[4],
		};
		console.log('result', result);
		return result;
	} catch (error) {
		console.log('error', error);
		toast.error(`${JSON.stringify(error)}`);
	}
}
export async function viewNFTProp2() {
	try {
		await loadWeb3();
		const contractAddress = NFT_ADDRESS;
		const account = await getCurrentAccount();
		console.log('account', account);
		const nftContract = new web3.eth.Contract(NFTABI.abi, contractAddress);

		let result = await nftContract.methods.viewNFTPropByIndex2(account).call(
			{
				from: account,
			},
			(err, res) => {
				if (err) {
					console.log('err', err);
				} else {
					console.log('res', res);
				}
			}
		);
		result = { boughtOn: result[0], sellerAddress: result[1], expiry: result[2], expirable: result[3] };
		console.log('result', result);
		return result;
	} catch (error) {
		console.log('error', error);
		toast.error(`${JSON.stringify(error)}`);
	}
}
