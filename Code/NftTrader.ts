import {
    addHoursAndGetSeconds,
    calculatePercentage,
    getRandomInt,
    getTokenBalance,
    sendGetRequest,
    shuffleArray
} from "./Utils";
import {AptosAccount, AptosClient, HexString, Network, Provider} from "aptos"
import {tokenList} from "./tokenList";

export class NftTrader {
    private privateKey : string
    private client: AptosClient;
    private hexPrivateKey: HexString
    private aptosAccount: AptosAccount
  
    constructor(privateKey : string, client: AptosClient) {
      this.privateKey = privateKey;
      this.hexPrivateKey = new HexString(this.privateKey)
      this.aptosAccount = new AptosAccount(this.hexPrivateKey.toUint8Array());
      this.client = client;
    }
    
    public async makeRandomNftAction(APTprice: number) : Promise<string> {
        const APTbalance = await getTokenBalance(tokenList[0].address, this.aptosAccount, this.client)
        const accountNfts = await this.getAccountNFTs()
        const listedItems = await this.getListedItems()

        
        let txHash : string

        if (accountNfts.length == 0) {
            
            if (listedItems.length == 0) { // 0 in wallet | 0 listed => buy
                const usdValue = 2
                //если баланс > 1.5 APT то покупаем нфт не дороже 2$            
                if (APTbalance > 150000000) txHash = await this.blueMoveBuy(Math.floor((usdValue / APTprice) * 100000000))
                //если баланс < 1.5 APT то покупаем нфт не дороже 30% от баланса
                else txHash = await this.blueMoveBuy(calculatePercentage(APTbalance, 30))
            } 
            else if (listedItems.length <= 2) { // 0 in wallet | 1-2 listed => relist / buy
                const action = getRandomInt(0, 1)
                //buy
                if (action) {
                    const usdValue = 0.7
                    //если баланс > 1.5 APT то покупаем нфт не дороже 0.7$            
                    if (APTbalance > 150000000) txHash = await this.blueMoveBuy(Math.floor((usdValue / APTprice) * 100000000))
                    //если баланс < 1.5 APT то покупаем нфт не дороже 15% от баланса
                    else txHash = await this.blueMoveBuy(calculatePercentage(APTbalance, 15))
                }
                //relist
                else {
                    const nftForRelist = listedItems[getRandomInt(0, listedItems.length - 1)]
                    txHash = await this.blueMoveDelistFromSale(nftForRelist)
                    const result = ((await this.client.waitForTransactionWithResult(txHash)) as any).success
                    if (result){
                        txHash = await this.blueMoveListForSell(nftForRelist)
                    }
                    else{
                        txHash = "error"
                        // console.log("транзакция на делистинг провалилась(")
                    }
                }
            }
            else { // 0 in wallet | >2 listed => relist
                const nftForRelist = listedItems[getRandomInt(0, listedItems.length - 1)]
                txHash = await this.blueMoveDelistFromSale(nftForRelist)
                const result = ((await this.client.waitForTransactionWithResult(txHash)) as any).success
                if (result){
                    txHash = await this.blueMoveListForSell(nftForRelist)
                }
                else{
                    txHash = "error"
                    // console.log("транзакция на делистинг провалилась(")
                }
            }
        }
        else if (accountNfts.length >= 1 && accountNfts.length <= 2) {

            if (listedItems.length == 0) { // 1-2 in wallet | 0 listed => buy / list
                const action = getRandomInt(0, 1)
                //buy
                if (action) {
                    const usdValue = 0.6
                    //если баланс > 1.5 APT то покупаем нфт не дороже 0.6$            
                    if (APTbalance > 150000000) txHash = await this.blueMoveBuy(Math.floor((usdValue / APTprice) * 100000000))
                    //если баланс < 1.5 APT то покупаем нфт не дороже 12% от баланса
                    else txHash = await this.blueMoveBuy(calculatePercentage(APTbalance, 12))
                }
                //list
                else {
                    const nftForList = accountNfts[getRandomInt(0, accountNfts.length - 1)]
                    txHash = await this.blueMoveListForSell(nftForList)
                }
            } 
            else if (listedItems.length <= 2) { // 1-2 in wallet | 1-2 listed => list / relist
                const action = getRandomInt(0, 1)
                //list
                if (action) {
                    const nftForList = accountNfts[getRandomInt(0, accountNfts.length - 1)]
                    txHash = await this.blueMoveListForSell(nftForList)
                }
                //relist
                else {
                    const nftForRelist = listedItems[getRandomInt(0, listedItems.length - 1)]
                    txHash = await this.blueMoveDelistFromSale(nftForRelist)
                    const result = ((await this.client.waitForTransactionWithResult(txHash)) as any).success
                    if (result){
                        txHash = await this.blueMoveListForSell(nftForRelist)
                    }
                    else{
                        txHash = "error"
                        // console.log("транзакция на делистинг провалилась(")
                    }
                }
            } 
            else { // 1-2 in wallet | >2 listed => list / relist
                const action = getRandomInt(0, 1)
                //list
                if (action) {
                    const nftForList = accountNfts[getRandomInt(0, accountNfts.length - 1)]
                    txHash = await this.blueMoveListForSell(nftForList)
                }
                //relist
                else {
                    const nftForRelist = listedItems[getRandomInt(0, listedItems.length - 1)]
                    txHash = await this.blueMoveDelistFromSale(nftForRelist)
                    const result = ((await this.client.waitForTransactionWithResult(txHash)) as any).success
                    if (result){
                        txHash = await this.blueMoveListForSell(nftForRelist)
                    }
                    else{
                        txHash = "error"
                        // console.log("транзакция на делистинг провалилась(")
                    }
                }
            }
        } 
        else {
            if (listedItems.length == 0) { // >2 in wallet | 0 listed => list
                const nftForList = accountNfts[getRandomInt(0, accountNfts.length - 1)]
                txHash = await this.blueMoveListForSell(nftForList)
            } 
            else if (listedItems.length <= 2) { // >2 in wallet | 1-2 listed => list / relist
                const action = getRandomInt(0, 1)
                //list
                if (action) {
                    const nftForList = accountNfts[getRandomInt(0, accountNfts.length - 1)]
                    txHash = await this.blueMoveListForSell(nftForList)
                }
                //relist
                else {
                    const nftForRelist = listedItems[getRandomInt(0, listedItems.length - 1)]
                    txHash = await this.blueMoveDelistFromSale(nftForRelist)
                    const result = ((await this.client.waitForTransactionWithResult(txHash)) as any).success
                    if (result){
                        txHash = await this.blueMoveListForSell(nftForRelist)
                    }
                    else{
                        txHash = "error"
                        // console.log("транзакция на делистинг провалилась(")
                    }
                }
            } 
            else { // >2 in wallet | >2 listed => list / relist
                const action = getRandomInt(0, 1)
                //list
                if (action) {
                    const nftForList = accountNfts[getRandomInt(0, accountNfts.length - 1)]
                    txHash = await this.blueMoveListForSell(nftForList)
                }
                //relist
                else {
                    const nftForRelist = listedItems[getRandomInt(0, listedItems.length - 1)]
                    txHash = await this.blueMoveDelistFromSale(nftForRelist)
                    const result = ((await this.client.waitForTransactionWithResult(txHash)) as any).success
                    if (result){
                        txHash = await this.blueMoveListForSell(nftForRelist)
                    }
                    else{
                        txHash = "error"
                        // console.log("транзакция на делистинг провалилась(")
                    }
                }
            }
        }

        return txHash
    }

