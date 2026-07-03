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
exports.OrderController = void 0;
const Order_Services_1 = require("../../Services/Order/Order.Services");
class OrderController {
    constructor() {
        this.orderService = new Order_Services_1.OrderService();
        this.getFinancials = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.orderService.getFinancialDashboardData();
                res.status(200).json({ success: true, data });
            }
            catch (error) {
                console.error("Error getFinancials:", error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
        // ✅ Tambahan baru
        this.getRecentOrders = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.orderService.getRecentOrders();
                res.status(200).json({ success: true, data });
            }
            catch (error) {
                console.error("Error getRecentOrders:", error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
        // ✅ Tambahan baru
        this.createOrder = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.orderService.createOrder(req.body);
                res.status(201).json({ success: true, data });
            }
            catch (error) {
                console.error("Error createOrder:", error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
}
exports.OrderController = OrderController;
//# sourceMappingURL=Order.Controller.js.map