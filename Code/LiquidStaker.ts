import { AptosClient, AptosAccount, HexString, TransactionBuilderABI} from "aptos"
import {addHoursAndGetSeconds, calculatePercentage, getRandomInt, getTokenBalance} from "./Utils";
import { tokenList } from "./tokenList";

export class LiquidStaker {
    private privateKey: string;
    private hexPrivateKey: HexString;
    private account: AptosAccount;
    private client: AptosClient
  
    constructor(privateKey : string, client: AptosClient) {
      this.privateKey = privateKey;
      this.hexPrivateKey = new HexString(this.privateKey)
      this.account = new AptosAccount(this.hexPrivateKey.toUint8Array());
      this.client = client
    }

    public async makeRandomStakeAction() : Promise<string> {
        const stAPTbalance = await getTokenBalance(tokenList[4].address, this.account, this.client)
        const tAPTbalance = await getTokenBalance(tokenList[5].address, this.account, this.client)

        let txHash

        if ( stAPTbalance + tAPTbalance > 0 ){
            const action = getRandomInt(0, 1)
            if (action) txHash = await this.randomUnStake(stAPTbalance, tAPTbalance)
            else txHash = await this.randomStake()
        }
        else {
            txHash = await this.randomStake()
        }

        return txHash
    }

    private async randomUnStake(stAPTbalance : number, tAPTbalance : number) : Promise<string> {
        const amountForDitto = getRandomInt(
            calculatePercentage(stAPTbalance, 60),
            calculatePercentage(stAPTbalance, 100)
        )

        const amountForTortuga = getRandomInt(
            calculatePercentage(tAPTbalance, 60),
            calculatePercentage(tAPTbalance, 100)
        )

        let txHash

        if (stAPTbalance > 0 && tAPTbalance > 0){
            const action = getRandomInt(0, 1)
            if (action) txHash = await this.unstakeFromDittoFi(amountForDitto)
            else txHash = await this.unstakeFromTortuga(amountForTortuga)
        }
        else {
            if (stAPTbalance > 0) {
                txHash = await this.unstakeFromDittoFi(amountForDitto)
            }
            else {
                txHash = await this.unstakeFromTortuga(amountForTortuga)
            }
        }

        return txHash
    }

    private async randomStake() : Promise<string> {
        const APTbalance = await getTokenBalance(tokenList[0].address, this.account, this.client)
        const amount = getRandomInt(calculatePercentage(APTbalance, 20), calculatePercentage(APTbalance, 60))
        
        const platformNum = getRandomInt(1, 2)
        let sendedTxHash
        if (platformNum == 1) sendedTxHash = await this.stakeOnDittoFi(amount)
        else sendedTxHash = await this.stakeOnTortuga(amount)

        return sendedTxHash as string
    }

    public async stakeOnDittoFi(amount: number) : Promise<string>{
        const payload = this.getPayloadForStakeOnDittoFi(amount)
        // console.log("payload транзакции сгенерирован\n")

        const max_gas_amount = await this.client.estimateMaxGasAmount(this.account.address())
        const options: Partial<SubmitTransactionRequest> = {
            max_gas_amount: max_gas_amount.toString(), expiration_timestamp_secs: addHoursAndGetSeconds(1).toString()
          };
        const rawTx = await this.client.generateTransaction(this.account.address(), payload, options)

        // console.log("транзакция сгенерирована\n")
        const sendedTxHash = await this.client.signAndSubmitTransaction(this.account, rawTx)
        // console.log("транзакция на стейкинг в DittoFi подписана и отправлена: " + sendedTxHash + "\n")
        return sendedTxHash
    }

    public async unstakeFromDittoFi(amount: number) : Promise<string>{
        const stAPTbalance = await getTokenBalance(tokenList[4].address, this.account, this.client)

        if (amount > stAPTbalance) amount = stAPTbalance

        const payload = this.getPayloadForUnstakeFromDittoFi(amount)
        // console.log("payload транзакции сгенерирован\n")

        const max_gas_amount = await this.client.estimateMaxGasAmount(this.account.address())
        const options: Partial<SubmitTransactionRequest> = {
            max_gas_amount: max_gas_amount.toString(), expiration_timestamp_secs: addHoursAndGetSeconds(1).toString()
          };
        const rawTx = await this.client.generateTransaction(this.account.address(), payload, options)

        // console.log("транзакция сгенерирована\n")
        const sendedTxHash = await this.client.signAndSubmitTransaction(this.account, rawTx)
        // console.log("транзакция на анстейкинг из DittoFi подписана и отправлена: " + sendedTxHash + "\n")
        return sendedTxHash
    }
    
