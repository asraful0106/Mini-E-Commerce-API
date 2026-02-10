import { Router } from "express";

const router = Router();

interface IRouter {
  path: string;
  route: Router;
}

const moduleRoutes: IRouter[] = [];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
