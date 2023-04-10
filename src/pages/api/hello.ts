// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  usd: number
}

export default async function getEthPrice(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const result = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd")
  return (await result.json() as {"ethereum":{"usd": number}}).ethereum.usd
}
