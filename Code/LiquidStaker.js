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
exports.LiquidStaker = void 0;
var aptos_1 = require("aptos");
var Utils_1 = require("./Utils");
var tokenList_1 = require("./tokenList");
var LiquidStaker = /** @class */ (function () {
    function LiquidStaker(privateKey, client) {
        this.privateKey = privateKey;
        this.hexPrivateKey = new aptos_1.HexString(this.privateKey);
        this.account = new aptos_1.AptosAccount(this.hexPrivateKey.toUint8Array());
        this.client = client;
    }
    LiquidStaker.prototype.makeRandomStakeAction = function () {
        return __awaiter(this, void 0, void 0, function () {
            var stAPTbalance, tAPTbalance, txHash, action;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, Utils_1.getTokenBalance)(tokenList_1.tokenList[4].address, this.account, this.client)];
                    case 1:
                        stAPTbalance = _a.sent();
                        return [4 /*yield*/, (0, Utils_1.getTokenBalance)(tokenList_1.tokenList[5].address, this.account, this.client)];
                    case 2:
                        tAPTbalance = _a.sent();
                        if (!(stAPTbalance + tAPTbalance > 0)) return [3 /*break*/, 7];
                        action = (0, Utils_1.getRandomInt)(0, 1);
                        if (!action) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.randomUnStake(stAPTbalance, tAPTbalance)];
                    case 3:
                        txHash = _a.sent();
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, this.randomStake()];
                    case 5:
                        txHash = _a.sent();
                        _a.label = 6;
                    case 6: return [3 /*break*/, 9];
                    case 7: return [4 /*yield*/, this.randomStake()];
                    case 8:
                        txHash = _a.sent();
                        _a.label = 9;
                    case 9: return [2 /*return*/, txHash];
                }
            });
        });
    };
    LiquidStaker.prototype.randomUnStake = function (stAPTbalance, tAPTbalance) {
        return __awaiter(this, void 0, void 0, function () {
            var amountForDitto, amountForTortuga, txHash, action;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        amountForDitto = (0, Utils_1.getRandomInt)((0, Utils_1.calculatePercentage)(stAPTbalance, 60), (0, Utils_1.calculatePercentage)(stAPTbalance, 100));
                        amountForTortuga = (0, Utils_1.getRandomInt)((0, Utils_1.calculatePercentage)(tAPTbalance, 60), (0, Utils_1.calculatePercentage)(tAPTbalance, 100));
                        if (!(stAPTbalance > 0 && tAPTbalance > 0)) return [3 /*break*/, 5];
                        action = (0, Utils_1.getRandomInt)(0, 1);
                        if (!action) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.unstakeFromDittoFi(amountForDitto)];
                    case 1:
                        txHash = _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.unstakeFromTortuga(amountForTortuga)];
                    case 3:
                        txHash = _a.sent();
                        _a.label = 4;
                    case 4: return [3 /*break*/, 9];
                    case 5:
                        if (!(stAPTbalance > 0)) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.unstakeFromDittoFi(amountForDitto)];
                    case 6:
                        txHash = _a.sent();
                        return [3 /*break*/, 9];
                    case 7: return [4 /*yield*/, this.unstakeFromTortuga(amountForTortuga)];
                    case 8:
                        txHash = _a.sent();
                        _a.label = 9;
                    case 9: return [2 /*return*/, txHash];
                }
            });
        });
    };
    LiquidStaker.prototype.randomStake = function () {
        return __awaiter(this, void 0, void 0, function () {
            var APTbalance, amount, platformNum, sendedTxHash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, Utils_1.getTokenBalance)(tokenList_1.tokenList[0].address, this.account, this.client)];
                    case 1:
                        APTbalance = _a.sent();
                        amount = (0, Utils_1.getRandomInt)((0, Utils_1.calculatePercentage)(APTbalance, 20), (0, Utils_1.calculatePercentage)(APTbalance, 60));
                        platformNum = (0, Utils_1.getRandomInt)(1, 2);
                        if (!(platformNum == 1)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.stakeOnDittoFi(amount)];
                    case 2:
                        sendedTxHash = _a.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, this.stakeOnTortuga(amount)];
                    case 4:
                        sendedTxHash = _a.sent();
                        _a.label = 5;
                    case 5: return [2 /*return*/, sendedTxHash];
                }
            });
        });
    };
    LiquidStaker.prototype.stakeOnDittoFi = function (amount) {
        return __awaiter(this, void 0, void 0, function () {
            var payload, max_gas_amount, options, rawTx, sendedTxHash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        payload = this.getPayloadForStakeOnDittoFi(amount);
                        return [4 /*yield*/, this.client.estimateMaxGasAmount(this.account.address())];
                    case 1:
                        max_gas_amount = _a.sent();
                        options = {
                            max_gas_amount: max_gas_amount.toString(), expiration_timestamp_secs: (0, Utils_1.addHoursAndGetSeconds)(1).toString()
                        };
                        return [4 /*yield*/, this.client.generateTransaction(this.account.address(), payload, options)
                            // console.log("транзакция сгенерирована\n")
                        ];
                    case 2:
                        rawTx = _a.sent();
                        return [4 /*yield*/, this.client.signAndSubmitTransaction(this.account, rawTx)
                            // console.log("транзакция на стейкинг в DittoFi подписана и отправлена: " + sendedTxHash + "\n")
                        ];
                    case 3:
                        sendedTxHash = _a.sent();
                        // console.log("транзакция на стейкинг в DittoFi подписана и отправлена: " + sendedTxHash + "\n")
                        return [2 /*return*/, sendedTxHash];
                }
            });
        });
    };
    LiquidStaker.prototype.unstakeFromDittoFi = function (amount) {
        return __awaiter(this, void 0, void 0, function () {
            var stAPTbalance, payload, max_gas_amount, options, rawTx, sendedTxHash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, Utils_1.getTokenBalance)(tokenList_1.tokenList[4].address, this.account, this.client)];
                    case 1:
                        stAPTbalance = _a.sent();
                        if (amount > stAPTbalance)
                            amount = stAPTbalance;
                        payload = this.getPayloadForUnstakeFromDittoFi(amount);
                        return [4 /*yield*/, this.client.estimateMaxGasAmount(this.account.address())];
                    case 2:
                        max_gas_amount = _a.sent();
                        options = {
                            max_gas_amount: max_gas_amount.toString(), expiration_timestamp_secs: (0, Utils_1.addHoursAndGetSeconds)(1).toString()
                        };
                        return [4 /*yield*/, this.client.generateTransaction(this.account.address(), payload, options)
                            // console.log("транзакция сгенерирована\n")
                        ];
                    case 3:
                        rawTx = _a.sent();
                        return [4 /*yield*/, this.client.signAndSubmitTransaction(this.account, rawTx)
                            // console.log("транзакция на анстейкинг из DittoFi подписана и отправлена: " + sendedTxHash + "\n")
                        ];
                    case 4:
                        sendedTxHash = _a.sent();
                        // console.log("транзакция на анстейкинг из DittoFi подписана и отправлена: " + sendedTxHash + "\n")
                        return [2 /*return*/, sendedTxHash];
                }
            });
        });
    };
    LiquidStaker.prototype.getPayloadForUnstakeFromDittoFi = function (amount) {
        var moveFunction = "0xd11107bdf0d6d7040c6c0bfbdecb6545191fdf13e8d8d259952f53e1713f61b5::ditto_staking::instant_unstake";
        var _arguments = [amount.toString()];
        var payload = { function: moveFunction, type_arguments: [], arguments: _arguments };
        return payload;
    };
    LiquidStaker.prototype.getPayloadForStakeOnDittoFi = function (amount) {
        var moveFunction = "0xd11107bdf0d6d7040c6c0bfbdecb6545191fdf13e8d8d259952f53e1713f61b5::ditto_staking::stake_aptos";
        var _arguments = [amount.toString()];
        var payload = { function: moveFunction, type_arguments: [], arguments: _arguments };
        return payload;
    };
    LiquidStaker.prototype.stakeOnTortuga = function (amount) {
        return __awaiter(this, void 0, void 0, function () {
            var payload, max_gas_amount, options, rawTx, sendedTxHash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        payload = this.getPayloadForStakeOnTortuga(amount);
                        return [4 /*yield*/, this.client.estimateMaxGasAmount(this.account.address())];
                    case 1:
                        max_gas_amount = _a.sent();
                        options = {
                            max_gas_amount: max_gas_amount.toString(), expiration_timestamp_secs: (0, Utils_1.addHoursAndGetSeconds)(1).toString()
                        };
                        return [4 /*yield*/, this.client.generateTransaction(this.account.address(), payload, options)
                            // console.log("транзакция сгенерирована\n")
                        ];
                    case 2:
                        rawTx = _a.sent();
                        return [4 /*yield*/, this.client.signAndSubmitTransaction(this.account, rawTx)
                            // console.log("транзакция на стейкинг в Tortuga подписана и отправлена: " + sendedTxHash + "\n")
                        ];
                    case 3:
                        sendedTxHash = _a.sent();
                        // console.log("транзакция на стейкинг в Tortuga подписана и отправлена: " + sendedTxHash + "\n")
                        return [2 /*return*/, sendedTxHash];
                }
            });
        });
    };
    LiquidStaker.prototype.unstakeFromTortuga = function (amount) {
        return __awaiter(this, void 0, void 0, function () {
            var tAPTbalance, payload, max_gas_amount, options, rawTx, sendedTxHash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, Utils_1.getTokenBalance)(tokenList_1.tokenList[5].address, this.account, this.client)];
                    case 1:
                        tAPTbalance = _a.sent();
                        if (amount > tAPTbalance)
                            amount = tAPTbalance;
                        payload = this.getPayloadForUnstakeFromTortuga(amount);
                        return [4 /*yield*/, this.client.estimateMaxGasAmount(this.account.address())];
                    case 2:
                        max_gas_amount = _a.sent();
                        options = {
                            max_gas_amount: max_gas_amount.toString(), expiration_timestamp_secs: (0, Utils_1.addHoursAndGetSeconds)(1).toString()
                        };
                        return [4 /*yield*/, this.client.generateTransaction(this.account.address(), payload, options)
                            // console.log("транзакция сгенерирована\n")
                        ];
                    case 3:
                        rawTx = _a.sent();
                        return [4 /*yield*/, this.client.signAndSubmitTransaction(this.account, rawTx)
                            // console.log("транзакция на анстейкинг из Tortuga подписана и отправлена: " + sendedTxHash + "\n")
                        ];
                    case 4:
                        sendedTxHash = _a.sent();
                        // console.log("транзакция на анстейкинг из Tortuga подписана и отправлена: " + sendedTxHash + "\n")
                        return [2 /*return*/, sendedTxHash];
                }
            });
        });
    };
    LiquidStaker.prototype.getPayloadForUnstakeFromTortuga = function (amount) {
        var moveFunction = "0xbd35135844473187163ca197ca93b2ab014370587bb0ed3befff9e902d6bb541::amm::swap_exact_coin_for_coin_with_signer";
        var type_arguments = [
            "0x84d7aeef42d38a5ffc3ccef853e1b82e4958659d16a7de736a29c55fbbeb0114::staked_aptos_coin::StakedAptosCoin",
            "0x1::aptos_coin::AptosCoin"
        ];
        var _arguments = [amount.toString(), "0"];
        var payload = { function: moveFunction, type_arguments: type_arguments, arguments: _arguments };
        return payload;
    };
    LiquidStaker.prototype.getPayloadForStakeOnTortuga = function (amount) {
        var moveFunction = "0x8f396e4246b2ba87b51c0739ef5ea4f26515a98375308c31ac2ec1e42142a57f::stake_router::stake";
        var _arguments = [amount.toString()];
        var payload = { function: moveFunction, type_arguments: [], arguments: _arguments };
        return payload;
    };
    return LiquidStaker;
}());
exports.LiquidStaker = LiquidStaker;
