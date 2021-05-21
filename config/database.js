const mongoose = require('mongoose');


    async function connectDB () {
        try {
            const conn = await mongoose.connect(process.env.DB_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false
            
            })
            console.log(`Mongodb connected: ${conn.connection.host}`)
        } catch (error) {
            console.error(error)
            process.exit(1)
        }
    };

    module.exports = connectDB;