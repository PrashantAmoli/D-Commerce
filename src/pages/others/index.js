import Head from 'next/head';

export default function OthersPage() {
	const URL = `https://via5k.github.io/Sterling-Store`;
	return (
		<>
			<Head>Others</Head>

			<main className="w-full min-h-screen">
				<iframe src={URL} className="w-full min-h-screen" allowFullScreen frameBorder={0}></iframe>
			</main>
		</>
	);
}
