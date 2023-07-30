import {AptosAccount, AptosClient, HexString, TransactionBuilderABI} from "aptos"
import {pancakeSwapRouterAbis} from "./abis/PancakeSwap/router"
import {Token, tokenList} from "./tokenList"
import {addHoursAndGetSeconds, calculatePercentage, getRandomInt, getTokenBalance} from "./Utils";

export class DexTrader {
    private privateKey: string;
    private hexPrivateKey: HexString;
    private account: AptosAccount;
    private walletAddress: HexString;
    private client: AptosClient
  
    constructor(privateKey : string, client: AptosClient) {
      this.privateKey = privateKey;
      this.hexPrivateKey = new HexString(this.privateKey)
      this.account = new AptosAccount(this.hexPrivateKey.toUint8Array());
      this.walletAddress = this.account.address();
      this.client = client
    }
    
    public async makeRandomSwap(): Promise<string>{
		let fromToken
		let toToken
		let amount

		const accountTokens = []
		for (let i = 0; i < tokenList.length; i++) {
			const tokenBalance = await getTokenBalance(tokenList[i].address, this.account, this.client)
			if (tokenBalance > 0) accountTokens.push(tokenList[i])
		}

		fromToken = accountTokens[getRandomInt(0, accountTokens.length - 1)]
		
		while (true){
			//если имеется только APT берем любой токен кроме APT
			if (accountTokens.length == 1 && accountTokens[0] == tokenList[0]) {
				toToken = tokenList[getRandomInt(1, tokenList.length - 1)]
			} 
			else{
				toToken = tokenList[getRandomInt(0, tokenList.length - 1)]
			}

			if (toToken.address != fromToken.address) break
		}
		
		const fromTokenBalance = await getTokenBalance(fromToken.address, this.account, this.client)

		if (fromToken == tokenList[0]) {
			amount = getRandomInt(calculatePercentage(fromTokenBalance, 10), calculatePercentage(fromTokenBalance, 70))
		}
		else {
			amount = getRandomInt(calculatePercentage(fromTokenBalance, 10), fromTokenBalance)
		}
		
	
		const dexNum = getRandomInt(1, 2)

		let sendedTxHash
		if (dexNum == 1){
			sendedTxHash = await this.pancakeSwap(fromToken, toToken, amount)
		}
		else {
			if (!accountTokens.includes(toToken)){
				const regTokenTx = await this.registerToken(toToken)
				const txResult = (await this.client.waitForTransactionWithResult(regTokenTx as string) as any).success
				if (!txResult) return await this.pancakeSwap(fromToken, toToken, amount)
			}

			sendedTxHash = await this.liquidSwap(fromToken, toToken, amount)
		}

		return sendedTxHash
    }
	public async registerToken(token: Token): Promise<string>{
		const txPayload = this.getPayloadForRegisterToken(token)
		const max_gas_amount = await this.client.estimateMaxGasAmount(this.account.address())
		const options: Partial<SubmitTransactionRequest> = {
			max_gas_amount: max_gas_amount.toString(), expiration_timestamp_secs: addHoursAndGetSeconds(1).toString()
		};
		const rawTX = await this.client.generateTransaction(this.walletAddress, txPayload, options)
		return await this.client.signAndSubmitTransaction(this.account, rawTX)
	}

