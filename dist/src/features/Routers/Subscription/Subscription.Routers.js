"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Subscription_Controller_1 = require("../../Controller/Subscription/Subscription.Controller");
const router = (0, express_1.Router)();
const subscriptionController = new Subscription_Controller_1.SubscriptionController();
router.get("/data", subscriptionController.getSubscriptionData);
router.post("/", subscriptionController.createSubscription);
exports.default = router;
//# sourceMappingURL=Subscription.Routers.js.map