require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

if (!process.env.JWT_SECRET) throw new Error('Set JWT_SECRET in server/.env');
if (!process.env.MONGO_URI) throw new Error('Set MONGO_URI in server/.env');

connectDB()
  .then(() => app.listen(process.env.PORT || 5000, () => console.log('API running')))
  .catch(err => { console.error('Could not connect to MongoDB:', err.message); process.exit(1); });
