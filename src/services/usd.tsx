export async function getEthPrice() {
    const result = await (await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd')).json();

    return (result as { ethereum: { usd: number } }).ethereum.usd;
}

export async function getPrices() {
    const result = await (await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum,matic-network&vs_currencies=usd')).json();

    return result as { ethereum: { usd: number }; 'matic-network': { usd: number } };
}
