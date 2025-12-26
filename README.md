# Fin-Track

A comprehensive personal finance management application built with modern web technologies. Track your income, expenses, savings goals, and financial progress with an intuitive dashboard and powerful analytics.

## 🚀 Features

### Core Functionality

- **Transaction Management**: Track income and expenses across multiple categories
- **Budget Planning**: Set and monitor monthly budgets with visual progress indicators
- **Multi-Currency Support**: Handle transactions in different currencies with conversion capabilities
- **Recurring Transactions**: Set up automatic recurring payments with excluded dates
- **Category Management**: Organize transactions with customizable categories and icons

### Financial Categories

- **Income**: Paycheck, Investment
- **Expenses**: Food, Rent, Transport, Healthcare, Utilities, Subscriptions, Family
- **Financial**: Credit Card, Debt, Loan, Savings

### Dashboard & Analytics

- **Visual Progress Tracking**: Circular progress indicators for payment completion
- **Interactive Charts**: Bar charts and analytics for spending patterns
- **Monthly Overview**: Balance, extra money, and category-wise breakdowns
- **Historical Data**: View trends and patterns over time
- **Date Range Filtering**: Analyze data by month, year, or custom periods

### User Experience

- **Responsive Design**: Optimized for desktop and mobile devices
- **Internationalization**: Support for 16 languages (English, Spanish, French, German, Arabic, Chinese, Japanese, and more)
- **Real-time Updates**: Live data synchronization
- **Dark/Light Theme**: Toggle between themes
- **Accessibility**: Built with accessibility best practices

## 🛠 Tech Stack

### Frontend

- **Framework**: Next.js 15 with React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: HeroUI, Radix UI
- **State Management**: Redux Toolkit
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Forms**: React Hook Form with Zod validation
- **Internationalization**: next-intl

### Backend

- **Runtime**: Node.js with Express.js 5
- **Database**: MongoDB
- **Language**: TypeScript
- **API**: RESTful API with proper error handling

### Development Tools

- **Package Manager**: npm with workspaces
- **Linting**: ESLint with TypeScript support
- **Code Formatting**: Prettier
- **Git Hooks**: Husky with lint-staged
- **Development**: Hot reload with nodemon

## 📁 Project Structure

```
fin-track/
├── packages/
│   ├── api/                    # Backend API server
│   │   ├── src/
│   │   │   ├── controllers/   # API route handlers
│   │   │   ├── middleware/    # Express middleware
│   │   │   ├── models/        # Data models
│   │   │   ├── routes/        # API route definitions
│   │   │   ├── services/      # Business logic
│   │   │   ├── types/         # TypeScript type definitions
│   │   │   └── utilities/     # Helper functions
│   │   └── package.json
│   └── web/                   # Frontend Next.js application
│       ├── app/               # Next.js app directory
│       │   ├── dashboard/     # Dashboard pages and components
│       │   ├── categories/    # Category management
│       │   ├── transactions/  # Transaction management
│       │   └── charts/        # Analytics and charts
│       ├── components/        # Reusable UI components
│       ├── lib/               # Utilities and configurations
│       ├── providers/         # React context providers
│       ├── services/          # API service functions
│       └── types/             # TypeScript type definitions
├── shared/                    # Shared utilities and types
│   ├── constants/            # Shared constants
│   ├── mockData/             # Mock data for development
│   ├── types/                # Shared TypeScript types
│   └── utilities/            # Shared utility functions
└── package.json              # Root package.json with workspaces
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- MongoDB installed locally

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/DJPajares/fin-track.git
   cd fin-track
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   Create `.env` files in both `packages/api` and `packages/web` directories:

   **packages/api/.env**

   ```env
   DATABASE_URL="mongodb://localhost:27017/fintrack"
   PORT=3001
   JWT_SECRET=your_jwt_secret_here
   JWT_EXPIRES_IN=7d
   ```

   **packages/web/.env.local**

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   NEXT_PUBLIC_USE_MOCKED_DATA=false
   ```

4. **Start MongoDB**

   In a new terminal window, start the MongoDB server in the background:

   ```bash
   mongod --dbpath ~/mongodb/data > ~/mongodb/mongod.log 2>&1 &
   ```

   This command:
   - `mongod --dbpath ~/mongodb/data`: Starts MongoDB with your local data directory
   - `> ~/mongodb/mongod.log`: Redirects output to a log file
   - `2>&1`: Captures errors as well
   - `&`: Runs the process in the background

   To verify MongoDB is running:

   ```bash
   ps aux | grep mongod
   ```

   You should see the mongod process listed. MongoDB will be running on `localhost:27017`.

   To stop MongoDB later:

   ```bash
   pkill mongod
   ```

5. **Start Development Servers**

   **Terminal 2 - Backend API**

   ```bash
   npm run api
   ```

   **Terminal 3 - Frontend**

   ```bash
   npm run dev
   ```

6. **Open the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

### Available Scripts

```bash
# Development
npm run dev          # Start frontend development server
npm run api          # Start backend development server

# Build
npm run build        # Build frontend for production

# Code Quality
npm run lint         # Run ESLint
npm run prettier     # Format code with Prettier
```

## 🌐 Internationalization

The application supports 16 languages:

- English (en)
- Spanish (es)
- French (fr)
- German (de)
- Arabic (ar)
- Chinese (zh)
- Japanese (ja)
- Korean (ko)
- Hindi (hi)
- Indonesian (id)
- Italian (it)
- Korean (ko)
- Malay (ms)
- Russian (ru)
- Thai (th)
- Turkish (tr)
- Vietnamese (vi)

## 📊 Database Schema

The application uses MongoDB with the following main entities:

- **Type**: Transaction types (Income/Expense)
- **Category**: Transaction categories with icons
- **Currency**: Supported currencies
- **Log**: Individual transactions
- **Recurring**: Recurring transaction definitions

## 🔧 Configuration

### Mock Data Mode

For development or demo purposes, you can enable mock data mode by setting:

```env
NEXT_PUBLIC_USE_MOCKED_DATA=true
```

This will use predefined mock data instead of making API calls.

### Currency Configuration

Supported currencies and their formatting are configured in the shared constants.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions, please open an issue in the repository.

---

**Fin-Track** - Take control of your financial future with intelligent tracking and insights.
