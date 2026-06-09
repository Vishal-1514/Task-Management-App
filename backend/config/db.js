const mongoose =require("mongoose");

const connectDB= async ()=> {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log(`MongoDB Connected: ${conn.connection.host}`);

    }catch (error) {
        console.error(`MongoDB Error: ${error.message}`);
        process.exit(1);
    }
};

// const connectDB = async ()=>{
//     mongoose.connection.on('connected', ()=> console.log('database connected'))
//     await mongoose.connect(`${process.env.MONGODB_URI}/lms`)
// }

module.exports = connectDB;