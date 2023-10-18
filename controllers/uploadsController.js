const { StatusCodes } = require('http-status-codes');
const path = require('path');
const CustomError = require('../errors');

const uploadProductImage = async (req, res) => {
  //test no empty file
  if (!req.files) {
    throw new CustomError.BadRequestError('no file uploaded');
  }

  const productImage = req.files.image;

  //test format
  if (!productImage.mimetype.startsWith('image')) {
    throw new CustomError.BadRequestError('please upload image');
  }

  //test size
  const maxSize = 1024 * 1024; //1MB;
  if (productImage.size > maxSize) {
    throw new CustomError.BadRequestError(
      'please upload image smaller than 1KB'
    );
  }

  const imagePath = path.join(
    __dirname,
    `../public/uploads/${productImage.name}`
  );
  await productImage.mv(imagePath);
  return res
    .status(StatusCodes.OK)
    .json({ image: { src: `/uploads/${productImage.name}` } });
};

module.exports = { uploadProductImage };
