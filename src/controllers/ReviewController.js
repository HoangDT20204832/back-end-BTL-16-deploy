
const ReviewService = require('../services/ReviewService');
// const createUser = async (req, res) => {
//     try {
//       console.log(req.body);
//       const { name, email, password, confirmPassword, phone } = req.body;
//       const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
//       const isCheckEmail = reg.test(email);
//       if ( !email || !password || !confirmPassword ) {
//         return res.status(200).json({
//           status: "ERROR",
//           message: "Bạn cần điền đầy đủ thông tin",
//         });
//       } else if (!isCheckEmail) {
//         return res.status(200).json({
//           status: "ERROR",
//           message: "Địa chỉ email không hợp lệ",
//         });
//       } else if (password !== confirmPassword) {
//         return res.status(200).json({
//           status: "ERROR",
//           message: "password và confirmPassword phải giống nhau",
//         });
//       }
//       console.log("test email", isCheckEmail);
  
//       const response = await userService.createUser(req.body);
//       return res.status(200).json(response);
//     } catch (e) {
//       return res.status(404).json({
//         message: e,
//       });
//     }
//   };
const createReview = async (req, res) => {
  try {
    const data = req.body
    const { userId, productId, rating, comment, images } = data;
    // console.log("dataReview", data);
    const reviewProduct = await ReviewService.createReview(data);
    return res.status(200).json( reviewProduct);
  } catch (e) {
    console.error('Error creating review:', e);
    return res.status(404).json({
        message: e,
      });
  }
};

const getReviewsByProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    const {ratingPoint, hasImg} = req.query
    if (!productId) {
        return res.status(200).json({
            status: "ERROR",
            message: "productId là bắt buộc",
        });
        }
    const response = await ReviewService.getReviewsByProduct(productId,ratingPoint,hasImg);
    return res.status(200).json(response);
    } catch (e) {
    return res.status(404).json({
        message: e,
    });
    }
};

module.exports = {
    createReview,
    getReviewsByProduct
  };