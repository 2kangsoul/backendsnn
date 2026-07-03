import { Router } from "express";
import { SubscriptionController } from "../../Controller/Subscription/Subscription.Controller";

const router = Router();
const subscriptionController = new SubscriptionController();

router.get("/data", subscriptionController.getSubscriptionData);

router.post("/", subscriptionController.createSubscription);

export default router;