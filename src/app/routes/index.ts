import { Router } from "express";
import { userRouter } from "../modules/user/user.route.js";
import { authRouter } from "../modules/auth/auth.route.js";
import { productRouter } from "../modules/product/product.route.js";
import { cartRouter } from "../modules/cart/cart.route.js";

const router = Router();

interface IRouter {
  path: string;
  route: Router;
}

const moduleRoutes: IRouter[] = [
  // For user
  {
    path: "/user",
    route: userRouter,
  },
  {
    path: "/auth",
    route: authRouter,
  },
  {
    path: "/product",
    route: productRouter,
  },
  {
    path: "/cart",
    route: cartRouter,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
