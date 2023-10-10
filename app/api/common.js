const jwt = require("jwt-simple");
const moment = require("moment");

export function createToken(user) {
    const payload = {
        userId: user.id,
        createdAt: moment().unix(),
        expiredAt: moment().add(5, "minutes").unix()
    };

    return jwt.encode(payload, "secret string");
}

export function validateToken(req) {
    const userToken = req.headers.get("user-token");
    if (!userToken) {
        return false;
    }

    let payload = {};
    try {
        payload = jwt.decode(userToken, "secret string");
    } catch (err) {
        return false;
    }

    return payload.expiredAt < moment().unix() ? false : true;
}
