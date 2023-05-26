import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, SunIcon, MoonIcon, WalletIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { getCurrentAccount } from '@/data/contracts';
import { useEffect } from 'react';
import { setAddress } from '@/redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';

// * Component Source: https://tailwindui.com/components/

const navigation = [
	{ name: 'Home', href: '/' },
	{ name: 'Transactions', href: '/transactions' },
	{ name: 'Voting', href: '/voting' },
	{ name: 'Products', href: '/products' },
	{ name: 'Token', href: '/token' },
	{ name: 'Others', href: '/others' },
];
// { name: 'About', href: '/about' },

export default function Navbar() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	const [balance, setBalance] = useState({});

	const dispatch = useDispatch();
	const address = useSelector(state => state.appData.address);

	const { theme, setTheme } = useTheme();

	const getAddress = async () => {
		const address = await getCurrentAccount();
		console.log(address);
		if (address.length > 25) dispatch(setAddress(address));
		else dispatch(setAddress(''));
	};

	useEffect(() => {
		async function getBalance() {
			const res = await axios.get(`https://api-goerli.etherscan.io/api
			?module=account
			&action=balance
			&address=${address || '0xa65760c16a47bb1c7d5373d9d18736084e2d3f66'}
			&tag=latest
			&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY}`);

			setBalance({ ...res.data });
		}

		console.log('address', address);
		if (address && address.length > 25) {
			getBalance();
			toast.info(`Connected: ${address}`);
		}
	}, [address]);

	const toggleTheme = () => {
		setTheme(theme === 'light' ? 'dark' : 'light');
	};

	return (
		<>
			<div className="isolate select-none fixed inset-x-0 top-0 z-10 shadow-2xl">
				{/* <div className="absolute inset-x-0 top-[-10rem] -z-50 transform-gpu overflow-hidden blur-2xl sm:top-[-10rem]">
					<svg
						className="relative left-[calc(50%-11rem)] -z-50 h-[21.1875rem] max-w-none -translate-x-1/2 rotate-[30deg] sm:left-[calc(50%-30rem)] sm:h-[42.375rem]"
						viewBox="0 0 1155 678"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							fill="url(#45de2b6b-92d5-4d68-a6a0-9b9b2abad533)"
							fillOpacity=".3"
							d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z"
						/>
						<defs>
							<linearGradient
								id="45de2b6b-92d5-4d68-a6a0-9b9b2abad533"
								x1="1155.49"
								x2="-78.208"
								y1=".177"
								y2="474.645"
								gradientUnits="userSpaceOnUse"
							>
								<stop stopColor="#9089FC" />
								<stop offset={1} stopColor="#FF80B5" />
							</linearGradient>
						</defs>
					</svg>
				</div> */}

				{/* <div className="px-6 py-4 lg:px-8 z-50 shadow-md hover:shadow-lg bg-gradient-to-r from-gray-200 via-transparent to-gray-200 dark:from-gray-900 dark:via-gray-600 dark:to-black select-none"> */}
				<div className="px-6 py-3 lg:px-8 z-50 shadow-md hover:shadow-lg bg-gradient-to-r from-gray-200/20 via-transparent to-gray-200/20 dark:from-gray-900/20 dark:via-gray-600/20 dark:to-black/20 backdrop-blur select-none">
					<div>
						{theme === 'dark' ? (
							<SunIcon className="absolute h-8 w-8 hover:scale-105 text-yellow-500 top-5 right-16 sm:right-20 z-50" onClick={toggleTheme} />
						) : (
							<MoonIcon className="absolute h-7 w-7 hover:scale-105 fill-white top-5 right-16 sm:right-20 z-50" onClick={toggleTheme} />
						)}

						{address === '' ? (
							<button
								onClick={getAddress}
								className="absolute right-28 sm:right-36 rounded-lg px-2 py-1.5 text-sm font-semibold leading-6 text-gray-900 shadow-sm ring-1 ring-gray-900/10 hover:ring-gray-900/20 dark:ring-gray-100 dark:hover:ring-gray-200 dark:text-white z-10"
							>
								<WalletIcon className="h-5 w-5 inline-block" /> Connect
							</button>
						) : (
							<button
								disabled
								className="absolute right-28 sm:right-36 rounded-lg px-2 py-1.5 text-sm font-semibold leading-6 text-gray-900 shadow-sm ring-1 ring-gray-900/10 hover:ring-gray-900/20 dark:ring-gray-100 dark:hover:ring-gray-200 dark:text-white z-10 overflow-hidden"
							>
								<div className="flex items-center gap-1">
									<WalletIcon className="h-5 w-5 inline-block" />

									<div className="flex flex-col max-w-[3rem] sm:max-w-[5rem]">
										<span className="text-xs truncate">{address}</span>
										<span className="text-xs truncate">.{balance?.result}</span>
									</div>
								</div>
							</button>
						)}

						<nav className="flex h-9 items-center justify-between" aria-label="Global">
							<div className="flex lg:min-w-0 lg:flex-1 cursor-pointer" aria-label="Global">
								<Link href="/" className="-m-1.5 p-1.5">
									<span className="sr-only">Media Player</span>
									<Image src="/token.svg" alt="logo" width={50} height={50} priority />
								</Link>
							</div>
							<div className="flex lg:hidden">
								<button
									type="button"
									className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-gray-50"
									onClick={() => setMobileMenuOpen(true)}
								>
									<span className="sr-only">Open main menu</span>
									<Bars3Icon className="h-6 w-6" aria-hidden="true" />
								</button>
							</div>

							{/* Navigation Links */}
							<div className="hidden lg:flex lg:min-w-0 lg:flex-1 lg:justify-center lg:gap-x-12">
								{navigation.map(item => (
									<Link key={item.name} href={item.href} className="font-semibold text-gray-900 dark:text-white hover:text-gray-900 z-10">
										{item.name}
									</Link>
								))}
							</div>

							{/* Login Button */}
							<div className="hidden lg:flex lg:min-w-0 lg:flex-1 lg:justify-end">
								{/* <Link
								href="/"
								className="inline-block rounded-lg px-3 py-1.5 text-sm font-semibold leading-6 text-gray-900 shadow-sm ring-1 ring-gray-900/10 hover:ring-gray-900/20 z-10"
							>
								<WalletIcon className="h-5 w-5 inline-block" /> Connect
							</Link> */}
							</div>
						</nav>

						{/* Mobile Responsive Menu : source:tailwindui.com/components/ */}
						<Dialog as="div" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
							<Dialog.Panel focus="true" className="fixed inset-0 z-40 overflow-y-auto backdrop-blur-lg px-6 py-6 lg:hidden">
								<div className="flex h-9 items-center justify-between">
									<div className="flex">
										<Link href="/" className="-m-1.5 p-1.5">
											<span className="sr-only">Your D-Commerce</span>
											<img className="h-8" src="https://tailwindui.com/img/logos/mark.svg" alt="" />
											{/* <Image src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="logo" width={50} height={50} priority /> */}
										</Link>
									</div>
									<div className="flex">
										<button
											type="button"
											className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-white"
											onClick={() => setMobileMenuOpen(false)}
										>
											<span className="sr-only">Close menu</span>
											<XMarkIcon className="h-6 w-6" aria-hidden="true" />
										</button>
									</div>
								</div>
								<div className="mt-6 flow-root">
									<div className="-my-6 divide-y divide-gray-500/10 dark:divide-gray-100/50">
										<div className="space-y-2 py-6">
											{navigation.map(item => (
												<Link
													key={item.name}
													href={item.href}
													className="-mx-3 block rounded-lg py-2 px-8 md:px-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-400/10 dark:text-white dark:hover:bg-gray-400/40"
													onClick={() => setMobileMenuOpen(false)}
												>
													{item.name}
												</Link>
											))}
										</div>
										<div className="py-6">
											<Link
												href=""
												className="-mx-3 block rounded-lg py-2.5 px-8 md:px-3 text-base font-semibold leading-6 text-gray-900 dark:text-white hover:bg-gray-400/10"
											>
												Connect
											</Link>
										</div>
									</div>
								</div>
							</Dialog.Panel>
						</Dialog>
					</div>
				</div>
			</div>

			<div className="h-14 w-full"></div>
		</>
	);
}
