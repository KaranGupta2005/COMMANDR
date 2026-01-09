import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectToDB=async ()=>{
    await mongoose.connect('mongodb+srv://guptakaranport:karang2006@cluster0.gapyepy.mongodb.net/');
}

connectToDB()
.then(()=>{
    console.log("Connected to MongoDB");
})
.catch((err)=>{
    console.log("Error connecting to MongoDB:",err);
})

export default connectToDB;
