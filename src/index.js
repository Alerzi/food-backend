import express from "express"
import cors from "cors"
import "dotenv/config"
import bodyParser from "body-parser"
import routes from "./routes.js"
import checkAuth from "./core/checkAuth.js"
import {createUser} from "./model/index.js"

const app = express();
app.use(bodyParser.json());
app.use(cors({ origin: "*" }));
app.use(checkAuth);

createUser();

routes(app);

app.listen(process.env.PORT, () => { 
    console.log("server on port " + process.env.PORT); 
});