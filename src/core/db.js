import mysql from "mysql2"

let connect = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "food"
});

connect.connect((err) => {
    if(err) {
        console.log("Connection error ", + JSON.stringify(err, undefined, 2));
    }
});

export default connect;