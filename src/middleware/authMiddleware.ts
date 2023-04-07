import jwt from 'jsonwebtoken'
import { Response, Request } from 'express'
import { AppResponse } from '../utils/AppResponse';

const auth = async (req: Request, res: Response, next: any) => {
  let token

  if (req.headers.authorization) {
    try {
      token = req.headers.authorization;
      let jwt_secret = process.env.JWT_SECRET as string;

      const decoded: any = jwt.verify(token, jwt_secret)

      req.user = { ...decoded.user };

      next()
    } catch (error) {
      console.error(error)
      res.status(401)
    //   throw new Error('Not authorized, token failed')
      return res.send(AppResponse('Not authorized, token failed', 400, {}))
    }
  } else {
    if (!token) {
      res.status(401)
    //   throw new Error('Not authorized, no token')
      return res.send(AppResponse('Not authorized, no token', 401, {}))
    }
    next()
  }
}

export { auth }