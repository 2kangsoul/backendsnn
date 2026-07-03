"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticRouter = void 0;
const express_1 = require("express");
const analytic_controller_1 = require("../../Controller/SiteAnalytics/analytic.controller");
class AnalyticRouter {
    constructor() {
        this.analyticController = new analytic_controller_1.AnalyticController();
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get("/pageviews", this.analyticController.getPageviews);
        this.router.get("/sessions", this.analyticController.getTotalSessions); // ✅ Tambahan baru
    }
    getRouter() {
        return this.router;
    }
}
exports.AnalyticRouter = AnalyticRouter;
//# sourceMappingURL=analytic.router.js.map