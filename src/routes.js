import { User } from "./controller/index.js"
import { register, update } from "./core/validator.js"

export default (app) => {
    app.post("/users/register", register, User.create);
    app.get("/users/verify", register, User.verifyEmail);
    app.get("/users/login", register, User.login);
    app.patch("/users/update", update, User.update);
    app.get("/user/:id", User.index);
}