# Mini E-Commerce Backend API

A lightweight **TypeScript + Express + MongoDB** REST API for a minimal e-commerce application.  
Supports user authentication, product management, shopping cart, order placement, and basic payment initialization flow.

**Current status**: MVP / Learning / Portfolio project

## Features

- JWT + Refresh token authentication
- Role-based access (User, Admin, Super Admin)
- User registration, profile update
- Product CRUD (with multiple image upload)
- Shopping cart (add/update/remove/clear/checkout)
- Order creation from cart + order history
- Basic payment initiation endpoints (success/fail/cancel hooks)
- Input validation with **Zod**
- Protected routes with middleware

## Tech Stack

| Category             | Technology / Library                                 | Purpose                              |
|----------------------|------------------------------------------------------|--------------------------------------|
| Runtime              | Node.js                                              | JavaScript runtime                   |
| Language             | TypeScript                                           | Type safety                          |
| Web Framework        | Express 5                                            | API routing & middleware             |
| Database             | MongoDB + Mongoose 8                                 | NoSQL document database & ODM        |
| Authentication       | JWT, jsonwebtoken, bcryptjs, passport-local          | Secure auth & password hashing       |
| Validation           | Zod                                                  | Schema validation & type inference   |
| File Upload          | Multer (memory storage)                              | Handle product/user image uploads    |
| Sessions/Cookies     | cookie-parser, express-session                       | (optional / refresh token support)   |
| HTTP Utilities       | http-status-codes, cors, axios                       | Status codes, cross-origin, requests |
| Development          | nodemon, ts-node, @types/* packages                  | Fast dev workflow & type defs        |

## Project Structure (assumed / typical)
```
mini-e-commerce/
├── src/
│   ├── config/               # multer, db config, env
│   ├── controllers/          # auth.controller, product.controller, etc.
│   ├── middlewares/          # auth, role check, zod validation
│   ├── models/               # Mongoose schemas (User, Product, Cart, Order, ...)
│   ├── routes/               # auth.routes.ts, cart.routes.ts, ...
│   ├── interfaces/           # UserRole, custom interfaces
│   ├── app.ts                # Express app setup
│   ├── server.ts             # Express server start
├── .env                      # PORT, MONGO_URI, JWT_SECRET, ...
├── package.json
└── tsconfig.json
```

## Setup Instructions

### Prerequisites

- Node.js ≥ 20
- MongoDB (local or Atlas)
- (optional) MongoDB Compass / mongosh for inspection

### Steps

1. **Clone the repository**

```bash
git clone https://github.com/asraful0106/Mini-E-Commerce-API
cd mini-e-commerce
```

2. **Install dependencies**

```
npm install
```

3. **Create .env file in root**
```
PORT=5000
# DB_URL=mongodb+srv://<user_name>:<user_password>@cluster0.zpodq7w.mongodb.net/tour_db?retryWrites=true&w=majority&appName=Cluster0
DB_URL=mongodb://localhost:27017/mini_e_com
NODE_ENV=Development
BCRYPT_SALT_ROUND=10

# Super Admin
SUPER_ADMIN=Super Admin
SUPER_ADMIN_EMAIL=asrafulapf@gmail.com
SUPER_ADMIN_PASSWORD=1234
#JWT
JWT_SECRET=5nIbK2v7C6H0toXylb--0stUewDOg_IBHwbzC9vMe3rBnDh7FLswB9dOF7HHiG9J
JWT_ACCESS_EXPIRES=1d
JWT_REFRESH_SECRET=2v7C6H0toXylb--0stUewDOg_IBHwbzC9vMe3r
JWT_REFRESH_EXPIRES=30d

# Express session
EXPRESS_SESSION_SECRET=expressSession@

# Storage Provider
PROVIDER=LOCAL # LOCAL, CLOUDINARY, S3

# sslCommerz
SSL_STORE_ID="ap698a82966d"
SSL_STORE_PASS="ap698e92966d@ssl"
SSL_PAYMENT_API=" https://sandbox.sslcommerz.com/gwprocess/v4/api.php"
SSL_VALIDATION_API="https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php"

# SSL Commerz BACKEND URLs
SSL_SUCCESS_BACKEND_URL="http://localhost:5000/api/v1/payment/success"
SSL_FAIL_BACKEND_URL="http://localhost:5000/api/v1/payment/fail"
SSL_CANCEL_BACKEND_URL="http://localhost:5000/api/v1/payment/cancel"

# SSL Commerz FRONTEND URLs
SSL_SUCCESS_FRONTEND_URL="http://localhost:5173/payment/success"
SSL_FAIL_FRONTEND_URL="http://localhost:5173/payment/fail"
SSL_CANCEL_FRONTEND_URL="http://localhost:5173/payment/cancel"
```
4. **Start development server (with auto-restart)**
```
bun --watch ./src/server.ts
```
5. **Recommended VS Code extensions**
* ESLint
* Prettier
* MongoDB for VS Code
* Error Lens
* Zod

# API Endpoints Overview
| Method | Full Route                            | Description                          | Auth | Role                |
|--------|---------------------------------------|--------------------------------------|------|---------------------|
| POST   | /api/v1/auth/register                 | Register new user                    | No   | —                   |
| POST   | /api/v1/auth/login                    | Login & get tokens                   | No   | —                   |
| POST   | /api/v1/auth/refresh-token            | Get new access token                 | Yes  | —                   |
| POST   | /api/v1/auth/logout                   | Clear refresh token                  | Yes  | —                   |
|--------|---------------------------------------|--------------------------------------|------|---------------------|
| GET    | /api/v1/cart/me                       | Get current user's cart              | Yes  | Any                 |
| POST   | /api/v1/cart/items                    | Add item to cart                     | Yes  | Any                 |
| PATCH  | /api/v1/cart/items/:productId         | Update quantity (0 = remove)         | Yes  | Any                 |
| DELETE | /api/v1/cart/items/:productId         | Remove item                          | Yes  | Any                 |
| DELETE | /api/v1/cart/clear                    | Empty cart                           | Yes  | Any                 |
| POST   | /api/v1/cart/checkout                 | Create order from cart               | Yes  | Any                 |
|--------|---------------------------------------|--------------------------------------|------|---------------------|
| POST   | /api/v1/orders                        | Create order (from cart)             | Yes  | Any                 |
| GET    | /api/v1/orders/my-orders              | List my orders                       | Yes  | Any                 |
| GET    | /api/v1/orders                        | List all orders (admin)              | Yes  | Admin / Super Admin |
| PATCH  | /api/v1/orders/:orderId/status        | Update order status                  | Yes  | Admin / Super Admin |
|--------|---------------------------------------|--------------------------------------|------|---------------------|
| POST   | /api/v1/products                      | Create product + images              | Yes  | Admin / Super Admin |
| PATCH  | /api/v1/products/:id                  | Update product                       | Yes  | Admin / Super Admin |
| DELETE | /api/v1/products/:id                  | Delete product                       | Yes  | Admin / Super Admin |
|--------|---------------------------------------|--------------------------------------|------|---------------------|
| POST   | /api/v1/payment/init-payment/:orderId | Initialize payment for an order      | Yes  | Any                 |
| POST   | /api/v1/payment/success               | Payment success callback             | No   | —                   |
| POST   | /api/v1/payment/fail                  | Payment failure callback             | No   | —                   |
| POST   | /api/v1/payment/cancel                | Payment cancellation callback        | No   | —                   |

## Quick summary – grouped by resource

* Auth → /api/v1/auth/...
* Cart → /api/v1/cart/...
* Orders → /api/v1/orders/...
* Products (admin only) → /api/v1/products/...
* Payment callbacks → /api/v1/payment/...

# Database Schema / Collections (Inferred)
No visual ER diagram is included in the repo (yet).
Here are the main inferred Mongoose collections and relationships:

* Users
  ```
      const authProviderSchema = new Schema<IAuthProvider>(
      {
         provider: {
            type: String,
            required: true,
         },
         providerId: {
            type: String,
            required: true,
         },
      },
      {
         versionKey: false,
         _id: false,
      },
         );

         const userImageSchema = new Schema<IUserImage>(
         {
            url: { type: String },
            provider: {
               type: String,
               enum: Object.values(Provider),
            },
         },
         {
            versionKey: false,
            _id: false,
         },
         );

      const userSchema = new Schema<IUser>(
      {
         name: { type: String, required: true, trim: true },

         phone: { type: String, default: null, trim: true },

         email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
         },

         password: { type: String },

         address: { type: String, default: null, trim: true },

         is_verified: { type: Boolean, default: false, required: true },

         role: {
            type: String,
            enum: Object.values(UserRole),
            default: UserRole.CUSTOMER,
            required: true,
         },

         cancelled_orders_count: {
            type: Number,
            default: 0,
            required: true,
            min: 0,
         },

         isDeleted: { type: Boolean, default: false },

         isActive: {
            type: String,
            enum: Object.values(IsActive),
            default: IsActive.ACTIVE,
         },

         image: {
            type: userImageSchema,
            default: null,
         },

         auths: {
            type: [authProviderSchema],
            default: [],
         },

         cart: {
            type: Schema.Types.ObjectId,
            ref: "Cart",
            default: null,
         },

         orders: [
            {
            type: Schema.Types.ObjectId,
            ref: "Order",
            default: [],
            },
         ],
      },
      {
         versionKey: false,
         timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
      },
      );

```

```
* Products
```
const ProductImageSchema = new Schema<IProductImage>(
  {
    url: { type: String, required: true },
    provider: { type: String, enum: Object.values(Provider) },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    versionKey: false,
  },
);

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, maxlength: 500 },
    slug: { type: String, unique: true, maxlength: 500 },
    price: { type: Number, required: true },
    stock_qty: { type: Number, default: 0 },
    reserved_qty: { type: Number, default: 0 },
    is_active: { type: Boolean, default: true },
    images: { type: [ProductImageSchema], default: [] },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    versionKey: false,
  },
);
```


* Carts (one per user)
```
const cartItemSchema = new Schema<ICartItem>(
  {
    product_id: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    unit_price: {
      type: Number,
      required: true,
      min: 0,
    },
    qty: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { _id: false, versionKey: false },
);

const cartSchema = new Schema<ICart>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // 1 cart per user
      index: true,
    },
    cart_item: {
      type: [cartItemSchema],
      default: [],
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  },
);
```

* Orders
```
const orderItemSchema = new Schema<IOrderItem>(
  {
    product_id: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    qty: { type: Number, required: true, min: 1 },
    total_price: { type: Number, required: true, min: 0 },
  },
  { _id: false, versionKey: false },
);

const orderSchema = new Schema<IOrder>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    payment_id: { type: Schema.Types.ObjectId, ref: "Payment", default: null },
    product_item: { type: [orderItemSchema], default: [] },
    status: {
      type: String,
      enum: Object.values(ORDER_STATUS),
      default: ORDER_STATUS.PENDING,
      required: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    versionKey: false,
  },
);

```

* Payments
```
const paymentSchema = new Schema<IPayment>(
  {
    order_id: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true,
    },
    transactionId: { type: String, required: true, unique: true },
    amount: { type: Number, required: true, min: 0 },
    paymentGateWayData: { type: Schema.Types.Mixed },
    invoiceUrl: { type: String },
    status: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.UNPAID,
      required: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    versionKey: false,
  },
);
```

# Key Architectural Decisions

* TypeScript everywhere — strong typing + better IDE support
* Zod for validation instead of Joi/Yup → schema → type inference
* JWT + refresh tokens — stateless auth + long-lived refresh
* Role-based authorization via custom middleware (checkAuth)
* One cart per user (not session-based) — persisted in DB
* Checkout = create order + clear cart — atomic-like via controller logic
* Multer memory storage — images processed in memory (later saved to cloud / disk)
* Separate routers for auth, cart, order, product, payment — modular
* No payment gateway integration yet — only dummy /init-payment + callback routes

# Assumptions Made

* Single currency (no multi-currency support)
* No categories / tags / search / filtering on products yet
* No reviews / ratings system
* Images are uploaded but not actually stored (you need cloud storage logic)
* No email verification, password reset, or OTP
* No pagination on orders/products lists
* Payment flow is mock / gateway placeholder (e.g. for Stripe/SSLCommerz later)
* Stock quantity is not decremented automatically on order creation (needs transaction logic)
* Refresh token is stored in cookie (httpOnly) — not in DB (stateless approach)
* No rate limiting, request logging, or comprehensive error handling yet
* All users can see their own orders; only admins see all

# Next Steps / Improvements

* Add proper image storage (Cloudinary / S3)
* Implement stock decrement + optimistic concurrency
* Add transaction support for checkout (mongoose sessions)
* Integrate real payment gateway (Stripe, bKash, SSLCommerz, etc.)
* Add product categories, search, filters
* Pagination + sorting on lists
* Proper refresh token rotation + DB storage (for security)
* Tests (Jest + Supertest)
* Docker + docker-compose
* API documentation (Swagger / Redoc)