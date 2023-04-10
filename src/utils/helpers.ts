import jwt from 'jsonwebtoken'

export const decodeToken = (token: string) => {
    try {
        let jwt_secret = process.env.JWT_SECRET as string;
        const decoded: any = jwt.verify(token, jwt_secret)
        return decoded.user;
    } catch (error) {
        return 0;
    }
}