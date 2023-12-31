const Review = require('../models/ReviewProduct');
const Product = require('../models/ProductModel')
const createReview = (data) => {
  return new Promise(async(resolve, reject) => {
    const { userId, productId, rating, comment,images } = data;

    try {
      const checkProduct = await Product.findOne({ _id: productId})
      if(checkProduct !== null){
        const newReview = await Review.create({
            userId, 
            productId, 
            rating, 
            comment,
            images
          });
          if(newReview){
            resolve({
                status: "OK",
                message: "SUCCESS",
                data: newReview
            });
          }
      }
    } catch (e) {
      reject(e);
    }
  });
};

const  getReviewsByProduct = (productId,ratingPoint,hasImg) => {
    return new Promise(async(resolve, reject) => {
      try {
        // const product = await Product.findOne({_id: productId})
        let query = { productId: productId };

      if (ratingPoint) {
        query.rating = ratingPoint;
      }
      if (hasImg !== undefined) {
        if (hasImg) {
          // Nếu hasImage tồn tại và có giá trị (khác null, undefined, false, 0, "", "false")
          query.images = { $elemMatch: { imageUrl: { $exists: true, $ne: null } } };
        } 
        // else {
        //   // Nếu hasImage là null, undefined, false, 0, "", "false"
        //   query.images = { $elemMatch: { imageUrl: { $exists: false } } };
        // }
      }
       const reviews = await Review.find(query).populate('userId');
        if(!reviews || reviews.length === 0){
          resolve({ 
            status: 'OK',
            message: "Không có đánh giá nào cho sản phẩm này"
          })
        }
       
        resolve({ 
          status: 'OK',
          message: "Lấy thành công đánh giá ản phẩm",
          data: reviews
        })
      } catch (e) {
        reject(e);
      }
    });
  };
// const getReviewsByProduct = async (req, res) => {
//     try {
//       const productId = req.params.productId;
//       const reviews = await Review.find({ productId }).populate('userId');
//       return res.status(200).json({ reviews });
//     } catch (error) {
//       console.error('Error fetching reviews:', error);
//       return res.status(500).json({ error: 'Internal Server Error' });
//     }
//   };

module.exports = {
    createReview,
    getReviewsByProduct
};