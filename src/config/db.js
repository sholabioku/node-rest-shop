import mongoose from 'mongoose';

const connectDB = async () => {
  await mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    })
    .then(() => {
      console.log(
        `MongoDB Connected to ${process.env.MONGO_URI}`.cyan.underline.bold
      );
    })
    .catch((err) => {
      console.log('MongoDB connection failed...', err);
    });
};

export default connectDB;
