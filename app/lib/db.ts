// import { MongoClient, ServerApiVersion } from 'mongodb';
import mongoose from 'mongoose';
// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(process.env.MONGODB_URI, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// });

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db('admin').command({ ping: 1 });
//     console.log(
//       'Pinged your deployment. You successfully connected to MongoDB!'
//     );
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);

const connectDB = async () => {
  // check if we are already connected:
  const connectionState = mongoose.connection.readyState;
  if (connectionState === 1) {
    // console.log('\x1b[32m%s\x1b[0m', 'Already connected to DB');
    console.log('Already connected to DB');
    return;
  }
  if (connectionState === 2) {
    // console.log('\x1b[33m%s\x1b[0m', 'Connecting...');
    console.log('Connecting...');
    return;
  }
  try {
    if (!process.env.MONGO_URL) {
      throw new Error('mongo url not defined');
    }
    // mongoose.connect(MONGODB_URI, {
    const dbConnection = await mongoose.connect(process.env.MONGODB_URI!, {
      // ! -> ts
      dbName: 'restapis-basics',
      bufferCommands: true,
    });
    // console.log(
    //   '\x1b[32m%s\x1b[0m',
    //   `DB connection successful on host:${dbConnection.connection.host}`
    // ); //
    console.log(
      `DB connection successful on host:${dbConnection.connection.host}`
    ); //
    // console.log(
    //   '\x1b[36m%s\x1b[0m',
    //   `DB name: ${dbConnection.connection.name}`
    // );
    console.log(`DB name: ${dbConnection.connection.name}`);
  } catch (error: any) {
    console.log('\x1b[31m%s\x1b[0m', `Error: ${error.message}`);
    throw new Error('Error: ', error);
  }
};

export default connectDB;
