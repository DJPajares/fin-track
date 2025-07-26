# Authentication Setup Guide

## Environment Variables

Create a `.env` file in the `packages/api` directory with the following variables:

```env
# Database
DATABASE_URL=mongodb://localhost:27017/fintrack

# Server
PORT=3001

# JWT Secret (change this in production!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

## API Endpoints

### Authentication Endpoints

- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/profile` - Get user profile (protected)

### Protected Endpoints

All transaction endpoints now require authentication:

- `GET /api/v1/transactions` - Get user's transactions
- `POST /api/v1/transactions` - Create transaction
- `PUT /api/v1/transactions/:id` - Update transaction
- `DELETE /api/v1/transactions/:id` - Delete transaction

### Public Endpoints

These endpoints remain public (no authentication required):

- `GET /api/v1/currencies` - Get currencies
- `GET /api/v1/exchangeRates` - Get exchange rates
- `GET /api/v1/types` - Get transaction types

## Authentication Flow

1. User registers with email, password, firstName, lastName
2. User receives JWT token upon successful registration
3. User includes JWT token in Authorization header: `Bearer <token>`
4. All protected endpoints verify the token and attach user to request
5. User data is filtered by user ID automatically

## Security Features

- Password hashing with bcrypt (12 salt rounds)
- JWT tokens with 7-day expiration
- Email validation
- Password strength requirements (8+ chars, uppercase, lowercase, number)
- User account status checking
- Automatic user filtering for data access
