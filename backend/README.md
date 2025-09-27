# MP Report Card Backend

Backend API server for the Canadian MP Report Card application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with:
```
PORT=5001
NODE_ENV=development
```

3. Start the development server:
```bash
npm run dev
```

## API Endpoints

- `GET /api/mp/:postalCode` - Lookup MP by postal code


## Next Steps

1. Integrate with Canadian government APIs
2. Add database for storing MP data and ratings
3. Implement AI bill summaries
4. Add authentication for community features
