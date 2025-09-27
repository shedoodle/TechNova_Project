# Canadian MP Report Card

A full-stack web application that allows users to enter a Canadian postal code to look up their Member of Parliament and view a comprehensive 'report card' including voting records, attendance, expenses, AI bill summaries, and community ratings.

## 🚀 Features

- **Postal Code Lookup**: Enter any Canadian postal code to find your MP
- **Real-time MP Data**: Integration with Canadian government APIs
- **Voting Records**: View MP's voting history and attendance
- **Expense Tracking**: See MP's parliamentary expenses
- **Bill Summaries**: AI-generated summaries of bills sponsored by the MP
- **Community Ratings**: Rate your MP and see community feedback (Asshole Index)

## 🏗️ Architecture

### Frontend (React)
- **Location**: `/technova/`
- **Port**: 3000
- **Features**: Postal code input, MP report card display, community rating system

### Backend (Node.js/Express)
- **Location**: `/backend/`
- **Port**: 5000
- **APIs**: RESTful endpoints for MP data, voting records, and community features

## 🛠️ Tech Stack

### Frontend
- React 19.1.1
- CSS (inline styles for now)

### Backend
- Node.js
- Express.js
- Axios (for API calls)
- CORS (for cross-origin requests)

### External APIs
- **OpenNorth Represent API**: Postal code to MP lookup
- **OpenParliament API**: MP details, voting records, bills

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm

### Quick Start

1. **Clone and navigate to the project**:
   ```bash
   cd "/Users/emilyqian/Technova Project/TechNova_Project-1"
   ```

2. **Start both frontend and backend**:
   ```bash
   ./start-dev.sh
   ```

   Or start them separately:

   **Backend**:
   ```bash
   cd backend
   npm install
   npm run dev
   ```

   **Frontend**:
   ```bash
   cd technova
   npm install
   npm start
   ```

3. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5001

## 🔌 API Endpoints

### Backend API (Port 5001)

- `GET /api/health` - Health check
- `GET /api/mp/:postalCode` - Lookup MP by postal code
- `GET /api/mp/:postalCode/report-card` - Get full MP report card
- `GET /api/mp/:postalCode/voting-records` - Get MP voting records
- `POST /api/mp/:postalCode/rating` - Submit community rating

### Example Usage

```bash
# Health check
curl http://localhost:5001/api/health

# Lookup MP for Ottawa postal code
curl http://localhost:5001/api/mp/K1A0A6

# Get full report card
curl http://localhost:5001/api/mp/K1A0A6/report-card
```

## 🗃️ Data Sources

### Canadian Government APIs
1. **OpenNorth Represent API**
   - URL: `https://represent.opennorth.ca/postcodes/{postal_code}/`
   - Purpose: Postal code to MP mapping
   - Data: MP name, riding, party, contact info

2. **OpenParliament API**
   - URL: `https://api.openparliament.ca/`
   - Purpose: Detailed MP data, voting records, bills
   - Data: Voting history, sponsored bills, attendance

## 🎯 Next Steps

### Immediate Priorities
1. **Database Integration**: Add MongoDB/PostgreSQL for storing community ratings
2. **AI Bill Summaries**: Integrate OpenAI/Claude for generating bill summaries
3. **Enhanced UI**: Improve styling and user experience
4. **Error Handling**: Better error messages and fallback data

### Future Features
1. **Authentication**: User accounts for persistent ratings
2. **Advanced Analytics**: MP performance metrics and comparisons
3. **Mobile App**: React Native version
4. **Real-time Updates**: WebSocket integration for live data

## 🧪 Testing

Test the API with sample Canadian postal codes:
- `K1A 0A6` (Ottawa - Parliament Hill)
- `M5H 2N2` (Toronto - Financial District)
- `V6B 1A1` (Vancouver - Downtown)

## 📝 Development Notes

- The backend uses mock data for expenses and some features until full government data integration
- Community ratings are currently stored in memory (will need database)
- AI bill summaries are placeholders (need AI service integration)
- CORS is configured to allow frontend-backend communication

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is for educational purposes. Please respect the terms of use for the Canadian government APIs. 