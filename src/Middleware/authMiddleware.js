const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()
const authMiddleware = (req, res, next) =>{
    const token = req.headers.token.split(' ')[1]
    // console.log('token', token)
    //Middleware verifyToken được sử dụng để kiểm tra tính hợp lệ của access token và thời gian sống của nó.
    //nếu  process.env.ACCESS_TOKEN ko đúng thì hàm sẽ trẻ về err; nếu đúng thì trả về thoogn tin mình muốn( dưới cụ thể là user)
    // nếu access_token với id là của Admin thì sẽ cho đi tiếp next() đến userControler để thực hiện các lệnh;
    // isAdmin = false thì sẽ thông báo lỗi rằng bạn ko có quyền làm chức năng này
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
        if (err) {
            return res.status(404).json({
                message: 'The authemtication ',
                status: 'ERROR'
            })
        }
        
        // const {payload} = user;
        if (user?.isAdmin) {
            next()
        } else {
            return res.status(404).json({
                message: 'The authemticationâ',
                status: 'ERROR'
            })
        }
    });
}
// dùng để giúp admin có thể xem được thông tin của mọi người dùng, còn người dùng đăng nhập vào chỉ xem đc thông tin của bản thân
const authUserMiddleware = (req, res, next) =>{
    const token = req.headers.token.split(' ')[1]
    const userId = req.params.id;
    // console.log('token', token)
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
        if (err) {
            return res.status(200).json({
                message: 'The authemtication hello',
                status: 'ERROR'
            })
        }
        
        // const {payload} = user;
        if ( user?.isAdmin || user?.id === userId ) {
            next()
        } else {
            return res.status(200).json({
                message: 'The authemticationâ',
                status: 'ERROR'
            })
        }
    });
}



module.exports ={
    authMiddleware,authUserMiddleware
}