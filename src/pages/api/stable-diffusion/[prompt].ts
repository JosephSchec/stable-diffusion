// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { HfInference } from '@huggingface/inference';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const TOKEN = process.env.HUGFACE_TOKEN;
	const hf = new HfInference(TOKEN, {
		wait_for_model: true,
		use_cache: false,
		retry_on_error: false,
		use_gpu: true,
	});

	const { prompt } = req.query;

	if (typeof prompt ===  'string') {
		const img = await hf.textToImage({
			inputs: prompt,
			model: 'runwayml/stable-diffusion-v1-5',
			parameters: { height: 512, width: 512, negative_prompt: 'disfigured, ugly, bad,fuzzy' },
		});

		const { type } = img;

		const result = await img.arrayBuffer();
		const base64data = Buffer.from(result).toString('base64');

		const base64 = `data:${type};base64,` + base64data;
		return res.status(200).send(base64);
	}
		return res.status(200)
}
