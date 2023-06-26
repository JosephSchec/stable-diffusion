// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { HfInference } from '@huggingface/inference';
import type { NextApiRequest, NextApiResponse } from 'next'; 
import { NextRequest } from 'next/server';
export const config = {
  runtime: 'edge',
}
export default async function handler(req: NextRequest, res: NextApiResponse) {
	const TOKEN = process.env.HUGFACE_TOKEN;
	const hf = new HfInference(TOKEN, {
		wait_for_model: true,
		use_cache: false,
		retry_on_error: false,
		use_gpu: true,
	});
//https://nextjs.org/docs/pages/building-your-application/routing/api-routes#dynamic-api-routes
	//const { prompt } = req.query;
  const { searchParams } = new URL(req.url)
  const prompt=searchParams.get("prompt")

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
		return new Response(base64);
	}
		return res.status(200)
} 