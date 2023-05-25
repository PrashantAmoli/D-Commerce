import TransactionCard from '@/components/views/TransactionCard';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { set } from 'date-fns';
import MyDisclosure from '@/components/ui/MyDisclosure';
import { Tab } from '@headlessui/react';
import { useSelector } from 'react-redux';
import { viewMyNFTs, viewNFTProp1, viewNFTProp2 } from '@/data/contracts';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { generateSVG64 } from '@/utils/tokens/token';

export default function Transactions() {
	const [normalTxn, setNormalTxn] = useState({});
	const [internalTxn, setInternalTxn] = useState({});
	const [blocksMined, setBlocksMined] = useState({});
	const [myNFTs, setMyNFTs] = useState({});
	const [TokenId, setTokenId] = useState('0');
	const [NFTData, setNFTData] = useState({});
	const address = useSelector(state => state.appData.address) || '0x82b4F2da4b06cD712ccCEEc9f64c0BCfFd3c6147';

	async function getData() {
		// if (address) {
		// 	// Balance
		// 	const res = await axios.get(
		// 		`https://api-goerli.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY}}`
		// 	);
		// 	console.log(res.data);
		// }
		if (address) {
			const loadingToast = toast.info('Fetching Data for Address: ' + address);
			// toast.update(loadingToast, { render: 'Fetching NFTs...', type: 'info', isLoading: true, autoClose: 5000, draggable: true });
			// Normal Transactions
			const res = await axios.get(
				`https://api-goerli.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY}`
			);
			console.log(res?.data);
			setNormalTxn({ ...res.data });
		}
		if (address) {
			// Internal Transactions
			const res = await axios.get(
				`https://api-goerli.etherscan.io/api?module=account&action=txlistinternal&address=${address}&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY}`
			);
			console.log('Internal: ', res.data);
			setInternalTxn({ ...res.data });
		}
		if (address) {
			// Blocks Mined
			const res = await axios.get(
				`https://api-goerli.etherscan.io/api?module=account&action=getminedblocks&address=${address}&blocktype=blocks&page=1&offset=10&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY}`
			);
			console.log('Internal: ', res.data);
			setBlocksMined({ ...res.data });
		}
	}

	const getMyNFTs = async () => {
		try {
			const loadingToast = toast.info('Fetching NFTs...');
			// toast.update(loadingToast, { render: 'Fetching NFTs...', type: 'info', isLoading: true, autoClose: 6000, draggable: true });
			const res = await viewMyNFTs();
			console.log(res);
			setMyNFTs({ ...res });
		} catch (error) {
			console.log(error);
			toast.error(error.message);
		}
	};

	const getNFTProps = async token => {
		try {
			const res1 = await viewNFTProp1(token);
			const res2 = await viewNFTProp2(token);
			console.log(res1, res2);
			const date = new Date(parseInt(res2.boughtOn));
			const year = date.getFullYear();
			const month = date.getMonth() + 1; // Month is zero-based, so we add 1
			const day = date.getDate();

			console.log('Year:', year);
			console.log('Month:', month);
			console.log('Day:', day);
			setNFTData({ ...res1, ...res2, year, month, day });
		} catch (error) {
			console.log(error);
			toast.error(error.message);
		}
	};

	useEffect(() => {
		getData();
	}, []);

	return (
		<main className="flex flex-col px-2 py-5 sm:px-28 min-h-screen">
			<Tab.Group>
				<Tab.List className="flex sm:justify-center gap-2 sm:gap-6 w-full py-4 flex-wrap">
					<Tab className="text-primary rounded-3xl bg-gray-200/50 backdrop-blur-md px-3 py-1 transition-all hover:scale-105">Normal Transactions</Tab>
					<Tab className="text-primary rounded-3xl bg-gray-200/50 backdrop-blur-md px-3 py-1 transition-all hover:scale-105">
						Internal Transactions
					</Tab>
					<Tab className="text-primary rounded-3xl bg-gray-200/50 backdrop-blur-md px-3 py-1 transition-all hover:scale-105">Blocks Mined</Tab>
					<Tab className="text-primary rounded-3xl bg-gray-200/50 backdrop-blur-md px-3 py-1 transition-all hover:scale-105">NFTs</Tab>
				</Tab.List>

				<Tab.Panels>
					<Tab.Panel>
						<section className="flex flex-col gap-4">
							<h2 className="text-primary font-bold text-lg">Normal Transactions</h2>
							{normalTxn.status === '1' &&
								normalTxn.result.map((txn, index) => {
									const time = new Date(txn.timeStamp * 1000);
									return (
										<MyDisclosure key={index} heading={`${time}`}>
											<TransactionCard txn={txn} time={`${time}`} />

											<MyDisclosure heading={`Raw Data		`}>
												<div className="flex flex-col gap-2 py-4 backdrop-blur-md rounded-md" key={index}>
													<p className="text-primary">Time: {`${time}`}</p>
													<p className="text-primary">Hash: {txn.hash}</p>
													<p className="text-primary">From: {txn.from}</p>
													<p className="text-primary">To: {txn.to}</p>
													<p className="text-primary">Value: {txn.value}</p>
													<p className="text-primary">Gas: {txn.gas}</p>
													<p className="text-primary">Gas Price: {txn.gasPrice}</p>
													<p className="text-primary">Gas Used: {txn.gasUsed}</p>
													<p className="text-primary">Time: {txn.timeStamp}</p>
													{/* <p className="text-primary">Time: {new Date(txn.timeStamp * 1000)}</p> */}
												</div>
											</MyDisclosure>
										</MyDisclosure>
									);
								})}
							<MyDisclosure heading="JSON Data">
								<p className="break-all">{JSON.stringify(normalTxn)}</p>
							</MyDisclosure>
						</section>
					</Tab.Panel>

					<Tab.Panel>
						<section className="flex flex-col gap-2">
							<h2 className="text-primary font-bold text-lg">Internal Transactions</h2>

							<MyDisclosure heading="JSON Data">
								<p className="break-all">{JSON.stringify(internalTxn)}</p>
							</MyDisclosure>
						</section>
					</Tab.Panel>

					<Tab.Panel>
						<section className="flex flex-col gap-2">
							<h2 className="text-primary font-bold text-lg">Blocks Mined</h2>

							<MyDisclosure heading="JSON Data">
								<p className="break-all">{JSON.stringify(blocksMined)}</p>
							</MyDisclosure>
						</section>
					</Tab.Panel>

					<Tab.Panel>
						<section className="flex flex-col gap-4">
							<h2 className="text-primary font-bold text-lg">My NFTs</h2>

							<button className="btn btn-ghost" onClick={getMyNFTs}>
								viewMyNFTS
							</button>

							<MyDisclosure heading="My NFTS">
								<div className="flex flex-col gap-1 px-5">
									{myNFTs &&
										myNFTs?.nfts?.length > 0 &&
										myNFTs?.nfts?.map((nft, index) => {
											return (
												<MyDisclosure
													heading={`NFT Token ID: ${nft}`}
													key={index}
													onClick={async e => {
														e.preventDefault();

														try {
															getNFTProps(nft);
														} catch (error) {
															console.log(error);
															toast.error(error.message);
														}
													}}
												>
													{NFTData && NFTData.name && NFTData.txnHash && NFTData.boughtOn && (
														<>
															<Image
																src={generateSVG64(nft, NFTData.year, NFTData.month, NFTData.day, parseInt(NFTData.nftType) + 4, NFTData.name)}
																alt="NFT Image"
																width={250}
																height={280}
																className="mx-auto shadow-lg hover:shadow-2xl hover:scale-105 rounded-xl my-4 transition-all"
															/>

															<div className="flex flex-col gap-1 my-4">
																<p className="text-primary">Name: {NFTData.name}</p>
																<p className="text-primary">Token ID: {nft}</p>
																<p className="text-primary">Type: {NFTData.nftType}</p>
																<p className="text-primary">
																	Bought On: {NFTData.day}-{NFTData.month}-{NFTData.year} ({NFTData.boughtOn})
																</p>
																<p className="text-primary">Bought For: {NFTData.sellerAddress}</p>
																<p className="text-primary">Txn Hash: {NFTData.txnHash}</p>
																<p className="text-primary">Expiry: {NFTData.expiry}</p>
																<p className="text-primary">URL: {NFTData.url}</p>
															</div>
														</>
													)}
												</MyDisclosure>
											);
										})}

									<MyDisclosure heading="My NFTS JSON Data">
										<p className="break-all">{JSON.stringify(myNFTs)}</p>
									</MyDisclosure>
								</div>
							</MyDisclosure>

							<MyDisclosure heading="NFT Data">
								<form className="flex flex-col">
									<label htmlFor="TokenId">TokenId</label>
									<input
										type="text"
										name="TokenId"
										id="TokenId"
										value={TokenId}
										className="bg-black/5 backdrop-blur-md rounded-md text-primary"
										onChange={e => {
											setTokenId(e.target.value);
										}}
									/>
									<button
										className="btn btn-ghost"
										onClick={async e => {
											e.preventDefault();
											try {
												getNFTProps(TokenId);
											} catch (error) {
												console.log(error);
												toast.error(error.message);
											}
										}}
									>
										Get NFT Props by Token ID
									</button>
								</form>

								{TokenId && NFTData && NFTData.name && NFTData.txnHash && NFTData.boughtOn && (
									<Image
										src={generateSVG64(TokenId, NFTData.year, NFTData.month, NFTData.day, parseInt(NFTData.nftType) + 4, NFTData.name)}
										alt="NFT Image"
										width={250}
										height={280}
										className="mx-auto shadow-lg hover:shadow-2xl hover:scale-105 rounded-xl my-4 transition-all"
									/>
								)}

								<p className="break-all">{JSON.stringify(NFTData)}</p>
							</MyDisclosure>
						</section>
					</Tab.Panel>
				</Tab.Panels>
			</Tab.Group>
		</main>
	);
}
