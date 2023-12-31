const Product = require("../models/ProductModel");

const createProduct = (newProduct) => {
  return new Promise(async (resolve, reject) => {
    const {
      name,
      image,
      type,
      priceOld,
      priceNew,
      countInStock,
      rating,
      description,
      discount,
      selled,
      trademark,
      origin,
    } = newProduct;

    try {
      const checkProduct = await Product.findOne({ name: name });
      if (checkProduct !== null) {
        resolve({
          status: "OK",
          message: "Tên của sản phẩm đã được sử dụng",
        });
      }

      const newProduct = await Product.create({
        name,
        image,
        type,
        priceOld,
        priceNew,
        countInStock,
        rating,
        description,
        discount,
        selled,
        trademark,
        origin,
      });
      if (newProduct) {
        resolve({
          status: "OK",
          message: "SUCCESS",
          data: newProduct,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const updateProduct = (productId, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      // console.log("productId: ", productId);
      const checkProduct = await Product.findOne({ _id: productId });
      // console.log("checkProduct", checkProduct);
      if (checkProduct === null) {
        resolve({
          status: "OK",
          message: "Product không tồn tại",
        });
      }
      const updateProductData = await Product.findByIdAndUpdate(
        productId,
        data,
        { new: true }
      );
      // { new: true } được sử dụng để trả về tài liệu được cập nhật sau khi thực hiện phương thức update
      resolve({
        status: "OK",
        message: "Cập nhật thông tin sản phẩm thành công",
        data: updateProductData,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteProduct = (productId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = await Product.findOne({ _id: productId });
      if (checkProduct === null) {
        resolve({
          status: "OK",
          message: "Product không tồn tại",
        });
      }
      const deleteProductData = await Product.findByIdAndDelete(productId, {
        new: true,
      });
      // { new: true } được sử dụng để trả về tài liệu được cập nhật sau khi thực hiện phương thức update
      resolve({
        status: "OK",
        message: "Xóa sản phẩm dùng thành công",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllProduct = (limit, page, sort, filter) => {
  return new Promise(async (resolve, reject) => {
    try {
      //tham số limit:số sản phẩm tối đa 1 trang; page +1 : trang hiện tại=>vd:page=0 => trang hiện tại là trang đầu(trang1)
      //sort: là 1 object {key: value} sắp xếp theo thứ trự value = "asc": tăng dần, value= "desc": giảm dần,theo key ="1 thuộc tính trong sản phẩm" ko có thì là mặc định
      // filter: là 1 object {key : value} tìm kiếm theo những sản phẩm có key(thuộc tính sản phẩm:vd:name, img) ="name || img || priceOld || ..." có value(giá trị) ="gì đó"
      //limit() để xác định số lượng sản phẩm tối đa trong 1 trang;
      //skip(m) nghĩa là bỏ qua m sản phẩm đầu tiên => skip(page*limit) nghĩa là bỏ qua các sản phẩm của trang trc
      const totalProduct = await Product.countDocuments();
      // console.log(filter)

      if (sort) {
        const objectSort = {};
        const key = sort[1];
        const value = sort[0];
        objectSort[key] = value;
        const allProductSort = await Product.find()
          .limit(limit)
          .skip(page * limit)
          .sort(objectSort);
        // const totalCount = allProductSort.length
        resolve({
          status: "OK",
          message: "Danh sách tất cả sản phẩm",
          data: allProductSort,
          total: totalProduct,
          pageCurrent: page + 1,
          totalPages: Math.ceil(totalProduct / limit), //tổng số  trang
        });
      }

      if (filter) {
        const key = filter[0];
        const value = filter[1];
        if (key === "priceNew") {
          const [min, max] = value.split("-");
          const priceFilter = {
            $gte: parseFloat(min), // Greater than or equal to min
            $lte: parseFloat(max), // Less than or equal to max
          };

          const allProductFilter = await Product.find({ [key]: priceFilter })
            .limit(limit)
            .skip(page * limit);

          resolve({
            status: "OK",
            message: "Danh sách tất cả sản phẩm",
            data: allProductFilter,
            total: totalProduct,
            pageCurrent: page + 1,
            totalPages: Math.ceil(totalProduct / limit),
          });
        } else {
          // const  allProductOnlyFilter = await Product.find({ [key]:{ '$regex': value } })
          const allProductFilter = await Product.find({[key]: { $regex: value },}).limit(limit).skip(page * limit);
          // const totalCount2 = allProductOnlyFilter.length
          resolve({
            status: "OK",
            message: "Danh sách tất cả sản phẩm",
            data: allProductFilter,
            total: totalProduct,
            pageCurrent: page + 1,
            totalPages: Math.ceil(totalProduct / limit), //tổng số  trang
          });
        }
      }

      const allProduct = await Product.find()
        .limit(limit)
        .skip(page * limit);

      resolve({
        status: "OK",
        message: "Danh sách tất cả sản phẩm",
        data: allProduct,
        total: totalProduct,
        pageCurrent: page + 1,
        totalPages: Math.ceil(totalProduct / limit), //tổng số  trang
      });
    } catch (e) {
      reject(e);
    }
  });
};

// const getProductsByType = async (type, limit, page, sort, filter) => {
//   try {
//     // Bước 1: Tính tổng số lượng sản phẩm theo loại
//     const totalProduct = await Product.countDocuments({ type: { '$regex': type, '$options': 'i' } });

//     // Bước 2: Xây dựng đối tượng query để lọc dữ liệu theo loại
//     let query = { type: { '$regex': type, '$options': 'i' } };

//     // Bước 3: Kiểm tra xem có bộ lọc không
//     if (filter) {
//       const [filterKey, filterValue] = filter;
//       switch (filterKey) {
//         case 'priceNew':
//           const [minPrice, maxPrice] = filterValue.split('-');
//           query['priceNew'] = { '$gte': parseInt(minPrice), '$lte': parseInt(maxPrice) };
//           break;
//         case 'origin':
//           query['origin'] = { '$regex': filterValue, '$options': 'i' };
//           break;
//         case 'rating':
//           query['rating'] = { '$gte': parseInt(filterValue) };
//           break;
//         // Thêm các trường hợp bộ lọc khác nếu cần

//         default:
//           break;
//       }
//     }

//     // Bước 4: Lấy danh sách sản phẩm dựa trên loại và bộ lọc
//     const allProduct = await Product.find(query)
//       .limit(limit)
//       .skip(page * limit);

//     // Bước 5: Kiểm tra xem có yêu cầu sắp xếp không
//     if (sort) {
//       const [sortDirection, sortKey] = sort;
//       const sortObject = {};
//       sortObject[sortKey] = sortDirection;

//       // Bước 6: Nếu có yêu cầu sắp xếp, sắp xếp danh sách sản phẩm
//       const allProductSort = await Product.find(query)
//         .limit(limit)
//         .skip(page * limit)
//         .sort(sortObject);

//       // Bước 7: Trả về kết quả với danh sách đã sắp xếp
//       return {
//         status: 'OK',
//         message: `Danh sách sản phẩm loại ${type}`,
//         data: allProductSort,
//         total: totalProduct,
//         pageCurrent: page + 1,
//         totalPages: Math.ceil(totalProduct / limit),
//       };
//     } else {
//       // Bước 8: Nếu không có yêu cầu sắp xếp, trả về danh sách không sắp xếp
//       return {
//         status: 'OK',
//         message: `Danh sách sản phẩm loại ${type}`,
//         data: allProduct,
//         total: totalProduct,
//         pageCurrent: page + 1,
//         totalPages: Math.ceil(totalProduct / limit),
//       };
//     }
//   } catch (e) {
//     // Bước 9: Xử lý lỗi nếu có
//     return {
//       status: 'Error',
//       message: 'Đã xảy ra lỗi',
//       error: e.message,
//     };
//   }
// };

// Sử dụng hàm
// const result = await getAllProductByType('Electronics', 10, 0, ['desc', 'price'], ['priceRange', '100-500']);
// console.log(result);


const getProductsByType = (type, name, priceNew, rating, origin, limit, page, sort) => {
  return new Promise(async (resolve, reject) => {
    try {
      let query = {};
      
      // Xây dựng query dựa trên các tham số lọc
      if (type) {
        query.type = type;
      }
      if (name) {
        query.name = { $regex: name, '$options': 'i'  };
      }
      if (priceNew) {
        const [min, max] = priceNew.split("-");
        const priceFilter = {
          $gte: parseFloat(min), // Greater than or equal to min
          $lte: parseFloat(max), // Less than or equal to max
        };
        query.priceNew = priceFilter;
      }
      if (rating) {
        query.rating = { $gte: rating };
      }
      if (origin) {
        query.origin = { $regex: origin , '$options': 'i' };
      }

      const totalProduct = await Product.countDocuments(query);

      if (sort) {
        const objectSort = {};
        const key = sort[1];
        const value = sort[0];
        objectSort[key] = value;

        const products = await Product.find(query)
          .limit(limit)
          .skip(page * limit)
          .sort(objectSort);

        resolve({
          status: "OK",
          message: "Danh sách sản phẩm theo điều kiện",
          data: products,
          total: totalProduct,
          pageCurrent: page + 1,
          totalPages: Math.ceil(totalProduct / limit),
        });
      } else {
        const products = await Product.find(query).limit(limit).skip(page * limit);

        resolve({
          status: "OK",
          message: "Danh sách sản phẩm theo điều kiện",
          data: products,
          total: totalProduct,
          pageCurrent: page + 1,
          totalPages: Math.ceil(totalProduct / limit),
        });
      }
    } catch (error) {
      reject({
        status: "ERROR",
        message: "Có lỗi xảy ra khi lấy danh sách sản phẩm",
        error: error.message,
      });
    }
  });
};


const getDetailProduct = (productId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const product = await Product.findOne({ _id: productId });
      if (product === null) {
        resolve({
          status: "OK",
          message: "Product không tồn tại",
        });
      }

      resolve({
        status: "OK",
        message: "Lấy thành công sản phẩm",
        data: product,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllTypeProduct = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allTypeProduct = await Product.distinct("type");

      resolve({
        status: "OK",
        message: "Lấy thành công loại sản phẩm",
        data: allTypeProduct,
      });
    } catch (e) {
      reject(e);
    }
  });
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
