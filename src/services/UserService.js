const User = require("../models/UserModel");
const brcypt = require("bcrypt");
const { genneralAccessToken, genneralRefreshToken } = require("./JwtService");
const createUser = (newUser) => {
  const saltRounds = 2;
  return new Promise(async(resolve, reject) => {
    const { name, email, password, confirmPassword, phone } = newUser;

    try {
      const checkUser = await User.findOne({ email: email})
      if(checkUser !== null){
        resolve({ 
          status: 'ERROR',
          message: "Email đã được sử dụng"
        })
      }
      //mã hóa mật khẩu người dùng lưu vào database
      const hashPassword = await brcypt.hash(password, saltRounds)
      const createdUser = await User.create({
        name,
        email,
        password : hashPassword ,
        phone,
      });
      if(createdUser){
        resolve({
            status: "OK",
            message: "SUCCESS",
            data: createdUser
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const  loginUser= (userLogin) => {
  return new Promise(async(resolve, reject) => {
    const {  email, password } = userLogin;

    try {
      const checkUser = await User.findOne({ email: email})
      if(checkUser === null){
        resolve({ 
          status: 'ERROR',
          message: "User không tồn tại"
        })
      }
      //kiểm tra xem mật khẩu người dùng nhập từ phía client có bằng mật khẩu lưu trong database ko
      const comparePassword = await brcypt.compare(password, checkUser.password)
  
      if(comparePassword == false){
        resolve({ 
          status: 'ERROR',
          message: "Mật khẩu không chính xác"
        })
      }
      
      //Access token là một chuỗi token ngắn hạn được cấp phép để xác thực và truy cập nguồn tài nguyên của ứng dụng mà không cần người dùng phải nhập lại mật khẩu
      const access_token = await genneralAccessToken({
        id: checkUser.id,
        isAdmin: checkUser.isAdmin,
      })

      // Refresh token là một chuỗi token dài hạn được sử dụng để làm mới access token sau khi nó hết hạn mà không cần người dùng phải đăng nhập lại.
      const refresh_token = await genneralRefreshToken({
        id: checkUser.id,
        isAdmin: checkUser.isAdmin,
      })

      // console.log(access_token)
      resolve({ 
        status: 'OK',
        message: "Thành công",
        access_token,
        refresh_token
      })
    } catch (e) {
      reject(e);
    }
  });
};

const  updateUser= (userId, data) => {
  return new Promise(async(resolve, reject) => {
    try {
      // console.log("userId: ", userId)
      const checkUser = await User.findOne({_id: userId})
      // console.log("checkUser", checkUser)
      if(checkUser === null){
        resolve({ 
          status: 'OK',
          message: "User không tồn tại"
        })
      }
      const updateUserData = await User.findByIdAndUpdate(userId, data, {new: true})
      // { new: true } được sử dụng để trả về tài liệu được cập nhật sau khi thực hiện phương thức update
      resolve({ 
        status: 'OK',
        message: "Cập nhật thông tin người dùng thành công",
        data: updateUserData
      })
    } catch (e) {
      reject(e);
    }
  });
};

const  deleteUser= (userId) => {
  return new Promise(async(resolve, reject) => {
    try {
      const checkUser = await User.findOne({_id: userId})
      if(checkUser === null){
        resolve({ 
          status: 'OK',
          message: "User không tồn tại"
        })
      }
      const deleteUserData = await User.findByIdAndDelete(userId, {new: true})
      // { new: true } được sử dụng để trả về tài liệu được cập nhật sau khi thực hiện phương thức update
      resolve({ 
        status: 'OK',
        message: "Xóa người dùng thành công",
      })
    } catch (e) {
      reject(e);
    }
  });
};

const  getAllUser = () => {
  return new Promise(async(resolve, reject) => {
    try {
      const allUser = await User.find()
      // { new: true } được sử dụng để trả về tài liệu được cập nhật sau khi thực hiện phương thức update
      resolve({ 
        status: 'OK',
        message: "Danh sách tất cả người dùng",
        data: allUser
      })
    } catch (e) {
      reject(e);
    }
  });
};

const  getDetailsUser= (userId) => {
  return new Promise(async(resolve, reject) => {
    try {
      const user = await User.findOne({_id: userId})
      if(user === null){
        resolve({ 
          status: 'OK',
          message: "User không tồn tại"
        })
      }
     
      resolve({ 
        status: 'OK',
        message: "Lấy thành công người dùng",
        data: user
      })
    } catch (e) {
      reject(e);
    }
  });
};

function updateUserPassWord(userId, data) {
  return new Promise(async (resolve, reject) => {
    const {oldPassword, newPassword, confirmPassword} = data;
    try {
      const user = await User.findOne({_id: userId});

      if (user === null) {
        resolve({
          status: "OK",
          message: "Người dùng khoogn tồn tại"
        });
      }
      // const comparePassword = await brcypt.compare(password, checkUser.password)
  
      // if(comparePassword == false){
      //   resolve({ 
      //     status: 'ERROR',
      //     message: "Mật khẩu không chính xác"
      //   })
      // }

      const isPasswordValid = await brcypt.compare(oldPassword, user.password);

      if (!isPasswordValid) {
        resolve({ 
          status: 'ERROR',
          message: "Mật khẩu không chính xác"
        })
      }

      const saltRounds = 2;
      // const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await brcypt.hash(newPassword, saltRounds);

      await User.findByIdAndUpdate(userId, { password: hashedPassword });

      resolve({
        status: 'OK',
        message: "Thay đổi mật khẩu thành công",
        // data: user
      });
    } catch (e) {
      reject(e);
    }
  });
}

module.exports = {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  getAllUser,
  getDetailsUser,
  updateUserPassWord
};