    private async getListedItems(): Promise<NFTitem[]> {
        const response = await sendGetRequest("https://aptos-mainnet-api.bluemove.net/api/market-items?filters%5Blisted_address%5D%5B%24eq%5D=" + this.aptosAccount.address().toString() + "&filters%5Bstatus%5D%5B%24eq%5D=1&populate%5Bcollection%5D%5Bfields%5D%5B0%5D=name&populate%5Bcollection%5D%5Bfields%5D%5B1%5D=creator&pagination%5Bpage%5D=1&pagination%5BpageSize%5D=10000")

        let listedItems : NFTitem[] = []
        
        if (response.data.length == 0) return listedItems

        for (let i = 0; i < response.data.length; i++){
            const nftItem = {
                name: response.data[i].attributes.name,
                collection_name: response.data[i].attributes.collection_name,
                creator: response.data[i].attributes.creator,
                property_version: response.data[i].attributes.property_version,
                price: response.data[i].attributes.price
            }
            listedItems.push(nftItem)
        }

        return listedItems
    }

    public async blueMoveBuy(maxPrice: number) : Promise<string> {
        // console.log("поиск коллекции для покупки.....\n")
        const collectionForBuy = await this.searchOptimalCollectionForBuy(maxPrice)
        if (collectionForBuy == 0){
            // console.log("коллекция не нашлась(")
            return "error"
        }
        // console.log("коллекция для покупки нашлась\n")
        
        const nftForBuy = await this.getCheapestItemFromCollection(collectionForBuy)
        if (nftForBuy == undefined) {
            // console.log("nftForBuy invalid")
            return "error"
        }
        // console.log("получен NFT для покупки\n")
        const payload = await this.getPayloadForNftBuy(nftForBuy)
        // console.log("payload транзакции сгенерирован\n")

        const max_gas_amount = await this.client.estimateMaxGasAmount(this.aptosAccount.address())
        const options: Partial<SubmitTransactionRequest> = {
            max_gas_amount: max_gas_amount.toString(), expiration_timestamp_secs: addHoursAndGetSeconds(1).toString()
        };
        const rawTx = await this.client.generateTransaction(this.aptosAccount.address(), payload, options)

        // console.log("транзакция сгенерирована\n")
        // console.log("транзакция на покупку NFT подписана и отправлена: " + sendedTxHash + "\n")
        return await this.client.signAndSubmitTransaction(this.aptosAccount, rawTx)
    }

