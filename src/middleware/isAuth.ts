const jwt = require(`jsonwebtoken`);
import { cycvuser } from "../model/model";

const decode = async (authHeadersOrToken: any) => {
  // jwt.verify() decode the PRIVATE_KEY into the obj
  const decodeToken = jwt.verify(authHeadersOrToken, process.env.PRIVATE_KEY);
  const { userId } = decodeToken;
  const existUser = await cycvuser.findById(userId);
  if (!existUser) {
    throw new Error("user not exist!");
  }
  return existUser;
};

export const isAuth = async (req: any, res: any, next: any) => {
  const authHeaders = req.headers.auth;
  const { token } = req.params;
  let existUser;
  try {
    if (authHeaders) {
      existUser = await decode(authHeaders);
    }
    if (!authHeaders) {
      if (token) {
        existUser = await decode(token);
      }
      if (!token) {
        throw new Error("user not exist!");
      }
    }
    // assign varibles for request
    req.user = existUser;
    next();
  } catch (err) {
    res.status(401).send({ success: 0, messsenger: err });
  }
};
