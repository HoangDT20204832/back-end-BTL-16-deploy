const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const genneralAccessToken = async (payload) => {
  // console.log("payload", payload);
  const access_token = jwt.sign(
    { ...payload },
    process.env.ACCESS_TOKEN,
    { expiresIn: "20s" }
  );

  return access_token;
};

const genneralRefreshToken = async (payload) => {
  // console.log("payload", payload);
  const refresh_token = jwt.sign(
    { ...payload },
    process.env.REFRESH_TOKEN,
    { expiresIn: "365d" }
  );

  return refresh_token;
};

// cung cấp lại access_token mới khi access_token cũ hết hạn mà người dùng ko cần đăng nhập lại
const refreshTokenJwtService =  (token) => {
    return new Promise((resolve, reject) => {
        try {
        //  console.log("token", token)
         jwt.verify(token, process.env.REFRESH_TOKEN, async(err, user)=>{
            if(err){
                resolve({
                    status:"ERROR",
                    message:"The authemtication"
                })
            }
            // console.log("user: " , user)
            const access_token = await genneralAccessToken({
                id: user?.id,
                isAdmin: user?.isAdmin
            })

            // console.log("access_token",access_token)
            resolve({ 
                status: 'OK',
                message: "Taoj access_token moi thanh cong",
                access_token
              })
         })
        
        } catch (e) {
          reject(e);
        }
      });

  };
module.exports = {
  genneralAccessToken,
  genneralRefreshToken,
  refreshTokenJwtService,
};