    public async getAccountNFTs(): Promise<NFTitem[]> {
        const provider = new Provider("mainnet" as Network)
        const allNfts = await provider.getAccountNFTs(this.aptosAccount.address())
        let blueMoveAccountNfts = []
        const bluemoveCollections = await this.getCollections()
        for (let i = 0; i < allNfts.current_token_ownerships.length; i++){

            const userNftCollectionName = allNfts.current_token_ownerships[i].current_collection_data?.collection_name
            let result = false
            for (let j = 0; j < bluemoveCollections.length; j++){
                if (bluemoveCollections[j].attributes.name == userNftCollectionName) {
                    result = true
                    break
                }
            }
            if (result) {
                const nftItem : NFTitem = {
                    name: allNfts.current_token_ownerships[i].current_token_data?.name as string,
                    collection_name: allNfts.current_token_ownerships[i].current_token_data?.collection_name as string,
                    creator: allNfts.current_token_ownerships[i].current_token_data?.creator_address as string,
                    property_version: allNfts.current_token_ownerships[i].property_version,
                    price: ""
                }
                blueMoveAccountNfts.push(nftItem)
            }

        }
        return blueMoveAccountNfts
    }

    public async blueMoveListForSell(item: NFTitem) : Promise<string> {
        const payload = await this.getPayloadForNftSell(item)
        if (payload == 0) return "error"
        // console.log("payload транзакции сгенерирован\n")

        const max_gas_amount = await this.client.estimateMaxGasAmount(this.aptosAccount.address())
        const options: Partial<SubmitTransactionRequest> = {
            max_gas_amount: max_gas_amount.toString(), expiration_timestamp_secs: addHoursAndGetSeconds(1).toString()
        };
        const rawTx = await this.client.generateTransaction(this.aptosAccount.address(), payload as EntryFunctionPayload, options)
        
        // console.log("транзакция сгенерирована\n")
        // console.log("транзакция на листинг NFT подписана и отправлена: " + sendedTxHash + "\n")
        return await this.client.signAndSubmitTransaction(this.aptosAccount, rawTx)
    }

    public async blueMoveDelistFromSale(item: NFTitem) : Promise<string> {
        const payload = await this.getPayloadForNftDelist(item)
        // console.log("payload транзакции сгенерирован\n")
        
        const max_gas_amount = await this.client.estimateMaxGasAmount(this.aptosAccount.address())
        const options: Partial<SubmitTransactionRequest> = {
            max_gas_amount: max_gas_amount.toString(), expiration_timestamp_secs: addHoursAndGetSeconds(1).toString()
        };
        const rawTx = await this.client.generateTransaction(this.aptosAccount.address(), payload as EntryFunctionPayload, options)
        
        // console.log("транзакция сгенерирована\n")
        // console.log("транзакция на делистинг NFT подписана и отправлена: " + sendedTxHash + "\n")
        return await this.client.signAndSubmitTransaction(this.aptosAccount, rawTx)
    }

    private async getSellPriceByCollectionName(collectionName: string) : Promise<string> {
        const collections = await this.getCollections()
        for (let i = 0; i < collections.length; i++){
            if (collections[i].attributes.name == collectionName){
                const cheapestItem = await this.getCheapestItemFromCollection(collections[i])
                if (cheapestItem == undefined) return "10000000"
                return cheapestItem.price
            }
        }
        // console.log("Коллекция не найдена или не торгуется на BlueMove\n")
        return "0"
    }

