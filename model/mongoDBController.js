const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://dbUser:dbUser@cluster0.vmy1y.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";


var Db = {
    CreateEvent: function (m) {

        //---------choose your db here ------------------
        MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
            if (err) throw err;
            const dbo = db.db("test1");
            dbo.collection("cars").insertOne(m, function (err, res) {
                if (err) throw err;
                console.log("1 event inserted");
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
    ReadOrders: function (renderTheView) {
        var sum=0;
        MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
            if (err) throw err;
            var dbo = db.db("salesDb");
            dbo.collection("transactions").find({}, { projection: { _id: 0, quantity: 1 } }).toArray(function (err, result) {
                if (err) throw err;
                console.log(result);
                sum = sumHelper(result);

                db.close();
                var cardData = {
                    id:"totalSum",
                    title: "אריאל",
                    totalSum: sum,
                    percent: 0.8,
                    icon: "work"
                };

                renderTheView(cardData);

            });
        });
    }
};

module.exports = Db
