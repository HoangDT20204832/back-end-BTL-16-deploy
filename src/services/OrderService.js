const Order = require("../models/OrderProduct");
const Product = require("../models/ProductModel");
const createOrder = (newOrder) => {
  return new Promise(async (resolve, reject) => {
    const {
      orderItems,
      paymentMethod,
      deliveryMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
      fullName,
      address,
      city,
      phone,
      user,
      isPaid,
      paidAt
    } = newOrder;

    try {
      const promises = orderItems.map(async (order) => {
        // productData: sanrp phẩm đủ hàng so với số lượng yeeuu cầu của đơn hàng
        const productData = await Product.findOneAndUpdate(
          {
            _id: order.product,
            countInStock: { $gte: order.amount },//Điều kiện để chỉ lấy ra productData nếu số lượng tồn kho (countInStock) lớn hơn hoặc bằng số lượng đặt hàng (order.amount).
          },
          { 
            $inc: {            //Phần này chỉ định các thay đổi sẽ được áp dụng vào tài nguyên (productData) đã được tìm thấy
              countInStock: -order.amount, //Giảm số lượng tồn kho bằng đi 1 lượng = số lượng đặt hàng.
              selled: +order.amount,    //Tăng số lượng đã bán bằng lên 1 lượng = số lượng đặt hàng.
            },
          },
          { new: true }             //Cài đặt này đảm bảo rằng kết quả trả về từ findOneAndUpdate là phiên bản đã cập nhật của tài nguyên, chứ không phải là phiên bản trước khi cập nhật.
        );
        if (productData) {
          return {
            status: "OK",
            message: "SUCCESS",
          };
        } else {
          return {
            status: "OK",
            message: "ERROR",
            id: order.product,
          };
        }
      });
      const results = await Promise.all(promises);//Promise.all để đợi tất cả các Promise trong mảng promises hoàn thành. Kết quả trả về là một mảng chứa kết quả của tất cả các Promise. 
      //newData: 1 mảng chứa các sản phẩm với id không đủ hàng từ kết quả cập nhật trước đó.
      const newData = results && results.filter((item) => item.id);
      
      if (newData.length) {
        const arrId = [];
        newData.forEach((item) => {
          arrId.push(item.id); //Nếu có sản phẩm không đủ hàng, tạo một mảng arrId chứa các ID của các sản phẩm đó.
        });
        resolve({
          status: "ERR",
          message: `San pham voi id: ${arrId.join(",")} khong du hang`,
        });
      } else { //nếu newData=[] :Nếu không có sản phẩm nào không đủ hàng, tiếp tục quá trình tạo đơn đặt hàng mới bằng cách sử dụng hàm Order.create.
        const createdOrder = await Order.create({
          orderItems,
          shippingAddress: {
            fullName,
            address,
            city,
            phone,
          },
          paymentMethod,
          deliveryMethod,
          itemsPrice,
          shippingPrice,
          totalPrice,
          user,
          isPaid,
          paidAt,
        });
        // console.log("my-order", createdOrder)
        resolve({
              status: "OK",
              message: "success",
        });
        // if (createdOrder) {
        //   await EmailService.sendEmailCreateOrder(email, orderItems);
        //   resolve({
        //     status: "OK",
        //     message: "success",
        //   });
        // }
      }
    } catch (e) {
      reject(e);
    }
  });
};



const getAllOrderDetails = (id) => {
  return new Promise(async (resolve, reject) => {
      try {
          const order = await Order.find({
              user: id
          }).sort({createdAt: -1, updatedAt: -1})
          if (order === null) {
              resolve({
                  status: 'ERR',
                  message: 'The order is not defined'
              })
          }

          resolve({
              status: 'OK',
              message: 'SUCESSS',
              data: order
          })
      } catch (e) {
          // console.log('e', e)
          reject(e)
      }
  })
}

const getOrderDetails = (id) => {
  return new Promise(async (resolve, reject) => {
      try {
          const order = await Order.findById({
              _id: id
          })
          if (order === null) {
              resolve({
                  status: 'ERROR',
                  message: 'Đơn hàng không tồn tại'
              })
          }

          resolve({
              status: 'OK',
              message: 'SUCESSS',
              data: order
          })
      } catch (e) {
          // console.log('e', e)
          reject(e)
      }
  })
}

const cancelOrderDetails = (id, data) => {
  return new Promise(async (resolve, reject) => {
      try {
          let order = []
          const promises = data.map(async (order) => {
              const productData = await Product.findOneAndUpdate(
                  {
                  _id: order.product,
                  selled: {$gte: order.amount}
                  },
                  {$inc: {
                      countInStock: +order.amount,
                      selled: -order.amount
                  }},
                  {new: true}
              )
              if(productData) {
                  order = await Order.findByIdAndDelete(id)
                  if (order === null) {
                      resolve({
                          status: 'ERROR',
                          message: 'The order is not defined'
                      })
                  }
              } else {
                  return{
                      status: 'OK',
                      message: 'ERR',
                      id: order.product
                  }
              }
          })
          const results = await Promise.all(promises)
          const newData = results && results[0] && results[0].id
          
          if(newData) {
              resolve({
                  status: 'ERROR',
                  message: `San pham voi id: ${newData} khong ton tai`
              })
          }
          resolve({
              status: 'OK',
              message: 'success',
              data: order
          })
      } catch (e) {
          reject(e)
      }
  })
}

const  updateOrderDetails= (orderId, data) => {
  return new Promise(async(resolve, reject) => {
    try {
      // console.log("orderId: ", orderId)
      const checkOrder = await Order.findOne({_id: orderId})
      // console.log("checkUser", checkUser)
      if(checkOrder === null){
        resolve({ 
          status: 'OK',
          message: "ĐƠn hàng không tồn tại"
        })
      }
      const updateOrderData = await Order.findByIdAndUpdate(orderId, data, {new: true})
      // { new: true } được sử dụng để trả về tài liệu được cập nhật sau khi thực hiện phương thức update
      resolve({ 
        status: 'OK',
        message: "Cập nhật thông tin đơn hàng thành công",
        data: updateOrderData
      })
    } catch (e) {
      reject(e);
    }
  });
};

const getAllOrder = () => {
  return new Promise(async (resolve, reject) => {
      try {
          const allOrder = await Order.find().sort({createdAt: -1, updatedAt: -1})
          resolve({
              status: 'OK',
              message: 'Success',
              data: allOrder
          })
      } catch (e) {
          reject(e)
      }
  })
}

module.exports = {
  createOrder,
  getAllOrderDetails,
  getOrderDetails,
  cancelOrderDetails,
  updateOrderDetails,
  getAllOrder

};
