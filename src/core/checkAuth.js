import {verifyToken} from "./jwtToken.js"

export default (req, res, next) => {
    if(req.path === "/users/register" || req.path === "/users/login" || req.path.includes("/users/verify") ||
        req.path === "/customers/register" || req.path === "/customers/login" || req.path.includes("/customers/verify")
    ) 
    {
        return next();
    }
    const token = req.headers.authorization || req.query.token;
    verifyToken(token).then((user) => {
        req.user = user;
        next();
    }).catch(() => {
        res.status(403).json({message: "Invalid auth token provided."});
    })
}