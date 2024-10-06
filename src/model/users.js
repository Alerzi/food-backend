import mysql from "../core/db.js"

function createTable() {
    mysql.connect((err) => {
        if(err) throw new Error(err);
        mysql.query(`
            create table if not exists users(
                id int(11) NOT NULL auto_increment,
                name varchar(100),
                email varchar(100),
                address varchar(100),
                city varchar(100),
                password varchar(200),
                hash varchar(300),
                confirmed boolean,
                PRIMARY KEY (id)
            ) AUTO_INCREMENT = 1;
        `)
    })
}

export default createTable