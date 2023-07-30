import {AptosAccount, AptosClient, HexString} from "aptos"
import {NftTrader} from "./NftTrader"
import {getRandomInt, sleep} from "./Utils"
import {LiquidStaker} from "./LiquidStaker"
import {DexTrader} from "./DexTrader"
import * as fs from 'fs';

const config = readConfig()
const client = new AptosClient(config.nodeURL)

let walletOutputDataArr : WalletOutputData[] = []

async function main() {
    const privateKeys = readPrivateKeysFromFile("privateKeys.txt");

    let validWallets = true
    for (let i = 0; i < privateKeys.length; i++) {
        try {
            const aptosAccount = new AptosAccount(new HexString(privateKeys[i]).toUint8Array())
            await client.getAccountResources(aptosAccount.address())
        } catch (error){
            console.log("Wrong private keys are entered or there are no funds on the wallet: ")
            console.log(i + ") " + privateKeys[i] )
            return
        }
    }

    for (let i = 0; i < privateKeys.length; i++) {
        walletOutputDataArr.push({
            session_duration_min: 0,
            progress: "0/0",
            current_tx_type: "",
            last_tx_result: "",
            min_until_next_tx: 0,
            status: 0
        })
        session(getRandomInt(config.txAmountMin, config.txAmountMax), privateKeys[i], i, config.timeSleepMin, config.timeSleepMax)
    }

    renderOutput()

} main()

async function session(txAmount: number, privateKey: string, walletID: number, timeSleepMin: number, timeSleepMax: number) {
    const dexTrader = new DexTrader(privateKey, client)
    const liquidStaker = new LiquidStaker(privateKey, client)
    const nftTrader = new NftTrader(privateKey, client)

    const msDelayArr = []
    let totalDelay = 0
    for (let i = 0; i < txAmount; i++){
        const randomSleep = getRandomInt(timeSleepMin, timeSleepMax)
        msDelayArr.push(randomSleep)
        totalDelay += randomSleep
    }

    walletOutputDataArr[walletID].session_duration_min = Number((totalDelay / 60000).toFixed(2))
    walletOutputDataArr[walletID].progress = "0/" + txAmount

    for (let i = 0; i < txAmount; i++){
        walletOutputDataArr[walletID].min_until_next_tx = Number((msDelayArr[i] / 60000).toFixed(2))
        await sleep(msDelayArr[i])

        const txType = getRandomInt(1, 3)
        let txHash
        switch (txType) {
            case 1:
                walletOutputDataArr[walletID].current_tx_type = "DEX trading"
                txHash = await dexTrader.makeRandomSwap()
                break;

            case 2:
                walletOutputDataArr[walletID].current_tx_type = "NFT action"
                txHash = await nftTrader.makeRandomNftAction(config.APTprice)
                break;

            case 3:
                walletOutputDataArr[walletID].current_tx_type = "liquid staking action"
                txHash = await liquidStaker.makeRandomStakeAction()
                break;
            default:
                break;
        }


        if (txHash == "error"){
            walletOutputDataArr[walletID].last_tx_result = "Error when creating a TX"
        }
        else {
            const txResult = (await client.waitForTransactionWithResult(txHash as string) as any).success
            if (txResult){
                walletOutputDataArr[walletID].last_tx_result = "TX was successful"
            }
            else {
                walletOutputDataArr[walletID].last_tx_result = "TX failed"
            }
        }
        walletOutputDataArr[walletID].progress = i + 1 + "/" + txAmount
    }
    walletOutputDataArr[walletID].status = 1
}

function readPrivateKeysFromFile(filePath: string): string[] {
    const privateKeys: string[] = [];

    try {
      const data = fs.readFileSync(filePath, 'utf-8');
      const lines = data.split('\n');

      lines.forEach((line) => {
        const privateKey = line.trim();
        if (privateKey) {
          privateKeys.push(privateKey);
        }
      });

      return privateKeys;
    } catch (error) {
      console.error('Error while reading file:', error);
      return [];
    }
  }

function readConfig(): Config {
    const configPath = 'config.json'

    try {
        const data = fs.readFileSync(configPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error while reading file config.json:', error);
        return {
            txAmountMin: 4,
            txAmountMax: 7,
            timeSleepMin: 120000,
            timeSleepMax: 300000,
            nodeURL: "https://fullnode.mainnet.aptoslabs.com/v1",
            APTprice: 7.5
        };
    }
}


function printWalletsInfo(){
    console.clear()
    console.table(walletOutputDataArr)
    isProgramCompleted()
}
function renderOutput(){
    setInterval(printWalletsInfo, 500);
}

function isProgramCompleted(){
    for (let i = 0; i < walletOutputDataArr.length; i++) {
        if(walletOutputDataArr[i].status == 0) return
    }
    process.exit();
}

declare type WalletOutputData = {
    session_duration_min: number;
    progress: string;
    current_tx_type: string;
    last_tx_result: string;
    min_until_next_tx: number;
    status: number;
}

declare type Config = {
    txAmountMin: number;
    txAmountMax: number;
    timeSleepMin: number;
    timeSleepMax: number;
    nodeURL: string;
    APTprice: number;
}