const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  try {
    const adminExists = await User.findOne({ email: 'admin@smfashion.com' });
    if (adminExists) {
      console.log('Admin already exists!');
      process.exit();
    }
    
    // The pre-save hook in User model will hash the password
    const admin = new User({
      name: 'Super Admin',
      email: 'admin@smfashion.com',
      password: 'adminpassword',
      address: 'Admin Headquarters',
      isAdmin: true
    });
    
    await admin.save();
    console.log('Admin user created successfully!');
    process.exit();
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
}).catch(err => {
  console.error('DB Connection Error:', err);
  process.exit(1);
});
