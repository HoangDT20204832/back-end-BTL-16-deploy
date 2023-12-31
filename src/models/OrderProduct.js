const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    orderItems: [
        {
            name: { type: String, required: true },
            amount: { type: Number, required: true },      //số lượng sản phẩm đặt hàng trong đơn hàng đó
            image: { type: String, required: true },
            priceOld: { type: String, required: true},
            priceNew: { type: Number, required: true },
            discount: { type: Number },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
        },
    ],

    shippingAddress: {                                          // giao hàng
        fullName: { type: String, required: true },             //tên người nhận
        address: { type: String, required: true },              //địa chỉ giao hàng
        city: { type: String, required: true },                 //thành phố
        phone: { type: Number, required: true },                //sdt của người nhận
    },
    paymentMethod: { type: String, required: true },           //phương thức thanh toán
    deliveryMethod: { type: String, required: true },           //phương thức thanh toán
    itemsPrice: { type: Number, required: true },              //tổng giá các sản phẩm
    shippingPrice: { type: Number, required: true },           // phí giao hàng
    totalPrice: { type: Number, required: true },             //tổng giá tiền cuối cùng của đơn hàng
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isPaid: { type: Boolean, default: false },                 // xác định đã thanh toán hay chưa
    paidAt: { type: Date },                                    //thời điểm thanh toán
    isDelivered: { type: Boolean, default: false },             // các định đã giao hàng hay chưa 
    deliveredAt: { type: Date },                                // thời điểm giao hàng
},
    {
        timestamps: true,//tự động thêm hai trường "createdAt" và "updatedAt" cho mỗi bản ghi để theo dõi thời gian tạo và cập nhật.
    }
);
const Order = mongoose.model('Order', orderSchema);
module.exports = Order