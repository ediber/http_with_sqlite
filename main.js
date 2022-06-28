

const http = require('http');

const server = http.createServer((req,res) => {
    if(req.url === '/'){
        res.write('i get you');
        res.end();
    }

    if(req.url === '/api/courses'){
        res.write(JSON.stringify([1,2,3]));
        res.end();
    }
});

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database("./mock.db", sqlite3.OPEN_READWRITE, (err)=> {
        if(err) return console.error(err.message);

        console.log("connection sucesfull1");
    }
);

// for first time
//db.run('CREATE TABLE users(name, id)');

const  sqlInsert = "INSERT INTO users(name, id) VALUES(?,?)";
db.run(sqlInsert, ["edi", 1], (err)=>{
    if(err) return console.error(err.message);

    console.log("raw added");
});

const sqlSelect = `SELECT * FROM users`;

db.all(sqlSelect, [], (err, rows) => {
    if(err) return console.error(err.message);

    rows.forEach((row) => {
        console.log(row);
    })
})

db.close((err)=>{
    if(err) return console.error(err.message);
});

server.listen(8080);