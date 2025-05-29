import jwt from 'jsonwebtoken';

const authMiddleware = async (req, res, next) => {
    const {token} = req.headers;
    if (!token) {
        return res.json({
            success: false,
            message: 'Not authorized. Login again.'
        })
    }
        try {
            const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
            if(!req.body){
                req.body = {};
            }
            req.body.userId = tokenDecode.id;
            req.user = {id: tokenDecode.id};
            next();
        } catch (error) {
            console.log(error);
            return res.json({
                success: false,
                message: 'Error'
            })
        }
    }

export default authMiddleware;