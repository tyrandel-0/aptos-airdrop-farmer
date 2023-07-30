"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
var aptos_1 = require("aptos");
var NftTrader_1 = require("./NftTrader");
var Utils_1 = require("./Utils");
var LiquidStaker_1 = require("./LiquidStaker");
var DexTrader_1 = require("./DexTrader");
var fs = __importStar(require("fs"));
var config = readConfig();
var client = new aptos_1.AptosClient(config.nodeURL);
var walletOutputDataArr = [];
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var privateKeys, validWallets, i, aptosAccount, error_1, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    privateKeys = readPrivateKeysFromFile("privateKeys.txt");
                    validWallets = true;
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < privateKeys.length)) return [3 /*break*/, 6];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    aptosAccount = new aptos_1.AptosAccount(new aptos_1.HexString(privateKeys[i]).toUint8Array());
                    return [4 /*yield*/, client.getAccountResources(aptosAccount.address())];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    console.log("Wrong private keys are entered or there are no funds on the wallet: ");
                    console.log(i + ") " + privateKeys[i]);
                    return [2 /*return*/];
                case 5:
                    i++;
                    return [3 /*break*/, 1];
                case 6:
                    for (i = 0; i < privateKeys.length; i++) {
                        walletOutputDataArr.push({
                            session_duration_min: 0,
                            progress: "0/0",
                            current_tx_type: "",
                            last_tx_result: "",
                            min_until_next_tx: 0,
                            status: 0
                        });
                        session((0, Utils_1.getRandomInt)(config.txAmountMin, config.txAmountMax), privateKeys[i], i, config.timeSleepMin, config.timeSleepMax);
                    }
                    renderOutput();
                    return [2 /*return*/];
            }
        });
    });
}
main();
function session(txAmount, privateKey, walletID, timeSleepMin, timeSleepMax) {
    return __awaiter(this, void 0, void 0, function () {
        var dexTrader, liquidStaker, nftTrader, msDelayArr, totalDelay, i, randomSleep, i, txType, txHash, _a, txResult;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    dexTrader = new DexTrader_1.DexTrader(privateKey, client);
                    liquidStaker = new LiquidStaker_1.LiquidStaker(privateKey, client);
                    nftTrader = new NftTrader_1.NftTrader(privateKey, client);
                    msDelayArr = [];
                    totalDelay = 0;
                    for (i = 0; i < txAmount; i++) {
                        randomSleep = (0, Utils_1.getRandomInt)(timeSleepMin, timeSleepMax);
                        msDelayArr.push(randomSleep);
                        totalDelay += randomSleep;
                    }
                    walletOutputDataArr[walletID].session_duration_min = Number((totalDelay / 60000).toFixed(2));
                    walletOutputDataArr[walletID].progress = "0/" + txAmount;
                    i = 0;
                    _b.label = 1;
                case 1:
                    if (!(i < txAmount)) return [3 /*break*/, 15];
                    walletOutputDataArr[walletID].min_until_next_tx = Number((msDelayArr[i] / 60000).toFixed(2));
                    return [4 /*yield*/, (0, Utils_1.sleep)(msDelayArr[i])];
                case 2:
                    _b.sent();
                    txType = (0, Utils_1.getRandomInt)(1, 3);
                    txHash = void 0;
                    _a = txType;
                    switch (_a) {
                        case 1: return [3 /*break*/, 3];
                        case 2: return [3 /*break*/, 5];
                        case 3: return [3 /*break*/, 7];
                    }
                    return [3 /*break*/, 9];
                case 3:
                    walletOutputDataArr[walletID].current_tx_type = "DEX trading";
                    return [4 /*yield*/, dexTrader.makeRandomSwap()];
                case 4:
                    txHash = _b.sent();
                    return [3 /*break*/, 10];
                case 5:
                    walletOutputDataArr[walletID].current_tx_type = "NFT action";
                    return [4 /*yield*/, nftTrader.makeRandomNftAction(config.APTprice)];
                case 6:
                    txHash = _b.sent();
                    return [3 /*break*/, 10];
                case 7:
                    walletOutputDataArr[walletID].current_tx_type = "liquid staking action";
                    return [4 /*yield*/, liquidStaker.makeRandomStakeAction()];
                case 8:
                    txHash = _b.sent();
                    return [3 /*break*/, 10];
                case 9: return [3 /*break*/, 10];
                case 10:
                    if (!(txHash == "error")) return [3 /*break*/, 11];
                    walletOutputDataArr[walletID].last_tx_result = "Error when creating a TX";
                    return [3 /*break*/, 13];
                case 11: return [4 /*yield*/, client.waitForTransactionWithResult(txHash)];
                case 12:
                    txResult = (_b.sent()).success;
                    if (txResult) {
                        walletOutputDataArr[walletID].last_tx_result = "TX was successful";
                    }
                    else {
                        walletOutputDataArr[walletID].last_tx_result = "TX failed";
                    }
                    _b.label = 13;
                case 13:
                    walletOutputDataArr[walletID].progress = i + 1 + "/" + txAmount;
                    _b.label = 14;
                case 14:
                    i++;
                    return [3 /*break*/, 1];
                case 15:
                    walletOutputDataArr[walletID].status = 1;
                    return [2 /*return*/];
            }
        });
    });
}
function readPrivateKeysFromFile(filePath) {
    var privateKeys = [];
    try {
        var data = fs.readFileSync(filePath, 'utf-8');
        var lines = data.split('\n');
        lines.forEach(function (line) {
            var privateKey = line.trim();
            if (privateKey) {
                privateKeys.push(privateKey);
            }
        });
        return privateKeys;
    }
    catch (error) {
        console.error('Error while reading file:', error);
        return [];
    }
}
function readConfig() {
    var configPath = 'config.json';
    try {
        var data = fs.readFileSync(configPath, 'utf8');
        return JSON.parse(data);
    }
    catch (error) {
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
function printWalletsInfo() {
    console.clear();
    console.table(walletOutputDataArr);
    isProgramCompleted();
}
function renderOutput() {
    setInterval(printWalletsInfo, 500);
}
function isProgramCompleted() {
    for (var i = 0; i < walletOutputDataArr.length; i++) {
        if (walletOutputDataArr[i].status == 0)
            return;
    }
    process.exit();
}
