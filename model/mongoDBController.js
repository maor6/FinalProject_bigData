const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://dbUser:dbUser@cluster0.vmy1y.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


(async () => {
    await client.connect();
    const database = client.db("test1");
    const collection = database.collection("cars");

    await find();
    await client.close();
})();

const find = async function find() {
    const database = client.db("test1");
    const collection = database.collection("cars");
    const findResult = await collection.findOne({seat: 2});
    console.log(findResult)
}

const insert = async function insert(msg) {
    const database = client.db("test1");
    const collection = database.collection("cars");
    const res = await collection.insertOne({msg});
    console.log(res.insertedId);
}


module.exports = {
    find: find,
    insert: insert
};