    private getPayloadForUnstakeFromDittoFi(amount: number) : EntryFunctionPayload{
        const moveFunction = "0xd11107bdf0d6d7040c6c0bfbdecb6545191fdf13e8d8d259952f53e1713f61b5::ditto_staking::instant_unstake"
        const _arguments = [amount.toString()]
        const payload : EntryFunctionPayload = {function: moveFunction, type_arguments: [], arguments: _arguments}
        return payload
    }

    private getPayloadForStakeOnDittoFi(amount: number) : EntryFunctionPayload {
        const moveFunction = "0xd11107bdf0d6d7040c6c0bfbdecb6545191fdf13e8d8d259952f53e1713f61b5::ditto_staking::stake_aptos"
        const _arguments = [amount.toString()]
        const payload : EntryFunctionPayload = {function: moveFunction, type_arguments: [], arguments: _arguments}
        return payload
    }

    public async stakeOnTortuga(amount: number) : Promise<string>{
        const payload = this.getPayloadForStakeOnTortuga(amount)
        // console.log("payload транзакции сгенерирован\n")

        const max_gas_amount = await this.client.estimateMaxGasAmount(this.account.address())
        const options: Partial<SubmitTransactionRequest> = {
            max_gas_amount: max_gas_amount.toString(), expiration_timestamp_secs: addHoursAndGetSeconds(1).toString()
          };
        const rawTx = await this.client.generateTransaction(this.account.address(), payload, options)

        // console.log("транзакция сгенерирована\n")
        const sendedTxHash = await this.client.signAndSubmitTransaction(this.account, rawTx)
        // console.log("транзакция на стейкинг в Tortuga подписана и отправлена: " + sendedTxHash + "\n")
        return sendedTxHash
    }

    public async unstakeFromTortuga(amount: number) : Promise<string>{
        const tAPTbalance = await getTokenBalance(tokenList[5].address, this.account, this.client)

        if (amount > tAPTbalance) amount = tAPTbalance

        const payload = this.getPayloadForUnstakeFromTortuga(amount)
        // console.log("payload транзакции сгенерирован\n")

        const max_gas_amount = await this.client.estimateMaxGasAmount(this.account.address())
        const options: Partial<SubmitTransactionRequest> = {
            max_gas_amount: max_gas_amount.toString(), expiration_timestamp_secs: addHoursAndGetSeconds(1).toString()
          };
        const rawTx = await this.client.generateTransaction(this.account.address(), payload, options)

        // console.log("транзакция сгенерирована\n")
        const sendedTxHash = await this.client.signAndSubmitTransaction(this.account, rawTx)
        // console.log("транзакция на анстейкинг из Tortuga подписана и отправлена: " + sendedTxHash + "\n")
        return sendedTxHash
    }
    
    private getPayloadForUnstakeFromTortuga(amount: number) : EntryFunctionPayload{
        const moveFunction = "0xbd35135844473187163ca197ca93b2ab014370587bb0ed3befff9e902d6bb541::amm::swap_exact_coin_for_coin_with_signer"
        const type_arguments = [
            "0x84d7aeef42d38a5ffc3ccef853e1b82e4958659d16a7de736a29c55fbbeb0114::staked_aptos_coin::StakedAptosCoin",
            "0x1::aptos_coin::AptosCoin"
        ]
        const _arguments = [amount.toString(), "0"]
        const payload : EntryFunctionPayload = {function: moveFunction, type_arguments: type_arguments, arguments: _arguments}
        return payload
    }

    private getPayloadForStakeOnTortuga(amount: number) : EntryFunctionPayload {
        const moveFunction = "0x8f396e4246b2ba87b51c0739ef5ea4f26515a98375308c31ac2ec1e42142a57f::stake_router::stake"
        const _arguments = [amount.toString()]
        const payload : EntryFunctionPayload = {function: moveFunction, type_arguments: [], arguments: _arguments}
        return payload
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