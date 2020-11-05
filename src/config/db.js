import mongoose from 'mongoose';

const connectDB = async () => {
  const url = 'mongodb://localhost:27017/ShopApi';

  await mongoose
    .connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    .then(() => {
      console.log(`MongoDB Connected to ${url}`.cyan.underline.bold);
    })
    .catch((err) => {
      console.log('MongoDB connection failed...', err);
    });
};

export default connectDB;
