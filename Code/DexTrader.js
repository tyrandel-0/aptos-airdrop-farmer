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
exports.DexTrader = void 0;
var aptos_1 = require("aptos");
var router_1 = require("./abis/PancakeSwap/router");
var tokenList_1 = require("./tokenList");
var Utils_1 = require("./Utils");
var DexTrader = /** @class */ (function () {
    function DexTrader(privateKey, client) {
        this.privateKey = privateKey;
        this.hexPrivateKey = new aptos_1.HexString(this.privateKey);
        this.account = new aptos_1.AptosAccount(this.hexPrivateKey.toUint8Array());
        this.walletAddress = this.account.address();
        this.client = client;
    }
    DexTrader.prototype.makeRandomSwap = function () {
        return __awaiter(this, void 0, void 0, function () {
            var fromToken, toToken, amount, accountTokens, i, tokenBalance, fromTokenBalance, dexNum, sendedTxHash, regTokenTx, txResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        accountTokens = [];
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < tokenList_1.tokenList.length)) return [3 /*break*/, 4];
                        return [4 /*yield*/, (0, Utils_1.getTokenBalance)(tokenList_1.tokenList[i].address, this.account, this.client)];
                    case 2:
                        tokenBalance = _a.sent();
                        if (tokenBalance > 0)
                            accountTokens.push(tokenList_1.tokenList[i]);
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4:
                        fromToken = accountTokens[(0, Utils_1.getRandomInt)(0, accountTokens.length - 1)];
                        while (true) {
                            //если имеется только APT берем любой токен кроме APT
                            if (accountTokens.length == 1 && accountTokens[0] == tokenList_1.tokenList[0]) {
                                toToken = tokenList_1.tokenList[(0, Utils_1.getRandomInt)(1, tokenList_1.tokenList.length - 1)];
                            }
                            else {
                                toToken = tokenList_1.tokenList[(0, Utils_1.getRandomInt)(0, tokenList_1.tokenList.length - 1)];
                            }
                            if (toToken.address != fromToken.address)
                                break;
                        }
                        return [4 /*yield*/, (0, Utils_1.getTokenBalance)(fromToken.address, this.account, this.client)];
                    case 5:
                        fromTokenBalance = _a.sent();
                        if (fromToken == tokenList_1.tokenList[0]) {
                            amount = (0, Utils_1.getRandomInt)((0, Utils_1.calculatePercentage)(fromTokenBalance, 10), (0, Utils_1.calculatePercentage)(fromTokenBalance, 70));
                        }
                        else {
                            amount = (0, Utils_1.getRandomInt)((0, Utils_1.calculatePercentage)(fromTokenBalance, 10), fromTokenBalance);
                        }
                        dexNum = (0, Utils_1.getRandomInt)(1, 2);
                        if (!(dexNum == 1)) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.pancakeSwap(fromToken, toToken, amount)];
                    case 6:
                        sendedTxHash = _a.sent();
                        return [3 /*break*/, 13];
                    case 7:
                        if (!!accountTokens.includes(toToken)) return [3 /*break*/, 11];
                        return [4 /*yield*/, this.registerToken(toToken)];
                    case 8:
                        regTokenTx = _a.sent();
                        return [4 /*yield*/, this.client.waitForTransactionWithResult(regTokenTx)];
                    case 9:
                        txResult = (_a.sent()).success;
                        if (!!txResult) return [3 /*break*/, 11];
                        return [4 /*yield*/, this.pancakeSwap(fromToken, toToken, amount)];
                    case 10: return [2 /*return*/, _a.sent()];
                    case 11: return [4 /*yield*/, this.liquidSwap(fromToken, toToken, amount)];
                    case 12:
                        sendedTxHash = _a.sent();
                        _a.label = 13;
                    case 13: return [2 /*return*/, sendedTxHash];
                }
            });
        });
    };
    DexTrader.prototype.registerToken = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            var txPayload, max_gas_amount, options, rawTX;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        txPayload = this.getPayloadForRegisterToken(token);
                        return [4 /*yield*/, this.client.estimateMaxGasAmount(this.account.address())];
                    case 1:
                        max_gas_amount = _a.sent();
                        options = {
                            max_gas_amount: max_gas_amount.toString(), expiration_timestamp_secs: (0, Utils_1.addHoursAndGetSeconds)(1).toString()
                        };
                        return [4 /*yield*/, this.client.generateTransaction(this.walletAddress, txPayload, options)];
                    case 2:
                        rawTX = _a.sent();
                        return [4 /*yield*/, this.client.signAndSubmitTransaction(this.account, rawTX)];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DexTrader.prototype.pancakeSwap = function (fromToken, toToken, amount) {
        return __awaiter(this, void 0, void 0, function () {
            var swapAbi, swapAbiParam, txBuilder, txPayload, max_gas_amount, rawTX;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        swapAbi = router_1.pancakeSwapRouterAbis.swap_exact_input_abi;
                        swapAbiParam = new aptos_1.HexString(swapAbi).toUint8Array();
                        txBuilder = new aptos_1.TransactionBuilderABI([swapAbiParam]);
                        txPayload = txBuilder.buildTransactionPayload("0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa::router::swap_exact_input", [fromToken.address, toToken.address], [amount.toString(), ""]);
                        return [4 /*yield*/, this.client.estimateMaxGasAmount(this.account.address())];
                    case 1:
                        max_gas_amount = _a.sent();
                        return [4 /*yield*/, this.client.generateRawTransaction(this.walletAddress, txPayload, { maxGasAmount: max_gas_amount, expireTimestamp: (0, Utils_1.addHoursAndGetSeconds)(1) })
                            //console.log("транзакция сгенерирована\n")
                            //console.log("транзакция на обмен подписана и отправлена: " + sendedTxHash + "\n")
                        ];
                    case 2:
                        rawTX = _a.sent();
                        return [4 /*yield*/, this.client.signAndSubmitTransaction(this.account, rawTX)];
                    case 3: 
                    //console.log("транзакция сгенерирована\n")
                    //console.log("транзакция на обмен подписана и отправлена: " + sendedTxHash + "\n")
                    return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DexTrader.prototype.liquidSwap = function (fromToken, toToken, amount) {
        return __awaiter(this, void 0, void 0, function () {
            var txPayload, max_gas_amount, options, rawTX;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        txPayload = this.getPayloadForLiquidSwap2(fromToken, toToken, amount);
                        return [4 /*yield*/, this.client.estimateMaxGasAmount(this.account.address())];
                    case 1:
                        max_gas_amount = _a.sent();
                        options = {
                            max_gas_amount: max_gas_amount.toString(), expiration_timestamp_secs: (0, Utils_1.addHoursAndGetSeconds)(1).toString()
                        };
                        return [4 /*yield*/, this.client.generateTransaction(this.walletAddress, txPayload, options)
                            //console.log("транзакция сгенерирована\n")
                            //console.log("транзакция на обмен подписана и отправлена: " + sendedTxHash + "\n")
                        ];
                    case 2:
                        rawTX = _a.sent();
                        return [4 /*yield*/, this.client.signAndSubmitTransaction(this.account, rawTX)];
                    case 3: 
                    //console.log("транзакция сгенерирована\n")
                    //console.log("транзакция на обмен подписана и отправлена: " + sendedTxHash + "\n")
                    return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DexTrader.prototype.getPayloadForLiquidSwap1 = function (fromToken, toToken, amount) {
        var moveFunction = "0x190d44266241744264b964a37b8f09863167a12d3e70cda39376cfb4e3561e12::scripts::swap";
        var type_arguments = [fromToken.address, toToken.address, "0x190d44266241744264b964a37b8f09863167a12d3e70cda39376cfb4e3561e12::curves::Uncorrelated"];
        var _arguments = [amount.toString(), ""];
        return { function: moveFunction, type_arguments: type_arguments, arguments: _arguments };
    };
    DexTrader.prototype.getPayloadForLiquidSwap2 = function (fromToken, toToken, amount) {
        var moveFunction = "0x190d44266241744264b964a37b8f09863167a12d3e70cda39376cfb4e3561e12::scripts_v2::swap";
        var type_arguments = [fromToken.address, toToken.address, "0x190d44266241744264b964a37b8f09863167a12d3e70cda39376cfb4e3561e12::curves::Uncorrelated"];
        var _arguments = [amount.toString(), ""];
        return { function: moveFunction, type_arguments: type_arguments, arguments: _arguments };
    };
    DexTrader.prototype.getPayloadForRegisterToken = function (token) {
        var moveFunction = "0x1::managed_coin::register";
        var type_arguments = [
            token.address
        ];
        var _arguments = [];
        return { function: moveFunction, type_arguments: type_arguments, arguments: _arguments, };
    };
    return DexTrader;
}());
exports.DexTrader = DexTrader;
