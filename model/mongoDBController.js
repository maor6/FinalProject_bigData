const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://dbUser:dbUser@cluster0.vmy1y.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";


const Db = {
    CreateEvent: function (m) {

        //---------choose your db here ------------------
        MongoClient.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true}, function (err, db) {
            if (err) throw err;
            const dbo = db.db("test1");
            dbo.collection("cars").insertOne(m, function (err, res) {
                if (err) throw err;
                //console.log("1 event inserted");
                db.close();
            });
        });

        //---------------------------------------
        //כאן צריך להחליט מה מחזירים לצד לקוח ולהפעיל את הלוגיקה הנדרשת
        // אולי נרצה לעדכן עוד אלמנטים בדף נניח ממוצעים גרף וכו, יש לעדכן את האובייקט הנשלח
    },
    DeleteOrder: function (info) {
        console.log('Delete Order: ' + info);
    },
    UpdateOrder: function (info) {
        console.log('Update Order ' + info);
    },
    ReadData: function (fun) {

         MongoClient.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true}, function (err, db) {
            if (err) throw err;
            const dbo = db.db("test1");
             dbo.collection("cars").find({}).toArray(function (err, result) {
                if (err) throw err;
                fun(result);
                db.close();
            });
        });
    }
};

module.exports = Db
