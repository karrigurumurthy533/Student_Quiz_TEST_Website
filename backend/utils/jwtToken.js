
import dotenv from 'dotenv';
dotenv.config();
export const sendToken = (user, statusCode, res,message) => {
    const token = user.generateAccessToken();
    //options for cookies

    const options = {
        expires: new Date(Date.now() + process.env.EXPIRE_COOKIE * 24 * 60 * 60 * 1000),
        httpOnly: true


    }
    res.status(statusCode).cookie('token', token, options)
        .json({
            success: true,
            message:message,
            user,
            token

        })
}