const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database("./mock.db", sqlite3.OPEN_READWRITE, (err)=> {
        if(err) return console.error(err.message);

        console.log("connection sucesfull1");
    }
);

class DbHelper{

     sqlAdd(name, id) {
        const sqlInsert = "INSERT INTO users(name, id) VALUES(?,?)";
        db.run(sqlInsert, [name, id], (err) => {
            if (err) return console.error(err.message);

            console.log(`raw added: ${name}, ${id}`);
        });
    }

     selectAll() {
        return new Promise((resolve, reject) => {
            const sqlSelect = `SELECT * FROM users`;
            var ans = [];

            db.all(sqlSelect, [], (err, rows) => {
                if (err) {
                    //    return console.error(err.message);
                    reject(err.message);
                }

                rows.forEach((row) => {
                    console.log(row);
                    ans.push(row);
                })

                resolve(ans);
            });
        })
    }
}

module.exports = DbHelper;