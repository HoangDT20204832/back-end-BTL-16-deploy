const mongoose = require('mongoose')
//required là thuộc tính bắt bc phải nhập 
const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        image: { type: String, required: true },
        type: { type: String, required: true },          //loại sản phẩm
        priceOld: { type: Number, required: true },
        priceNew: { type: Number, required: true },                            
        countInStock: { type: Number, required: true },  //số lượng sản phẩm đó còn trong kho
        rating: { type: Number, required: true },        //đánh giá sản phẩm
        description: { type: String },                   //miêu tả sản phẩm
        discount: { type: Number },
        selled: { type: Number },
        trademark: {type: String},                    //thương hiệu
        origin: { type: String}                       //xuất xứ
    },
    {
        timestamps: true,
    }
);
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
