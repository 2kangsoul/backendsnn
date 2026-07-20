import { Router } from "express";
import { AnalyticController } from "../../Controller/SiteAnalytics/analytic.controller";

export class AnalyticRouter {
  private router: Router;
  private analyticController: AnalyticController;

  constructor() {
    this.analyticController = new AnalyticController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get("/pageviews", this.analyticController.getPageviews);
  }

  getRouter(): Router {
    return this.router;
  }
}
