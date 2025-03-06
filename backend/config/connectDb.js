const mongoose = require('mongoose')

// Connect to MongoDB

const ConnectDb = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGODB_API)

        console.log(
            `Database connected: ${connect.connection.host}, ${connect.connection.name}`
        );

    } catch (error) {
        console.error(error);
        process.exit(1)
    };
};

module.exports = ConnectDb;