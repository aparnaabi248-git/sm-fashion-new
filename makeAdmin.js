const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
    try {
        // Find any user with "sharmila" in their email and make them an Admin
        const result = await User.updateMany(
            { email: { $regex: /sharmila/i } }, 
            { $set: { isAdmin: true } }
        );
        console.log(`Success! Updated ${result.modifiedCount} accounts to Admin status.`);
        process.exit();
    } catch(err) {
        console.error(err);
        process.exit(1);
    }
});
