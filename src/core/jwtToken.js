import jwt from "jsonwebtoken"

function createToken(data) {
    const token = jwt.sign(data, process.env.SECRET_KEY || "", {expiresIn: "30d"});
    return token;
}

function verifyToken(token) {
    return new Promise((res, rej) => {
        const data = jwt.verify(token, process.env.SECRET_KEY || "");
        return res(data);
    })
}

export { createToken, verifyToken }