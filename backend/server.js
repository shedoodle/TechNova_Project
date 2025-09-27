const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/health', (req, res) => {
  res.json({ message: 'MP Report Card API is running!' });
});

// Lookup MP by postal code using OpenNorth Represent API
app.get('/api/mp/:postalCode', async (req, res) => {
  try {
    const { postalCode } = req.params;
    
    // Validate Canadian postal code format
    const postalCodeRegex = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
    if (!postalCodeRegex.test(postalCode)) {
      return res.status(400).json({ 
        error: 'Invalid Canadian postal code format' 
      });
    }

    // Clean postal code (remove spaces, convert to uppercase)
    const cleanPostalCode = postalCode.replace(/\s/g, '').toUpperCase();
    
    console.log(`Looking up MP for postal code: ${cleanPostalCode}`);
    
    // Use OpenNorth Represent API to find MP
    const representResponse = await axios.get(
      `https://represent.opennorth.ca/postcodes/${cleanPostalCode}/`
    );
    
    console.log('Represent API response:', representResponse.data);
    
    const representatives = representResponse.data.representatives_centroid;
    const mp = representatives.find(rep => rep.elected_office === 'MP');
    
    if (!mp) {
      return res.status(404).json({ 
        error: 'No MP found for this postal code' 
      });
    }

    const mpData = {
      name: mp.name,
      riding: mp.district_name,
      party: mp.party_name,
      postalCode: cleanPostalCode,
      email: mp.email,
      photo: mp.photo_url,
      url: mp.url
    };

    console.log('Returning MP data:', mpData);
    res.json(mpData);
  } catch (error) {
    console.error('Error looking up MP:', error.message);
    
    if (error.response?.status === 404) {
      return res.status(404).json({ 
        error: 'Postal code not found or no MP data available' 
      });
    }
    
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
});

// Get MP voting records from OpenParliament
app.get('/api/mp/:postalCode/voting-records', async (req, res) => {
  try {
    const { postalCode } = req.params;
    
    // First get the MP data to find their OpenParliament ID
    const mpResponse = await axios.get(
      `https://represent.opennorth.ca/postcodes/${postalCode.replace(/\s/g, '').toUpperCase()}/`
    );
    
    const mp = mpResponse.data.representatives.find(rep => rep.elected_office === 'MP');
    if (!mp) {
      return res.status(404).json({ error: 'MP not found' });
    }

    // Get MP details from OpenParliament
    const mpDetailsResponse = await axios.get(
      `https://api.openparliament.ca/politicians/?name=${encodeURIComponent(mp.name)}`
    );
    
    if (!mpDetailsResponse.data.objects || mpDetailsResponse.data.objects.length === 0) {
      return res.status(404).json({ error: 'MP details not found' });
    }
    
    const mpDetails = mpDetailsResponse.data.objects[0];
    
    // Get voting records
    const votesResponse = await axios.get(
      `https://api.openparliament.ca/votes/?politician=${mpDetails.id}&limit=50`
    );
    
    const votingRecords = votesResponse.data.objects.map(vote => ({
      id: vote.id,
      bill: vote.bill?.title || 'Unknown Bill',
      vote: vote.vote,
      date: vote.date,
      result: vote.result
    }));

    res.json({
      mp: {
        name: mp.name,
        riding: mp.district_name,
        party: mp.party_name
      },
      votingRecords,
      totalVotes: votesResponse.data.meta.total_count
    });
  } catch (error) {
    console.error('Error fetching voting records:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get MP report card data
app.get('/api/mp/:postalCode/report-card', async (req, res) => {
  try {
    const { postalCode } = req.params;
    
    // Get basic MP data
    const mpResponse = await axios.get(
      `https://represent.opennorth.ca/postcodes/${postalCode.replace(/\s/g, '').toUpperCase()}/`
    );
    
    const mp = mpResponse.data.representatives.find(rep => rep.elected_office === 'MP');
    if (!mp) {
      return res.status(404).json({ error: 'MP not found' });
    }

    // Get MP details from OpenParliament
    let mpDetails = null;
    let votingRecords = [];
    let bills = [];
    
    try {
      const mpDetailsResponse = await axios.get(
        `https://api.openparliament.ca/politicians/?name=${encodeURIComponent(mp.name)}`
      );
      
      if (mpDetailsResponse.data.objects && mpDetailsResponse.data.objects.length > 0) {
        mpDetails = mpDetailsResponse.data.objects[0];
        
        // Get recent voting records
        const votesResponse = await axios.get(
          `https://api.openparliament.ca/votes/?politician=${mpDetails.id}&limit=20`
        );
        votingRecords = votesResponse.data.objects;
        
        // Get bills sponsored by this MP
        const billsResponse = await axios.get(
          `https://api.openparliament.ca/bills/?sponsor_politician=${mpDetails.id}&limit=10`
        );
        bills = billsResponse.data.objects;
      }
    } catch (error) {
      console.log('Could not fetch detailed MP data:', error.message);
    }

    const reportCard = {
      mp: {
        name: mp.name,
        riding: mp.district_name, 
        party: mp.party_name,
        email: mp.email,
        photo: mp.photo_url
      },
      votingRecord: {
        totalVotes: votingRecords.length,
        attendanceRate: 95.2, // Placeholder - would need to calculate from actual data
        recentVotes: votingRecords.slice(0, 5).map(vote => ({
          bill: vote.bill?.title || 'Unknown Bill',
          vote: vote.vote,
          date: vote.date,
          result: vote.result
        }))
      },
      expenses: {
        total: 125000, // Placeholder - would need House of Commons expenses data
        categories: {
          travel: 25000,
          office: 45000,
          staff: 55000
        }
      },
      bills: {
        sponsored: bills.length,
        summaries: bills.slice(0, 3).map(bill => ({
          title: bill.title,
          status: bill.status,
          date: bill.introduced_date,
          summary: `Summary for ${bill.title} would be generated by AI` // Placeholder
        }))
      },
      communityRating: {
        score: 7.2, // Placeholder - would come from database
        totalRatings: 45,
        comments: [] // Placeholder
      }
    };

    res.json(reportCard);
  } catch (error) {
    console.error('Error fetching report card:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Submit community rating
app.post('/api/mp/:postalCode/rating', async (req, res) => {
  try {
    const { postalCode } = req.params;
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 10) {
      return res.status(400).json({ 
        error: 'Rating must be between 1 and 10' 
      });
    }

    // TODO: Store rating in database
    // For now, just return success
    res.json({ 
      message: 'Rating submitted successfully',
      rating,
      comment: comment || null,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error submitting rating:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
