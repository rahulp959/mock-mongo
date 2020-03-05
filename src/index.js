import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { MongoClient } from 'mongodb';

export const MockMongo = {
  mongo: null,
  async startDb(options) {
    this.mongo = new MongoMemoryReplSet({
      debug: false,
      replSet: {
        storageEngine: 'wiredTiger',
      },
      ...options,
    });

    await this.mongo.waitUntilRunning();
    return true;
  },

  getUri() {
    return this.mongo.getUri();
  },

  stopDb() {
    return this.mongo.stop();
  },

  async getCollection(databaseName, collectionName) {
    const connections = await MongoClient.connect(await this.mongo.getConnectionString(), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    return connections.db(databaseName).collection(collectionName);
  },
};