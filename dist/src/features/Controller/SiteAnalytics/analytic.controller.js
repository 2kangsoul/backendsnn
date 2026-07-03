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
exports.AnalyticController = void 0;
const siteAnalytics_Services_1 = require("../../Services/SiteAnalytics/siteAnalytics.Services");
class AnalyticController {
    constructor() {
        this.analyticService = new siteAnalytics_Services_1.AnalyticService();
        this.getPageviews = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.analyticService.getPageviewsDashboardData();
                res.status(200).json({ success: true, data });
            }
            catch (error) {
                console.error("Error getPageviews:", error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
        // ✅ Tambahan baru
        this.getTotalSessions = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.analyticService.getTotalSessionsData();
                res.status(200).json({ success: true, data });
            }
            catch (error) {
                console.error("Error getTotalSessions:", error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
}
exports.AnalyticController = AnalyticController;
//# sourceMappingURL=analytic.controller.js.map