    public async pancakeSwap(fromToken : Token, toToken : Token, amount: number) : Promise<string> {
		//console.log("инициализирован обмен " + amount.toString() + " " + fromToken.symbol + " на " + toToken.symbol + " dex: " + "pancakeSwap\n")
        const swapAbi = pancakeSwapRouterAbis.swap_exact_input_abi
        const swapAbiParam = new HexString(swapAbi).toUint8Array()
        const txBuilder = new TransactionBuilderABI([swapAbiParam])
    
        const txPayload = txBuilder.buildTransactionPayload("0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa::router::swap_exact_input", 
        [fromToken.address, toToken.address], [amount.toString(), ""])
		//console.log("payload транзакции сгенерирован\n")
		const max_gas_amount = await this.client.estimateMaxGasAmount(this.account.address())

        const rawTX = await this.client.generateRawTransaction(this.walletAddress, txPayload, {maxGasAmount: max_gas_amount, expireTimestamp: addHoursAndGetSeconds(1)})
		//console.log("транзакция сгенерирована\n")
		//console.log("транзакция на обмен подписана и отправлена: " + sendedTxHash + "\n")
        return await this.client.signAndSubmitTransaction(this.account, rawTX)
    }

    public async liquidSwap(fromToken : Token, toToken : Token, amount: number) : Promise<string> {
		//console.log("инициализирован обмен " + amount.toString() + " " + fromToken.symbol + " на " + toToken.symbol + " dex: " + "liquidSwap\n")
        const txPayload = this.getPayloadForLiquidSwap2(fromToken, toToken, amount)
		//console.log("payload транзакции сгенерирован\n")
        const max_gas_amount = await this.client.estimateMaxGasAmount(this.account.address())
        const options: Partial<SubmitTransactionRequest> = {
            max_gas_amount: max_gas_amount.toString(), expiration_timestamp_secs: addHoursAndGetSeconds(1).toString()
        };
        const rawTX = await this.client.generateTransaction(this.walletAddress, txPayload, options)
		//console.log("транзакция сгенерирована\n")
		//console.log("транзакция на обмен подписана и отправлена: " + sendedTxHash + "\n")
        return await this.client.signAndSubmitTransaction(this.account, rawTX)
    }

	private getPayloadForLiquidSwap1(fromToken : Token, toToken : Token, amount: number) : EntryFunctionPayload{
		const moveFunction = "0x190d44266241744264b964a37b8f09863167a12d3e70cda39376cfb4e3561e12::scripts::swap"
		const type_arguments = [fromToken.address, toToken.address, "0x190d44266241744264b964a37b8f09863167a12d3e70cda39376cfb4e3561e12::curves::Uncorrelated"]
		const _arguments = [amount.toString(), ""]
		return {function: moveFunction, type_arguments: type_arguments, arguments: _arguments}
	}

	private getPayloadForLiquidSwap2(fromToken : Token, toToken : Token, amount: number) : EntryFunctionPayload{
		const moveFunction = "0x190d44266241744264b964a37b8f09863167a12d3e70cda39376cfb4e3561e12::scripts_v2::swap"
		const type_arguments = [fromToken.address, toToken.address, "0x190d44266241744264b964a37b8f09863167a12d3e70cda39376cfb4e3561e12::curves::Uncorrelated"]
		const _arguments = [amount.toString(), ""]
		return {function: moveFunction, type_arguments: type_arguments, arguments: _arguments}
	}
	private getPayloadForRegisterToken(token: Token) : EntryFunctionPayload{
		const moveFunction = "0x1::managed_coin::register"
		const type_arguments = [
			token.address
		]
		const _arguments:string[] = []
		return {function: moveFunction, type_arguments: type_arguments, arguments: _arguments,}
	}
  }
  
declare type EntryFunctionPayload = {
    function: string;
    type_arguments: Array<any>;
    arguments: Array<any>;
};

declare type SubmitTransactionRequest = {
    sender: string;
    sequence_number: string;
    max_gas_amount: string;
    gas_unit_price: string;
    expiration_timestamp_secs: string;
    payload: TransactionPayload_EntryFunctionPayload;
    signature: TransactionSignature_Ed25519Signature;
};

declare type TransactionPayload_EntryFunctionPayload = ({
    type: string;
} & EntryFunctionPayload);

declare type TransactionSignature_Ed25519Signature = ({
    type: string;
} & Ed25519Signature$1);

declare type Ed25519Signature$1 = {
    public_key: string;
    signature: string;
};