# Grip Invest - Mini Investment Platform

A full-stack investment platform built with Node.js/Express backend and Next.js frontend, featuring AI-powered recommendations and insights using Groq API.

## 🚀 Features

### Backend
- **User Authentication**: JWT-based auth with password hashing, signup/login, and password reset
- **Investment Products CRUD**: Admin can manage products with AI-generated descriptions
- **Investment Management**: Users can invest in products with automatic return calculations
- **Transaction Logging**: All API calls logged with error tracking
- **AI Integration**: Claude API for password strength, product descriptions, recommendations, portfolio insights, and error summaries

### Frontend
- **Landing Page**: Modern, responsive welcome screen
- **Authentication**: Signup/Login with password strength indicator
- **Dashboard**: Portfolio overview with AI insights
- **Products**: Listing, filtering, and AI recommendations
- **Investments**: Portfolio view with charts and analytics
- **Transaction Logs**: Full audit trail with AI error analysis
- **Profile Management**: Update risk appetite with personalized recommendations

## 📋 Prerequisites

- Node.js (v18 or higher)
- MySQL (v8 or higher)
- Anthropic API Key (for AI features)

## 🛠️ Installation

### Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=grip_invest
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
ANTHROPIC_API_KEY=your_anthropic_api_key
```


Start server:
```bash
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
```

Create `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start development server:
```bash
npm run dev
```

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/risk-appetite` - Update risk appetite
- `POST /api/auth/password-reset` - Request password reset

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/recommendations` - Get AI recommendations
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Investments
- `POST /api/investments` - Create investment
- `GET /api/investments/portfolio` - Get user portfolio
- `GET /api/investments/insights` - Get AI portfolio insights
- `GET /api/investments/:id` - Get investment by ID
- `PUT /api/investments/:id/cancel` - Cancel investment

### Logs
- `GET /api/logs` - Get user transaction logs
- `GET /api/logs/error-summary` - Get AI error summary
- `GET /api/logs/all` - Get all logs (admin)

## 🤖 AI Integration Details

### How AI Was Used



1. **Product Descriptions**
   - Auto-generates compelling product descriptions
   - Based on product attributes (type, yield, risk, tenure)
   - Saves time for admins and ensures consistency

2. **Product Recommendations**
   - Analyzes user's risk appetite
   - Matches products to user preferences
   - Provides personalized investment suggestions

3. **Portfolio Insights**
   - Analyzes complete user portfolio
   - Calculates risk distribution
   - Generates actionable insights and suggestions

4. **Error Summarization**
   - Aggregates user error logs
   - Identifies common error patterns
   - Provides helpful troubleshooting suggestions

### AI Impact on Project Quality


- **Automation**: Auto-generated product descriptions save admin time
- **Intelligence**: Smart portfolio analysis helps users make informed decisions
- **Debugging**: AI error summaries help identify and resolve issues faster
- **Personalization**: Risk-based recommendations create tailored user experiences

## 🎨 Tech Stack

### Backend
- Node.js & Express
- MySQL with mysql2
- JWT for authentication
- bcryptjs for password hashing
- Groq API

### Frontend
- Next.js 14 (App Router)
- React 18
- Tailwind CSS
- Recharts for data visualization
- Lucide React for icons

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/database.js
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── services/aiService.js
│   └── server.js
└── package.json

frontend/
├── src/
│   ├── app/
│   │   ├── page.js (landing)
│   │   ├── login/page.js
│   │   ├── signup/page.js
│   │   ├── dashboard/page.js
│   │   ├── products/
│   │   ├── investments/
│   │   ├── logs/
│   │   └── profile/
│   ├── components/
│   ├── context/AuthContext.js
│   └── lib/api.js
└── package.json
```

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Input validation on all endpoints
- Transaction logging for audit trail

## 👥 Default Credentials

Create an admin user:
- Email: admin@gripinvest.com
- Password: (set during signup)

Note: Admin status is determined by email containing "admin"

## 📝 Notes

- All monetary values are in INR (₹)
- Investment returns are calculated based on simple interest
- Risk levels: low, moderate, high
- Product types: bond, fd, mf, etf, other

## 🤝 Contributing

This project was created as an internship assignment for Grip Invest.

## 📄 License

This project is for educational purposes.