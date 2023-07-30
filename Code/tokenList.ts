//https://tokens.pancakeswap.finance/pancakeswap-aptos.json
export const tokenList : Token[] = [
    {
        "name": "Aptos Coin",
        "symbol": "APT",
        "chainId": 1,
        "decimals": 8,
        "address": "0x1::aptos_coin::AptosCoin",
    },
    {
        "name": "LayerZero - USD Coin",
        "symbol": "lzUSDC",
        "chainId": 1,
        "decimals": 6,
        "address": "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC",
    },
    {
        "name": "LayerZero - Tether USD",
        "symbol": "lzUSDT",
        "chainId": 1,
        "decimals": 6,
        "address": "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDT",
    },
    {
        "name": "LayerZero - Wrapped Ether",
        "symbol": "lzWETH",
        "chainId": 1,
        "decimals": 6,
        "address": "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::WETH",
    },
    {
        "name": "Ditto Staked Aptos",
        "symbol": "stAPT",
        "chainId": 1,
        "decimals": 8,
        "address": "0xd11107bdf0d6d7040c6c0bfbdecb6545191fdf13e8d8d259952f53e1713f61b5::staked_coin::StakedAptos",
    },
    {
        "name": "Tortuga Staked APT",
        "symbol": "tAPT",
        "chainId": 1,
        "decimals": 8,
        "address": "0x84d7aeef42d38a5ffc3ccef853e1b82e4958659d16a7de736a29c55fbbeb0114::staked_aptos_coin::StakedAptosCoin",
    },
]

export declare type Token  = {
    name: string;
    symbol: string;
    chainId: number;
    decimals: number;
    address: string;
}