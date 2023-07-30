import axios, { AxiosError } from 'axios';
import { AptosClient, AptosAccount, HexString, Provider, AnsClient, Network} from "aptos"
import {tokenList} from "./tokenList";

export function sleep(milliseconds: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, milliseconds);
    });
  }  

export function shuffleArray(arr: any[]): any[] {
    const shuffled = [...arr];
    shuffled.sort(() => Math.random() - 0.5);
    return shuffled;
}

export async function sendGetRequest(url: string): Promise<any> {
  let retryCount = 0;

  while (retryCount < 10) {
    try {
      const response = await axios.get(url);
      const data = response.data;
      return data;
    } catch (error) {
      if (isAxiosError(error) && error.code === 'ETIMEDOUT') {
        console.error(`Connection timed out. Retrying request (${retryCount + 1}/10)...`);
        retryCount++;
      } else {
        console.error(error);
        throw error;
      }
    }
  }

  throw new Error('Failed to make the request after 10 attempts');
}

function isAxiosError(error: any): error is AxiosError {
  return error.isAxiosError !== undefined;
}

export async function getTokenBalance(token : string, account : AptosAccount, client : AptosClient) : Promise<number>{
    token = "0x1::coin::CoinStore<" + token + ">"
    const resources = await client.getAccountResources(account.address())
    for (let i = 0; i < resources.length; i++){
        if (resources[i]["type"] == token) {
            return (resources[i]["data"] as any)["coin"]["value"] as number
        }
    }
    return 0
}

export function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function calculatePercentage(number: number, percentage: number): number {
  const result = (number * percentage) / 100;
  return Math.floor(result); // или Math.round(result) для округления до ближайшего целого числа
}

export function addHoursAndGetSeconds(hours: number): bigint {
  const currentTimeMillis = Date.now();
  const hoursInMillis = BigInt(hours) * BigInt(60) * BigInt(60) * BigInt(1000);
  const futureTimeMillis = BigInt(currentTimeMillis) + hoursInMillis;
  const futureTimeSeconds = futureTimeMillis / BigInt(1000);
  return futureTimeSeconds;
}

function getExpirationDateFromTimestamp(timestamp: bigint): Date {
    const expirationTimestampSeconds: number = Number(timestamp);
    const expirationTimestampMilliseconds: number = expirationTimestampSeconds * 1000;

    return new Date(expirationTimestampMilliseconds);
}

async function getWalletTXNumber(privateKey: string, client: AptosClient) {
    const account = new AptosAccount(new HexString(privateKey).toUint8Array())
    try {
        const txNumber = await client.getAccountTransactions(account.address());
        console.log(account.address().toString() + " : " + ((txNumber[txNumber.length - 1]) as any ).sequence_number + " , " + txNumber.length)
    } catch (error) {
        console.log(account.address().toString() + " : " + 0)
    }
}

async function getWalletAptBalance(accountAddress: string, client: AptosClient) {
    const account = new AptosAccount(undefined, new HexString(accountAddress))
    try {
        const resourses = await client.getAccountResource(account.address(), "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>")
        console.log(account.address().toString() + " : " + (resourses as any)["data"]["coin"]["value"] / 100000000)
    } catch (error) {
        console.log(account.address().toString() + " : " + 0)
    }
}

async function buyAns(account: AptosAccount, client: AptosClient): Promise<string>{
    const APTbalance = await getTokenBalance(tokenList[0].address, account, client)
    if (APTbalance < 1.4){
        console.log("недостаточный баланс для покупки ans")
        return "error"
    }
    else{
        const ans = new AnsClient(new Provider("mainnet" as Network))
        const max_gas_amount = await client.estimateMaxGasAmount(account.address())
        return await ans.mintAptosName(account, "bebra228", 1, {maxGasAmount: max_gas_amount})
    }
}