const productService = require("../services/ProductService");
const JwtService = require("../services/JwtService");
const createProduct = async (req, res) => {
  try {
    // console.log("req.body", req.body);
    const { name, image, type, priceOld, priceNew,countInStock,rating, 
           description,discount,selled, trademark, origin} = req.body;
    if (!name || !image || !type || !priceOld || !priceNew || !countInStock || !rating) {
      return res.status(200).json({
        status: "Error",
        message: "Bạn cần điền đầy đủ thông tin",
      });
    } 
    

    const response = await productService.createProduct(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const updateProduct = async (req, res) => {
    try {
     const productId = req.params.id;
     const data = req.body;
  
     if (!productId) {
      return res.status(200).json({
        status: "ERR",
        message: "productId là bắt buộc",
      });
     }
      const response = await productService.updateProduct(productId, data);
      return res.status(200).json(response);
    } catch (e) {
      return res.status(404).json({
        message: e,
      });
    }
  };

const deleteProduct = async (req, res) => {
try {
    const productId = req.params.id;

    if (!productId) {
    return res.status(200).json({
    status: "ERR",
    message: "productId là bắt buộc",
    });
    }
    const response = await productService.deleteProduct(productId);
    return res.status(200).json(response);
} catch (e) {
    return res.status(404).json({
    message: e,
    });
}
};
const getAllProduct = async (req, res) => {
    try {
      const {limit, page, sort, filter} = req.query
      const response = await productService.getAllProduct(Number(limit) , Number(page) || 0,  sort,filter );
      return res.status(200).json(response);
    } catch (e) {
      return res.status(404).json({
        message: e,
      });
    }
  };

  const getProductsByType = async (req, res) => {
    try {
      const {type, name, priceNew, rating, origin, limit, page, sort} = req.query
      const response = await productService.getProductsByType(type,name, priceNew,rating,origin,Number(limit) , Number(page) || 0,  sort );
      return res.status(200).json(response);
    } catch (e) {
      return res.status(404).json({
        message: e,
      });
    }
  };

const getDetailProduct = async (req, res) => {
try {
    const productId = req.params.id;

    if (!productId) {
    return res.status(200).json({
        status: "ERROR",
        message: "productId là bắt buộc",
    });
    }
    const response = await productService.getDetailProduct(productId);
    return res.status(200).json(response);
    } catch (e) {
    return res.status(404).json({
        message: e,
    });
    }
};

const getAllTypeProduct = async (req, res) => {
  try {
      const response = await productService.getAllTypeProduct();
      return res.status(200).json(response);
      } catch (e) {
      return res.status(404).json({
          message: e,
      });
      }
  };



module.exports = {
    createProduct,
    updateProduct,
    getDetailProduct,
    deleteProduct,
    getAllProduct,
    getAllTypeProduct,
    getProductsByType
};
