

const http = require('http');

const server = http.createServer(async (req, res) => {
    if (req.url === '/') {
        res.write('i get you');
        res.end();
    }

    if (req.url === '/api/courses') {
        res.write(JSON.stringify([1, 2, 3]));
        res.end();
    }

    if (req.url.includes('/add_user')) {
        const parsed_qs = parse_query_string(req.url);
        console.log(parsed_qs.name);

        sqlAdd(parsed_qs.name, parsed_qs.id);

        res.end();
    }

    if (req.url.includes('/select_all')) {
        const rows = await selectAll();
        res.write(JSON.stringify(rows));
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

function sqlAdd(name, id) {
    const sqlInsert = "INSERT INTO users(name, id) VALUES(?,?)";
    db.run(sqlInsert, [name, id], (err) => {
        if (err) return console.error(err.message);

        console.log(`raw added: ${name}, ${id}`);
    });
}

function selectAll() {
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

/*db.close((err)=>{
    if(err) return console.error(err.message);
});*/

server.listen(8080);

function parse_query_string(query) {
    var vars = query.split("&");
    var query_string = {};
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        var key = decodeURIComponent(pair.shift());
        var value = decodeURIComponent(pair.join("="));
        // If first entry with this name
        if (typeof query_string[key] === "undefined") {
            query_string[key] = value;
            // If second entry with this name
        } else if (typeof query_string[key] === "string") {
            var arr = [query_string[key], value];
            query_string[key] = arr;
            // If third or later entry with this name
        } else {
            query_string[key].push(value);
        }
    }
    return query_string;
}