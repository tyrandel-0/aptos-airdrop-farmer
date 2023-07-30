"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NftTrader = void 0;
var Utils_1 = require("./Utils");
var aptos_1 = require("aptos");
var tokenList_1 = require("./tokenList");
var NftTrader = /** @class */ (function () {
    function NftTrader(privateKey, client) {
        this.privateKey = privateKey;
        this.hexPrivateKey = new aptos_1.HexString(this.privateKey);
        this.aptosAccount = new aptos_1.AptosAccount(this.hexPrivateKey.toUint8Array());
        this.client = client;
    }
    NftTrader.prototype.makeRandomNftAction = function (APTprice) {
        return __awaiter(this, void 0, void 0, function () {
            var APTbalance, accountNfts, listedItems, txHash, usdValue, action, usdValue, nftForRelist, result, nftForRelist, result, action, usdValue, nftForList, action, nftForList, nftForRelist, result, action, nftForList, nftForRelist, result, nftForList, action, nftForList, nftForRelist, result, action, nftForList, nftForRelist, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, Utils_1.getTokenBalance)(tokenList_1.tokenList[0].address, this.aptosAccount, this.client)];
                    case 1:
                        APTbalance = _a.sent();
                        return [4 /*yield*/, this.getAccountNFTs()];
                    case 2:
                        accountNfts = _a.sent();
                        return [4 /*yield*/, this.getListedItems()];
                    case 3:
                        listedItems = _a.sent();
                        if (!(accountNfts.length == 0)) return [3 /*break*/, 25];
                        if (!(listedItems.length == 0)) return [3 /*break*/, 8];
                        usdValue = 2;
                        if (!(APTbalance > 150000000)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.blueMoveBuy(Math.floor((usdValue / APTprice) * 100000000))
                            //если баланс < 1.5 APT то покупаем нфт не дороже 30% от баланса
                        ];
                    case 4:
                        txHash = _a.sent();
                        return [3 /*break*/, 7];
                    case 5: return [4 /*yield*/, this.blueMoveBuy((0, Utils_1.calculatePercentage)(APTbalance, 30))];
                    case 6:
                        txHash = _a.sent();
                        _a.label = 7;
                    case 7: return [3 /*break*/, 24];
                    case 8:
                        if (!(listedItems.length <= 2)) return [3 /*break*/, 19];
                        action = (0, Utils_1.getRandomInt)(0, 1);
                        if (!action) return [3 /*break*/, 13];
                        usdValue = 0.7;
                        if (!(APTbalance > 150000000)) return [3 /*break*/, 10];
                        return [4 /*yield*/, this.blueMoveBuy(Math.floor((usdValue / APTprice) * 100000000))
                            //если баланс < 1.5 APT то покупаем нфт не дороже 15% от баланса
                        ];
                    case 9:
                        txHash = _a.sent();
                        return [3 /*break*/, 12];
                    case 10: return [4 /*yield*/, this.blueMoveBuy((0, Utils_1.calculatePercentage)(APTbalance, 15))];
                    case 11:
                        txHash = _a.sent();
                        _a.label = 12;
                    case 12: return [3 /*break*/, 18];
                    case 13:
                        nftForRelist = listedItems[(0, Utils_1.getRandomInt)(0, listedItems.length - 1)];
                        return [4 /*yield*/, this.blueMoveDelistFromSale(nftForRelist)];
                    case 14:
                        txHash = _a.sent();
                        return [4 /*yield*/, this.client.waitForTransactionWithResult(txHash)];
                    case 15:
                        result = (_a.sent()).success;
                        if (!result) return [3 /*break*/, 17];
                        return [4 /*yield*/, this.blueMoveListForSell(nftForRelist)];
                    case 16:
                        txHash = _a.sent();
                        return [3 /*break*/, 18];
                    case 17:
                        txHash = "error";
                        _a.label = 18;
                    case 18: return [3 /*break*/, 24];
                    case 19:
                        nftForRelist = listedItems[(0, Utils_1.getRandomInt)(0, listedItems.length - 1)];
                        return [4 /*yield*/, this.blueMoveDelistFromSale(nftForRelist)];
                    case 20:
                        txHash = _a.sent();
                        return [4 /*yield*/, this.client.waitForTransactionWithResult(txHash)];
                    case 21:
                        result = (_a.sent()).success;
                        if (!result) return [3 /*break*/, 23];
                        return [4 /*yield*/, this.blueMoveListForSell(nftForRelist)];
                    case 22:
                        txHash = _a.sent();
                        return [3 /*break*/, 24];
                    case 23:
                        txHash = "error";
                        _a.label = 24;
                    case 24: return [3 /*break*/, 66];
                    case 25:
                        if (!(accountNfts.length >= 1 && accountNfts.length <= 2)) return [3 /*break*/, 49];
                        if (!(listedItems.length == 0)) return [3 /*break*/, 33];
                        action = (0, Utils_1.getRandomInt)(0, 1);
                        if (!action) return [3 /*break*/, 30];
                        usdValue = 0.6;
                        if (!(APTbalance > 150000000)) return [3 /*break*/, 27];
                        return [4 /*yield*/, this.blueMoveBuy(Math.floor((usdValue / APTprice) * 100000000))
                            //если баланс < 1.5 APT то покупаем нфт не дороже 12% от баланса
                        ];
                    case 26:
                        txHash = _a.sent();
                        return [3 /*break*/, 29];
                    case 27: return [4 /*yield*/, this.blueMoveBuy((0, Utils_1.calculatePercentage)(APTbalance, 12))];
                    case 28:
                        txHash = _a.sent();
                        _a.label = 29;
                    case 29: return [3 /*break*/, 32];
                    case 30:
                        nftForList = accountNfts[(0, Utils_1.getRandomInt)(0, accountNfts.length - 1)];
                        return [4 /*yield*/, this.blueMoveListForSell(nftForList)];
                    case 31:
                        txHash = _a.sent();
                        _a.label = 32;
                    case 32: return [3 /*break*/, 48];
                    case 33:
                        if (!(listedItems.length <= 2)) return [3 /*break*/, 41];
                        action = (0, Utils_1.getRandomInt)(0, 1);
                        if (!action) return [3 /*break*/, 35];
                        nftForList = accountNfts[(0, Utils_1.getRandomInt)(0, accountNfts.length - 1)];
                        return [4 /*yield*/, this.blueMoveListForSell(nftForList)];
                    case 34:
                        txHash = _a.sent();
                        return [3 /*break*/, 40];
                    case 35:
                        nftForRelist = listedItems[(0, Utils_1.getRandomInt)(0, listedItems.length - 1)];
                        return [4 /*yield*/, this.blueMoveDelistFromSale(nftForRelist)];
                    case 36:
                        txHash = _a.sent();
                        return [4 /*yield*/, this.client.waitForTransactionWithResult(txHash)];
                    case 37:
                        result = (_a.sent()).success;
                        if (!result) return [3 /*break*/, 39];
                        return [4 /*yield*/, this.blueMoveListForSell(nftForRelist)];
                    case 38:
                        txHash = _a.sent();
                        return [3 /*break*/, 40];
                    case 39:
                        txHash = "error";
                        _a.label = 40;
                    case 40: return [3 /*break*/, 48];
                    case 41:
                        action = (0, Utils_1.getRandomInt)(0, 1);
                        if (!action) return [3 /*break*/, 43];
                        nftForList = accountNfts[(0, Utils_1.getRandomInt)(0, accountNfts.length - 1)];
                        return [4 /*yield*/, this.blueMoveListForSell(nftForList)];
                    case 42:
                        txHash = _a.sent();
                        return [3 /*break*/, 48];
                    case 43:
                        nftForRelist = listedItems[(0, Utils_1.getRandomInt)(0, listedItems.length - 1)];
                        return [4 /*yield*/, this.blueMoveDelistFromSale(nftForRelist)];
                    case 44:
                        txHash = _a.sent();
                        return [4 /*yield*/, this.client.waitForTransactionWithResult(txHash)];
                    case 45:
                        result = (_a.sent()).success;
                        if (!result) return [3 /*break*/, 47];
                        return [4 /*yield*/, this.blueMoveListForSell(nftForRelist)];
                    case 46:
                        txHash = _a.sent();
                        return [3 /*break*/, 48];
                    case 47:
                        txHash = "error";
                        _a.label = 48;
                    case 48: return [3 /*break*/, 66];
                    case 49:
                        if (!(listedItems.length == 0)) return [3 /*break*/, 51];
                        nftForList = accountNfts[(0, Utils_1.getRandomInt)(0, accountNfts.length - 1)];
                        return [4 /*yield*/, this.blueMoveListForSell(nftForList)];
                    case 50:
                        txHash = _a.sent();
                        return [3 /*break*/, 66];
                    case 51:
                        if (!(listedItems.length <= 2)) return [3 /*break*/, 59];
                        action = (0, Utils_1.getRandomInt)(0, 1);
                        if (!action) return [3 /*break*/, 53];
                        nftForList = accountNfts[(0, Utils_1.getRandomInt)(0, accountNfts.length - 1)];
                        return [4 /*yield*/, this.blueMoveListForSell(nftForList)];
                    case 52:
                        txHash = _a.sent();
                        return [3 /*break*/, 58];
                    case 53:
                        nftForRelist = listedItems[(0, Utils_1.getRandomInt)(0, listedItems.length - 1)];
                        return [4 /*yield*/, this.blueMoveDelistFromSale(nftForRelist)];
                    case 54:
                        txHash = _a.sent();
                        return [4 /*yield*/, this.client.waitForTransactionWithResult(txHash)];
                    case 55:
                        result = (_a.sent()).success;
                        if (!result) return [3 /*break*/, 57];
                        return [4 /*yield*/, this.blueMoveListForSell(nftForRelist)];
                    case 56:
                        txHash = _a.sent();
                        return [3 /*break*/, 58];
                    case 57:
                        txHash = "error";
                        _a.label = 58;
                    case 58: return [3 /*break*/, 66];
                    case 59:
                        action = (0, Utils_1.getRandomInt)(0, 1);
                        if (!action) return [3 /*break*/, 61];
                        nftForList = accountNfts[(0, Utils_1.getRandomInt)(0, accountNfts.length - 1)];
                        return [4 /*yield*/, this.blueMoveListForSell(nftForList)];
                    case 60:
                        txHash = _a.sent();
                        return [3 /*break*/, 66];
                    case 61:
                        nftForRelist = listedItems[(0, Utils_1.getRandomInt)(0, listedItems.length - 1)];
                        return [4 /*yield*/, this.blueMoveDelistFromSale(nftForRelist)];
                    case 62:
                        txHash = _a.sent();
                        return [4 /*yield*/, this.client.waitForTransactionWithResult(txHash)];
                    case 63:
                        result = (_a.sent()).success;
                        if (!result) return [3 /*break*/, 65];
                        return [4 /*yield*/, this.blueMoveListForSell(nftForRelist)];
                    case 64:
                        txHash = _a.sent();
                        return [3 /*break*/, 66];
                    case 65:
                        txHash = "error";
                        _a.label = 66;
                    case 66: return [2 /*return*/, txHash];
                }
            });
        });
    };
    NftTrader.prototype.getListedItems = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, listedItems, i, nftItem;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, Utils_1.sendGetRequest)("https://aptos-mainnet-api.bluemove.net/api/market-items?filters%5Blisted_address%5D%5B%24eq%5D=" + this.aptosAccount.address().toString() + "&filters%5Bstatus%5D%5B%24eq%5D=1&populate%5Bcollection%5D%5Bfields%5D%5B0%5D=name&populate%5Bcollection%5D%5Bfields%5D%5B1%5D=creator&pagination%5Bpage%5D=1&pagination%5BpageSize%5D=10000")];
                    case 1:
                        response = _a.sent();
                        listedItems = [];
                        if (response.data.length == 0)
                            return [2 /*return*/, listedItems];
                        for (i = 0; i < response.data.length; i++) {
                            nftItem = {
                                name: response.data[i].attributes.name,
                                collection_name: response.data[i].attributes.collection_name,
                                creator: response.data[i].attributes.creator,
                                property_version: response.data[i].attributes.property_version,
                                price: response.data[i].attributes.price
                            };
                            listedItems.push(nftItem);
                        }
                        return [2 /*return*/, listedItems];
                }
            });
        });
    };
    NftTrader.prototype.blueMoveBuy = function (maxPrice) {
        return __awaiter(this, void 0, void 0, function () {
            var collectionForBuy, nftForBuy, payload, max_gas_amount, options, rawTx;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.searchOptimalCollectionForBuy(maxPrice)];
                    case 1:
                        collectionForBuy = _a.sent();
                        if (collectionForBuy == 0) {
                            // console.log("коллекция не нашлась(")
                            return [2 /*return*/, "error"];
                        }
                        return [4 /*yield*/, this.getCheapestItemFromCollection(collectionForBuy)];
                    case 2:
                        nftForBuy = _a.sent();
                        if (nftForBuy == undefined) {
                            // console.log("nftForBuy invalid")
                            return [2 /*return*/, "error"];
                        }
                        return [4 /*yield*/, this.getPayloadForNftBuy(nftForBuy)
                            // console.log("payload транзакции сгенерирован\n")
                        ];
                    case 3:
                        payload = _a.sent();
                        return [4 /*yield*/, this.client.estimateMaxGasAmount(this.aptosAccount.address())];
                    case 4:
                        max_gas_amount = _a.sent();
                        options = {
                            max_gas_amount: max_gas_amount.toString(), expiration_timestamp_secs: (0, Utils_1.addHoursAndGetSeconds)(1).toString()
                        };
                        return [4 /*yield*/, this.client.generateTransaction(this.aptosAccount.address(), payload, options)
                            // console.log("транзакция сгенерирована\n")
                            // console.log("транзакция на покупку NFT подписана и отправлена: " + sendedTxHash + "\n")
                        ];
                    case 5:
                        rawTx = _a.sent();
                        return [4 /*yield*/, this.client.signAndSubmitTransaction(this.aptosAccount, rawTx)];
                    case 6: 
                    // console.log("транзакция сгенерирована\n")
                    // console.log("транзакция на покупку NFT подписана и отправлена: " + sendedTxHash + "\n")
                    return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    NftTrader.prototype.getAccountNFTs = function () {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function () {
            var provider, allNfts, blueMoveAccountNfts, bluemoveCollections, i, userNftCollectionName, result, j, nftItem;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        provider = new aptos_1.Provider("mainnet");
                        return [4 /*yield*/, provider.getAccountNFTs(this.aptosAccount.address())];
                    case 1:
                        allNfts = _e.sent();
                        blueMoveAccountNfts = [];
                        return [4 /*yield*/, this.getCollections()];
                    case 2:
                        bluemoveCollections = _e.sent();
                        for (i = 0; i < allNfts.current_token_ownerships.length; i++) {
                            userNftCollectionName = (_a = allNfts.current_token_ownerships[i].current_collection_data) === null || _a === void 0 ? void 0 : _a.collection_name;
                            result = false;
                            for (j = 0; j < bluemoveCollections.length; j++) {
                                if (bluemoveCollections[j].attributes.name == userNftCollectionName) {
                                    result = true;
                                    break;
                                }
                            }
                            if (result) {
                                nftItem = {
                                    name: (_b = allNfts.current_token_ownerships[i].current_token_data) === null || _b === void 0 ? void 0 : _b.name,
                                    collection_name: (_c = allNfts.current_token_ownerships[i].current_token_data) === null || _c === void 0 ? void 0 : _c.collection_name,
                                    creator: (_d = allNfts.current_token_ownerships[i].current_token_data) === null || _d === void 0 ? void 0 : _d.creator_address,
                                    property_version: allNfts.current_token_ownerships[i].property_version,
                                    price: ""
                                };
                                blueMoveAccountNfts.push(nftItem);
                            }
                        }
                        return [2 /*return*/, blueMoveAccountNfts];
                }
            });
        });
    };
    NftTrader.prototype.blueMoveListForSell = function (item) {
        return __awaiter(this, void 0, void 0, function () {
            var payload, max_gas_amount, options, rawTx;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getPayloadForNftSell(item)];
                    case 1:
                        payload = _a.sent();
                        if (payload == 0)
                            return [2 /*return*/, "error"
                                // console.log("payload транзакции сгенерирован\n")
                            ];
                        return [4 /*yield*/, this.client.estimateMaxGasAmount(this.aptosAccount.address())];
                    case 2:
                        max_gas_amount = _a.sent();
                        options = {
                            max_gas_amount: max_gas_amount.toString(), expiration_timestamp_secs: (0, Utils_1.addHoursAndGetSeconds)(1).toString()
                        };
                        return [4 /*yield*/, this.client.generateTransaction(this.aptosAccount.address(), payload, options)
                            // console.log("транзакция сгенерирована\n")
                            // console.log("транзакция на листинг NFT подписана и отправлена: " + sendedTxHash + "\n")
                        ];
                    case 3:
                        rawTx = _a.sent();
                        return [4 /*yield*/, this.client.signAndSubmitTransaction(this.aptosAccount, rawTx)];
                    case 4: 
                    // console.log("транзакция сгенерирована\n")
                    // console.log("транзакция на листинг NFT подписана и отправлена: " + sendedTxHash + "\n")
                    return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    NftTrader.prototype.blueMoveDelistFromSale = function (item) {
        return __awaiter(this, void 0, void 0, function () {
            var payload, max_gas_amount, options, rawTx;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getPayloadForNftDelist(item)
                        // console.log("payload транзакции сгенерирован\n")
                    ];
                    case 1:
                        payload = _a.sent();
                        return [4 /*yield*/, this.client.estimateMaxGasAmount(this.aptosAccount.address())];
                    case 2:
                        max_gas_amount = _a.sent();
                        options = {
                            max_gas_amount: max_gas_amount.toString(), expiration_timestamp_secs: (0, Utils_1.addHoursAndGetSeconds)(1).toString()
                        };
                        return [4 /*yield*/, this.client.generateTransaction(this.aptosAccount.address(), payload, options)
                            // console.log("транзакция сгенерирована\n")
                            // console.log("транзакция на делистинг NFT подписана и отправлена: " + sendedTxHash + "\n")
                        ];
                    case 3:
                        rawTx = _a.sent();
                        return [4 /*yield*/, this.client.signAndSubmitTransaction(this.aptosAccount, rawTx)];
                    case 4: 
                    // console.log("транзакция сгенерирована\n")
                    // console.log("транзакция на делистинг NFT подписана и отправлена: " + sendedTxHash + "\n")
                    return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    NftTrader.prototype.getSellPriceByCollectionName = function (collectionName) {
        return __awaiter(this, void 0, void 0, function () {
            var collections, i, cheapestItem;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getCollections()];
                    case 1:
                        collections = _a.sent();
                        i = 0;
                        _a.label = 2;
                    case 2:
                        if (!(i < collections.length)) return [3 /*break*/, 5];
                        if (!(collections[i].attributes.name == collectionName)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.getCheapestItemFromCollection(collections[i])];
                    case 3:
                        cheapestItem = _a.sent();
                        if (cheapestItem == undefined)
                            return [2 /*return*/, "10000000"];
                        return [2 /*return*/, cheapestItem.price];
                    case 4:
                        i++;
                        return [3 /*break*/, 2];
                    case 5: 
                    // console.log("Коллекция не найдена или не торгуется на BlueMove\n")
                    return [2 /*return*/, "0"];
                }
            });
        });
    };
    NftTrader.prototype.getPayloadForNftDelist = function (item) {
        return __awaiter(this, void 0, void 0, function () {
            var moveFunction, _arguments;
            return __generator(this, function (_a) {
                moveFunction = "0xd1fd99c1944b84d1670a2536417e997864ad12303d19eac725891691b04d614e::marketplaceV2::batch_delist_script";
                _arguments = [
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
                ];
                return [2 /*return*/, { function: moveFunction, type_arguments: [], arguments: _arguments }];
            });
        });
    };
    NftTrader.prototype.getPayloadForNftSell = function (item) {
        return __awaiter(this, void 0, void 0, function () {
            var moveFunction, sellPrice, _arguments;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        moveFunction = "0xd1fd99c1944b84d1670a2536417e997864ad12303d19eac725891691b04d614e::marketplaceV2::batch_list_script";
                        return [4 /*yield*/, this.getSellPriceByCollectionName(item.collection_name)];
                    case 1:
                        sellPrice = _a.sent();
                        if (sellPrice == "0")
                            return [2 /*return*/, 0
                                // console.log("Цена для продажи получена\n")
                            ];
                        _arguments = [
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
                                Math.floor((0, Utils_1.calculatePercentage)(Number(sellPrice), 95)).toString()
                            ],
                            [
                                item.property_version
                            ]
                        ];
                        return [2 /*return*/, { function: moveFunction, type_arguments: [], arguments: _arguments }];
                }
            });
        });
    };
    NftTrader.prototype.searchOptimalCollectionForBuy = function (maxPrice) {
        return __awaiter(this, void 0, void 0, function () {
            var collections, i, cheapestItem;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getCollections()];
                    case 1:
                        collections = _a.sent();
                        i = 0;
                        _a.label = 2;
                    case 2:
                        if (!(i < collections.length)) return [3 /*break*/, 5];
                        if (!(Number(collections[i].attributes.floor_price) <= maxPrice)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.getCheapestItemFromCollection(collections[i])];
                    case 3:
                        cheapestItem = _a.sent();
                        if (cheapestItem == undefined)
                            return [3 /*break*/, 4];
                        if (collections[i].attributes.floor_price == cheapestItem.price)
                            return [2 /*return*/, collections[i]];
                        else {
                            if (Number(cheapestItem.price) <= maxPrice)
                                return [2 /*return*/, collections[i]];
                        }
                        _a.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/, 0];
                }
            });
        });
    };
    NftTrader.prototype.getCheapestItemFromCollection = function (collection) {
        return __awaiter(this, void 0, void 0, function () {
            var collectionId, collectionInfo, rawCheapestItem;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        collectionId = collection.id;
                        return [4 /*yield*/, (0, Utils_1.sendGetRequest)("https://aptos-mainnet-api.bluemove.net/api/market-items?filters[collection][id][$eq]=" + collectionId + "&filters[$or][0][status][$eq]=1&filters[price][$gte]=0&filters[price][$lte]=10000000000000000&sort[0]=price%3Aasc&pagination[page]=1&pagination[pageSize]=24")];
                    case 1:
                        collectionInfo = _a.sent();
                        rawCheapestItem = collectionInfo["data"][0];
                        if (rawCheapestItem == undefined)
                            return [2 /*return*/, undefined];
                        return [2 /*return*/, {
                                name: rawCheapestItem.attributes.name,
                                collection_name: rawCheapestItem.attributes.collection_name,
                                creator: rawCheapestItem.attributes.creator,
                                property_version: rawCheapestItem.attributes.property_version,
                                price: rawCheapestItem.attributes.price
                            }];
                }
            });
        });
    };
    NftTrader.prototype.getPayloadForNftBuy = function (item) {
        return __awaiter(this, void 0, void 0, function () {
            var moveFunction, _arguments;
            return __generator(this, function (_a) {
                moveFunction = "0xd1fd99c1944b84d1670a2536417e997864ad12303d19eac725891691b04d614e::marketplaceV2::batch_buy_script";
                _arguments = [
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
                ];
                return [2 /*return*/, { function: moveFunction, type_arguments: [], arguments: _arguments }];
            });
        });
    };
    NftTrader.prototype.getCollections = function () {
        return __awaiter(this, void 0, void 0, function () {
            var page1, page2, page3, collections, i, i, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, Utils_1.sendGetRequest)('https://aptos-mainnet-api.bluemove.net/api/collections?filters[name][$containsi]=&sort[0]=createdAt%3ADESC&pagination[page]=1&pagination[pageSize]=100')];
                    case 1:
                        page1 = _a.sent();
                        return [4 /*yield*/, (0, Utils_1.sendGetRequest)('https://aptos-mainnet-api.bluemove.net/api/collections?filters[name][$containsi]=&sort[0]=createdAt%3ADESC&pagination[page]=2&pagination[pageSize]=100')];
                    case 2:
                        page2 = _a.sent();
                        return [4 /*yield*/, (0, Utils_1.sendGetRequest)('https://aptos-mainnet-api.bluemove.net/api/collections?filters[name][$containsi]=&sort[0]=createdAt%3ADESC&pagination[page]=3&pagination[pageSize]=100')];
                    case 3:
                        page3 = _a.sent();
                        collections = [];
                        for (i = 0; i < page1["data"].length; i++)
                            collections.push(page1["data"][i]);
                        for (i = 0; i < page2["data"].length; i++)
                            collections.push(page2["data"][i]);
                        for (i = 0; i < page3["data"].length; i++)
                            collections.push(page3["data"][i]);
                        return [2 /*return*/, (0, Utils_1.shuffleArray)(collections)];
                }
            });
        });
    };
    return NftTrader;
}());
exports.NftTrader = NftTrader;
