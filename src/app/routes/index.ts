import { Router } from "express";
import { userRouter } from "../modules/user/user.route.js";
import { authRouter } from "../modules/auth/auth.route.js";
import { productRouter } from "../modules/product/product.route.js";
import { cartRouter } from "../modules/cart/cart.route.js";
import orderRouter from "../modules/order/order.route.js";
import { paymentRoutes } from "../modules/payment/payment.route.js";
import { imageRouter } from "../modules/image/image.route.js";
import { CategoryRoutes } from "../modules/category/category.route.js";

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
  {
    path: "/order",
    route: orderRouter,
  },
  {
    path: "/payment",
    route: paymentRoutes,
  },
  {
    path: "/image",
    route: imageRouter,
  },
  {
    path: "/categories",
    route: CategoryRoutes
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
