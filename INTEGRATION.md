# Frontend-Backend Integration Guide

Complete backend integration for the Nosej Shop frontend.

## Setup

### 1. Backend (.env)
```
PORT=3000
MONGODB_URI=mongodb+srv://user:<password>@cluster.mongodb.net/nosej_shop
DATABASE_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

### 2. Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

### 3. Start Both Servers
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
npm run dev
```

## Architecture Changes

### Auth Flow
- **Old**: Login stored user in localStorage only
- **New**: Login calls backend `/auth/login`, receives JWT token
  - Token stored in localStorage as `shopwave-token`
  - Auto-added to all API requests via `Authorization: Bearer <token>` header
  - User data stored in localStorage as `shopwave-user`

### Data Persistence
| Feature | Old | New |
|---------|-----|-----|
| Auth | localStorage | Backend JWT |
| Products | DummyJSON API | Backend MongoDB |
| Cart | localStorage | Backend MongoDB |
| Wishlist | localStorage | Backend MongoDB |
| Orders | N/A | Backend MongoDB |

### API Layer Structure
```
src/config/api.js          → Base HTTP client with auth
src/services/api.js        → API methods (products, auth, cart, etc.)
src/context/AuthContext    → Auth state + login/register
src/context/CartContext    → Cart state + backend sync
src/context/WishlistContext → Wishlist state + backend sync
src/hooks/useFetchProducts  → Product fetching with filters
src/hooks/useFetchProduct   → Single product fetching
```

### Key Files Modified

**API Configuration:**
- `src/config/api.js` — HTTP client with JWT token handling
- `src/services/api.js` — All API endpoints (products, auth, cart, wishlist, orders, users)

**Contexts (now use backend):**
- `src/context/AuthContext.jsx` — Register, login, logout with JWT
- `src/context/CartContext.jsx` — Backend cart syncing
- `src/context/WishlistContext.jsx` — Backend wishlist syncing

**Environment:**
- `.env` — Frontend API base URL
- `.env.example` — Template

## API Endpoints Used

### Authentication
```javascript
POST /auth/register
POST /auth/login
POST /auth/logout
```

### Products
```javascript
GET /products              // with ?category=, ?search=, ?sort=
GET /products/:id
GET /products/categories
```

### Cart (Protected)
```javascript
GET /cart
POST /cart                 // { productId, quantity }
PUT /cart/:productId       // { quantity }
DELETE /cart/:productId
DELETE /cart               // clear all
```

### Wishlist (Protected)
```javascript
GET /wishlist
POST /wishlist             // { productId }
DELETE /wishlist/:productId
```

### Orders (Protected)
```javascript
POST /orders               // { shippingAddress }
GET /orders/user
GET /orders/:id
```

### User Profile (Protected)
```javascript
GET /users/profile
PUT /users/profile
POST /users/change-password
DELETE /users/account
```

## Usage Examples

### Login
```javascript
import { useAuth } from './context/AuthContext';

function Login() {
  const { login, loading, error } = useAuth();

  const handleSubmit = async (email, password) => {
    try {
      await login(email, password);
      // Redirect to home
    } catch (err) {
      console.error(err.message);
    }
  };
}
```

### Add to Cart
```javascript
import { useCart } from './context/CartContext';

function ProductCard({ product }) {
  const { addItem, error } = useCart();

  const handleAddToCart = async () => {
    try {
      await addItem(product._id, 1);
    } catch (err) {
      console.error(err);
    }
  };
}
```

### Fetch Products with Filters
```javascript
import { useFetchProducts } from './hooks/useFetchProducts';

function Shop() {
  const { products, loading } = useFetchProducts({
    category: 'nosej',
    search: 'shirt',
    sort: 'price-asc'
  });
}
```

## Error Handling

All API calls throw errors with structure:
```javascript
{
  message: "Error message",
  status: 400,
  data: { success: false, message: "..." }
}
```

Catch and handle:
```javascript
try {
  await addToCart(productId, qty);
} catch (err) {
  const message = err.data?.message || err.message;
  console.error(message); // Show to user
}
```

## Testing Integration

1. **Test Auth**: Register → get JWT → stored in localStorage
2. **Test Products**: Browse shop → should fetch from backend
3. **Test Cart**: Login → add item → should sync with backend
4. **Test Wishlist**: Add product → wishlist syncs to backend
5. **Test Checkout**: Create order → appears in user's order history

## Troubleshooting

**"No token provided" error**
- Make sure you're logged in
- Check `shopwave-token` exists in localStorage

**"Product not found"
- Product ID format: backend uses MongoDB `_id` (ObjectId)
- Check Product model uses correct ID field

**CORS errors**
- Backend has CORS enabled (`cors()` middleware)
- Check `VITE_API_URL` matches backend URL

**401 Unauthorized on protected endpoints**
- Token may be expired (7-day expiry)
- Re-login to get new token

## Production Deployment

Update `.env` for production:
```
VITE_API_URL=https://api.nosej.shop/api
```

Backend production URL should match frontend API URL.
