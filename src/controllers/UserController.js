const userService = require("../services/UserService");
const JwtService = require("../services/JwtService");
const createUser = async (req, res) => {
  try {
    // console.log(req.body);
    const { name, email, password, confirmPassword, phone } = req.body;
    const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    const isCheckEmail = reg.test(email);
    if ( !email || !password || !confirmPassword ) {
      return res.status(200).json({
        status: "ERROR",
        message: "Bạn cần điền đầy đủ thông tin",
      });
    } else if (!isCheckEmail) {
      return res.status(200).json({
        status: "ERROR",
        message: "Địa chỉ email không hợp lệ",
      });
    } else if (password !== confirmPassword) {
      return res.status(200).json({
        status: "ERROR",
        message: "password và confirmPassword phải giống nhau",
      });
    }
    // console.log("test email", isCheckEmail);

    const response = await userService.createUser(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    // console.log(req.body);
    const { email, password } = req.body;
    const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    const isCheckEmail = reg.test(email);
    if (!email || !password) {
      return res.status(200).json({
        status: "ERROR",
        message: "Bạn cần điền đầy đủ các mục ",
      });
    } else if (!isCheckEmail) {
      return res.status(200).json({
        status: "ERROR",
        message: "Địa chỉ email không đúng",
      });
    } 
    // console.log("test email", isCheckEmail);
    const response = await userService.loginUser(req.body);
    const {refresh_token, ...newResponse} = response
    // console.log("response", response);
    //set giá trị cookie = refresh_token
    res.cookie('refresh_token', refresh_token,{
      httpOnly: true,
      secure: false,   //thêm bảo mật ở phía client
      sameSite: 'strict',
      path: '/'
    })
    return res.status(200).json({...newResponse, refresh_token});
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};



const updateUser = async (req, res) => {
  try {
   const userId = req.params.id;
   const data = req.body;

   if (!userId) {
    return res.status(200).json({
      status: "ERR",
      message: "userId là bắt buộc",
    });
   }
    const response = await userService.updateUser(userId, data);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
   const userId = req.params.id;

   if (!userId) {
    return res.status(200).json({
      status: "ERR",
      message: "userId là bắt buộc",
    });
   }
    const response = await userService.deleteUser(userId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getAllUser = async (req, res) => {
  try {
    const response = await userService.getAllUser();
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getDetailsUser = async (req, res) => {
  try {
    const userId = req.params.id;
 
    if (!userId) {
     return res.status(200).json({
       status: "ERR",
       message: "userId là bắt buộc",
     });
    }
     const response = await userService.getDetailsUser(userId);
     return res.status(200).json(response);
   } catch (e) {
     return res.status(404).json({
       message: e,
     });
   }
};

const refreshToken = async (req, res) => {
  try {

    // console.log("req.cookie", req.cookies)
    let token  = req.headers.token.split(" ")[1];
    // let token  = req.cookies.refresh_token //gán giá trị token cho refresh_token lưu ở cookie

    if (!token) {
     return res.status(200).json({
       status: "ERROR",
       message: "token là bắt buộc",
     });
    }
     const response = await JwtService.refreshTokenJwtService(token);
     return res.status(200).json(response);
   } catch (e) {
     return res.status(404).json({
       message: e,
     });
   }
};

const logoutUser = async (req, res) => {
  try {
    // const refreshToken = req.cookies.refresh_token;
    res.clearCookie('refresh_token');
    // await revokeToken(refreshToken);
    return res.status(200).json({
      status: "OK",
      message: "Đăng xuất thành công",
    });
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const updateUserPassword = async(req, res) => {
  try {
   const userId = req.params.id;
  //  console.log("userId: " , userId);
   const data = req.body;
   const { oldPassword, newPassword, confirmPassword} = data;
   if (!userId) {
    return res.status(200).json({
      status: "ERR",
      message: "userId là bắt buộc",
    });
   }else if ( !oldPassword || !newPassword || !confirmPassword ) {
     return res.status(200).json({
       status: "ERROR",
       message: "Bạn cần điền đầy đủ thông tin",
     });
   }  else if (newPassword !== confirmPassword) {
     return res.status(200).json({
       status: "ERROR",
       message: "password và confirmPassword phải giống nhau",
     });
   }
    const response = await userService.updateUserPassWord(userId, data);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
      status: "hi"
    });
  }
};

module.exports = {
  createUser,
  loginUser,
   updateUser,
   deleteUser,
   getAllUser,
   getDetailsUser,
   refreshToken,
   logoutUser,
   updateUserPassword
};