    private async getPayloadForNftDelist(item: NFTitem) : Promise<EntryFunctionPayload> {
        const moveFunction = "0xd1fd99c1944b84d1670a2536417e997864ad12303d19eac725891691b04d614e::marketplaceV2::batch_delist_script"
        const _arguments = [
            [
                item.creator
            ],
            [
                item.collection_name
            ],
            [
                item.name
            ],
            [
                item.property_version
            ],
          ]

        return {function: moveFunction, type_arguments: [], arguments: _arguments}
    }

    private async getPayloadForNftSell(item: NFTitem) : Promise<EntryFunctionPayload | number> {
        const moveFunction = "0xd1fd99c1944b84d1670a2536417e997864ad12303d19eac725891691b04d614e::marketplaceV2::batch_list_script"
        const sellPrice = await this.getSellPriceByCollectionName(item.collection_name)
        if (sellPrice == "0") return 0
        // console.log("Цена для продажи получена\n")
        const _arguments = [
            [
                item.creator
            ],
            [
                item.collection_name
            ],
            [
                item.name
            ],
            [
                Math.floor(calculatePercentage(Number(sellPrice), 95)).toString()
            ],
            [
                item.property_version
            ]
          ]

        return {function: moveFunction, type_arguments: [], arguments: _arguments}
    }

    private async searchOptimalCollectionForBuy(maxPrice: number): Promise<any> {
        const collections = await this.getCollections()
        for (let i = 0; i < collections.length; i++){
            
            if (Number(collections[i].attributes.floor_price) <= maxPrice){
                const cheapestItem = await this.getCheapestItemFromCollection(collections[i])
                if (cheapestItem == undefined) continue
                if (collections[i].attributes.floor_price == cheapestItem.price) return collections[i] 
                else {
                    if(Number(cheapestItem.price) <= maxPrice) return collections[i]
                }
            }
        }
        return 0
    }
  
    private async getCheapestItemFromCollection(collection : any) : Promise<NFTitem | undefined> {
        const collectionId = collection.id
        const collectionInfo = await sendGetRequest("https://aptos-mainnet-api.bluemove.net/api/market-items?filters[collection][id][$eq]="+ collectionId+ "&filters[$or][0][status][$eq]=1&filters[price][$gte]=0&filters[price][$lte]=10000000000000000&sort[0]=price%3Aasc&pagination[page]=1&pagination[pageSize]=24")
        const rawCheapestItem = collectionInfo["data"][0]
        if (rawCheapestItem == undefined) return undefined
        return {
            name: rawCheapestItem.attributes.name,
            collection_name: rawCheapestItem.attributes.collection_name,
            creator: rawCheapestItem.attributes.creator,
            property_version: rawCheapestItem.attributes.property_version,
            price: rawCheapestItem.attributes.price
        }
    }
    
    private async getPayloadForNftBuy(item: NFTitem) : Promise<EntryFunctionPayload> {
        const moveFunction = "0xd1fd99c1944b84d1670a2536417e997864ad12303d19eac725891691b04d614e::marketplaceV2::batch_buy_script"
        const _arguments = [
            [
                item.creator
            ],
            [
                item.collection_name
            ],
            [
                item.name
            ],
            [
                item.price + item.property_version
            ]
          ]

        return {function: moveFunction, type_arguments: [], arguments: _arguments}
    }

    private async getCollections() : Promise<any[]> {
        const page1 = await sendGetRequest('https://aptos-mainnet-api.bluemove.net/api/collections?filters[name][$containsi]=&sort[0]=createdAt%3ADESC&pagination[page]=1&pagination[pageSize]=100');
        const page2 = await sendGetRequest('https://aptos-mainnet-api.bluemove.net/api/collections?filters[name][$containsi]=&sort[0]=createdAt%3ADESC&pagination[page]=2&pagination[pageSize]=100');
        const page3 = await sendGetRequest('https://aptos-mainnet-api.bluemove.net/api/collections?filters[name][$containsi]=&sort[0]=createdAt%3ADESC&pagination[page]=3&pagination[pageSize]=100');
    
        let collections = []
        for (let i = 0; i < page1["data"].length; i++) collections.push(page1["data"][i])
        for (let i = 0; i < page2["data"].length; i++) collections.push(page2["data"][i])
        for (let i = 0; i < page3["data"].length; i++) collections.push(page3["data"][i])
    
        return shuffleArray(collections)
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

declare type NFTitem = {
    name: string;
    collection_name: string;
    creator: string;
    property_version: string;
    price: string;
};