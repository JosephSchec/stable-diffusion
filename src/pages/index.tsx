import Image from 'next/image';
import React, { SetStateAction, Suspense, useCallback, useState } from 'react';
interface Body {
	prompt: string;
}
async function getImg(body: Body) {
	const img = await fetch(`/api/stable-diffusion/${body.prompt}`, {
		cache: 'no-store',
	});
	if(!img.ok){
		throw new Error("Issue getting image")
	}
	return await img.text();
}
export default function Home() {
	const [inputVal, setInputVal] = useState('');
	const [img, setImg] = useState('');
	const [loading, setLoading] = useState(false);
	const onClick = useCallback(async () => {
		setLoading(true);
		const res = await getImg({ prompt: inputVal });
		setLoading(false);
		setImg(res);
	}, [inputVal]);

	return (
		<div className="w-full h-full flex justify-center items-center flex-col">
			<div className="flex w-full justify-center">
				<input
					className="w-2/3 p-4 rounded m-4 text-lg border-2"
					placeholder="Insert a prompt"
					type="text"
					name="prompt"
					value={inputVal}
					onChange={(e: { target: { value: SetStateAction<string> } }) =>
						setInputVal(e.target.value)
					}
				/>

				<button type="submit" onClick={onClick}>
					Generate
				</button>
			</div>

			{img.trim() !== '' && !loading ? (
				<Image src={img} alt="img" height={512} width={512} className="rounded shadow-lg" />
			) : loading ? (
				<div className="animate-pulse">
					<div className=" w-[512px] h-[512px] bg-gray-300 rounded sm:w-96 dark:bg-gray-700"></div>
				</div>
			) : null}
		</div>
	);
}
