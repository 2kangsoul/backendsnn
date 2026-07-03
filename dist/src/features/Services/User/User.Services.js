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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const User_Repositories_1 = require("../../Repositories/user/User.Repositories");
class UserService {
    constructor() {
        this.userRepository = new User_Repositories_1.UserRepository();
    }
    getMonthlyUsersData() {
        return __awaiter(this, void 0, void 0, function* () {
            const now = new Date();
            const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
            const currentMonth = yield this.userRepository.countUsersByDateRange(startOfCurrentMonth, now);
            const lastMonth = yield this.userRepository.countUsersByDateRange(startOfLastMonth, endOfLastMonth);
            let trendPercentage = 0;
            if (lastMonth === 0) {
                trendPercentage = currentMonth > 0 ? 100 : 0;
            }
            else {
                trendPercentage = ((currentMonth - lastMonth) / lastMonth) * 100;
            }
            return {
                total: currentMonth,
                trend: `${Math.abs(trendPercentage).toFixed(1)}%`,
                isPositive: trendPercentage >= 0,
            };
        });
    }
}
exports.UserService = UserService;
//# sourceMappingURL=User.Services.js.map