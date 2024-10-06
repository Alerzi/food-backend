import connect from "../core/db.js"
import { validationResult } from "express-validator"
import bcrypt from "bcrypt"
import * as uuid from "uuid"
import {createToken} from "../core/jwtToken.js"
import Mail from "../core/mailer.js"

class UserController {

    async index(req, res) {
        try {
            const id = req.params.id;
            const user = await registerUser();
            function registerUser() {
                return new Promise((res, rej) => {
                    connect.query(`select * from users where id = "${id}"`, (err, rows) => {
                        if(!rows?.length) { res("Error"); }
                        else { res(rows[0]); }
                    });
                });
            }
            if(typeof(user) == "string") {
                res.send(user);
            }
            else {
                res.status(201).json(user);
            }
        }
        catch(err) {
            res.status(400).json({ status: "error", errors: JSON.stringify(err) });
        }
    }

    async create(req, res) {
        try { 
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                res.status(400).json({ status: "error", errors: errors.array() });
                return;
            }
            const hashPassword = await passwordHash(req.body.password);
            function passwordHash(password) {
                return new Promise((res, rej) => {
                    return res(bcrypt.hash(password, 3));
                });
            }
            const data = {
                email: req.body.email,
                username: req.body.name,
                password: hashPassword,
                hash: uuid.v4()
            }
            const dataToken = {
                email: req.body.email,
                password: req.body.password
            }
            const token = createToken(dataToken);
            const user = await registerUser();
            function registerUser() {
                return new Promise((res, rej) => {
                    connect.query(`select * from users where email = "${data.email}"`, (err, rows) => {
                        if(!rows?.length) { 
                            connect.query(`insert into users(name, email, password, hash) values ("${data.username}", "${data.email}", "${data.password}", "${data.hash}")`,
                                (err, rows) => {
                                    if(err) { res("Error") }
                                    else { 
                                        res({insertId: rows.insertId})
                                        Mail.sendActivationMail(data.email, `${process.env.API_URL}/users/verify?hash=${data.hash}`)
                                    }
                                }
                            );
                        }
                        else {
                            if(rows[0].name == data.username) { res("Name already exists"); }
                            else if(rows[0].email == data.email) { res("Email already exists"); }
                        }
                    });
                });
            }
            if(typeof(user) == "string") {
                res.send(user);
            }
            else {
                res.status(201).json({ status: "success", token: token, user: data.username, email: data.email, id: user.insertId });
            }
        }
        catch(err) {
            res.status(400).json({ status: "error", errors: JSON.stringify(err) });
        }
    }

    async verifyEmail(req, res) {
        try {
            const hash = req.query.hash;
            if(!hash) {
                res.status(400).send();
                return;
            }
            const user = await findUser();
            function findUser() {
                return new Promise((res, rej) => {
                    connect.query(`update users set confirmed = true where hash = "${hash}"`, (err, rows) => {
                        if(err) { res({message: "User not found"}); }
                        else { res(rows); }
                    });
                });
            }
            if(user.affectedRows) {
                return res.redirect("http://localhost:3000/verify");
            }
            else {
                res.status(404).send({ status: "error", message: "User not found" });
            }
        }
        catch(err) {
            res.status(500).json({ status: "err", error: err });
        }
    }

    async login(req, res) {
        try {
            const data = {
                email: req.query.email,
                password: req.query.password,
                // token: req.query.token,
                // valid: false
            }
            //recaptcha
            // if(data.token.length) {
            //     const secretKey = process.env.RECAPTCHA_SECRET_KEY;
            //     const recaptcha = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${data.token}`);
            //     if(recaptcha.data.success) {
            //         data.valid = true;
            //     }
            // }
            const token = createToken(data);
            const user = await compareUser(data.email);
            function compareUser(email) {
                return new Promise((res, rej) => {
                    connect.query(`select * from users where email = "${email}"`, (err, rows) => {
                        if(rows == undefined || !rows?.length || err) { res("User does not exist"); }
                        else { res(rows[0]); }
                    });
                });
            }
            if(typeof(user) === "string") {
                res.send(user);
            }
            else {
                const isPassEquals = await passwordCompare(data.password, user);
                function passwordCompare(password, user) {
                    return new Promise((res, rej) => {
                        return res(bcrypt.compare(password, user.password));
                    });
                }
                if(isPassEquals && user.confirmed) {
                    res.json({token, user: user.name, email: user.email, id: user.id});
                }
                else if(!isPassEquals) {
                    res.send("Incorrect password");
                }
                else {
                    res.send("Email was not confirmed");
                }
            }
        }
        catch(err) {
            res.json({status: "error", error: err});
        }
    }

    async update(req, res) {
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                res.status(400).json({ status: "error", errors: errors.array() });
                return;
            }
            const data = {
                email: req.body.email,
                name: req.body.name,
                city: req.body.city,
                address: req.body.address,
                id: req.body.userId
            }
            const user = await registerUser();
            function registerUser() {
                return new Promise((res, rej) => {
                    connect.query(`update users set email = "${data.email}", name = "${data.name}", city = "${data.city}", address = "${data.address}" where id = "${data.id}"`, (err, rows) => {
                        if(err) { res("update error"); }
                        else {
                            res(rows);
                        }
                    });
                });
            }
            if(typeof(user) == "string") {
                res.send(user);
            }
            else {
                res.status(201).json({name: data.name, email: data.email, id: data.id, address: data.address, city: data.city});
            }
        }
        catch(err) {
            res.json({status: "error", error: err});
        }
    }
}

export const User = new UserController();