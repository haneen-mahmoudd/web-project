# Glowing Backend

Backend API for the static Glowing frontend using:

- Node.js + Express
- LowDB (`database.json`)
- JWT Authentication
- Basic order/booking flow for products

## 1) Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and set a secure `JWT_SECRET`.

## 2) Run

```bash
npm run dev
```

The API will run on: `http://localhost:5000` by default.

## 3) Available APIs

### Health

- `GET /api/health`

### Auth

- `POST /api/auth/register`
  - body: `{ "name": "Hossam", "email": "h@example.com", "password": "123456" }`
- `POST /api/auth/login`
  - body: `{ "email": "h@example.com", "password": "123456" }`

### Products

- `GET /api/products`
- `GET /api/products/:id`

### Orders (requires Bearer token)

- `POST /api/orders`
  - body:
    ```json
    {
      "items": [
        { "productId": 1, "quantity": 2 },
        { "productId": 2, "quantity": 1 }
      ],
      "address": "Cairo, Egypt",
      "phone": "01000000000",
      "paymentMethod": "cash_on_delivery"
    }
    ```
- `GET /api/orders/my`

## 4) Suggested Frontend Integration

Set your frontend requests to call:

- `http://localhost:5000/api/products` to load products
- `http://localhost:5000/api/auth/*` for register/login
- `http://localhost:5000/api/orders` for placing orders

Include this header for private endpoints:

```http
Authorization: Bearer <token>
```
