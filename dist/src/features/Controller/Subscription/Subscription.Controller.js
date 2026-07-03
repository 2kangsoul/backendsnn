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
exports.SubscriptionController = void 0;
const Subscription_Services_1 = require("../../Services/Subscription/Subscription.Services");
class SubscriptionController {
    constructor() {
        this.subscriptionService = new Subscription_Services_1.SubscriptionService();
        this.getSubscriptionData = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.subscriptionService.getSubscriptionDashboardData();
                res.status(200).json({ success: true, data });
            }
            catch (error) {
                console.error("Error getSubscriptionData:", error);
                res
                    .status(500)
                    .json({ success: false, message: "Internal server error" });
            }
        });
        // ✅ Tambahan baru
        this.createSubscription = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { plan, status, userId, expiredAt } = req.body;
                const data = yield this.subscriptionService.createSubscription({
                    plan,
                    status,
                    userId,
                    expiredAt: expiredAt ? new Date(expiredAt) : null,
                });
                res.status(201).json({ success: true, data });
            }
            catch (error) {
                console.error("Error createSubscription:", error);
                res
                    .status(500)
                    .json({ success: false, message: "Internal server error" });
            }
        });
    }
}
exports.SubscriptionController = SubscriptionController;
//# sourceMappingURL=Subscription.Controller.js.map