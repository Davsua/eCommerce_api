const { Products } = require("../models/products.model");
const { Carts } = require("../models/carts.model");

const { catchAsync } = require("../utils/catchAsync");
const { filterObj } = require("../utils/filterObjects");

const { AppError } = require("../utils/appError");
const { productsInCart } = require("../models/productsInCar.model");
const { user } = require("pg/lib/defaults");

exports.getUserCart = catchAsync(async (req, res, next) => {
  const { currentUser } = req;

  const userCart = await Carts.findOne({
    where: { status: "active", userId: currentUser.id },
    //through = toma la info y la envia x sequelize a la tabla que se le indique en initModels
    include: [{ model: Products, through: { where: { status: "active" } } }],
  });

  res.status(200).json({
    status: "succes",
    data: userCart,
  });
});

exports.addProductToCart = catchAsync(async (req, res, next) => {
  const { currentUser } = req;
  const { productId, quantity } = req.body;
  console.log(req.body);

  //check the product doesnt exced the max quantity
  const product = await Products.findOne({
    where: { status: "active", id: productId },
  });

  console.log(product);

  if (quantity > product.quantity) {
    return next(
      new AppError(400, `this product only has ${product.quantity} items`)
    );
  }

  //check if user have an active cart
  const cart = await Carts.findOne({
    where: { status: "active", userId: currentUser.id },
  });

  //if product doesnt exist
  if (!cart) {
    const newCart = await Carts.create({
      userId: currentUser.id,
    });
    await productsInCart.create({ productId, cartId: newCart.id, quantity });
  } else {
    //check if the product is in the car already
    const productExist = await productsInCart.findOne({
      where: { cartId: cart.id, productId },
    });

    // if producst already exist
    if (productExist && productExist.status === "active") {
      return next(new AppError(400, "This product is already in the cart"));
    }

    if (productExist && productExist.status === "deleted") {
      await productExist.update({ status: "active", quantity });
    }

    if (!productExist) {
      await productsInCart.create({ cartId: cart.id, productId, quantity });
    }
  }

  res.status(200).json({
    status: "succes",
  });
});

exports.updateCartProduct = catchAsync(async (req, res, next) => {
  const { currentUser } = req;
  const { productId, quantity } = req.body;

  const product = await Products.findOne({
    where: { status: "active", id: productId },
  });

  if (quantity > product.quantity) {
    return next(
      new AppError(400, `this product only has ${product.quantity} items`)
    );
  }

  //find user cart
  const userCart = await Carts.findOne({
    where: { status: "active", userId: currentUser.id },
  });

  if (!userCart) {
    return next(new AppError(400, "you dont have a cart yet"));
  }

  const productInCart = await productsInCart.findOne({
    where: { status: "active", cartId: userCart.id, productId },
  });

  if (!productInCart) {
    return next(new AppError(404, `cant update product, isnt in the cart yet`));
  }

  if (quantity === 0) {
    productInCart.update({
      quantity: 0,
      status: "deleted",
    });
  }

  //update product into the cart
  if (quantity > 0) {
    await productInCart.update({ quantity });
  }

  res.status(200).json({
    status: "succes",
  });
});

exports.removeProductFromCart = catchAsync(async (req, res, next) => {
  const { currentUser } = req;
  const { productId } = req.params;

  const userCart = await Carts.findOne({
    where: { status: "active", userId: currentUser.id },
  });

  if (!userCart) {
    return next(new AppError(400, "you dont have a cart yet"));
  }

  const productInCart = await productsInCart.findOne({
    where: { status: "active", cartId: userCart.id, productId },
  });

  if (!productInCart) {
    return next(new AppError(404, `cant update product, isnt in the cart yet`));
  }

  await productInCart.update({ status: "deleted", quantity: 0 });

  res.status(200).json({
    status: "succes",
  });
});

exports.purchaseCart = catchAsync(async (req, res, next) => {
  const { currentUser } = req;

  const cart = await Carts.findOne({
    where: { status: "active", userId: currentUser.id },
    include: [
      {
        model: Products,
        through: { where: { status: "active" } },
      },
    ],
  });

  if (!cart) {
    return next(new AppError(404, "This user does not have a cart yet"));
  }

  let totalPrice = 0;

  const cartPromises = cart.products.map(async (product) => {
    await product.productInCart.update({ status: "purchased" });

    const productPrice = product.price * product.productInCart.quantity;

    totalPrice += productPrice;

    const newQty = product.quantity - product.productInCart.quantity;

    return await product.update({ quantity: newQty });
  });

  await Promise.all(cartPromises);

  await cart.update({ status: "purchased" });

  const newOrder = await Order.create({
    userId: currentUser.id,
    cartId: cart.id,
    issuedAt: Date.now().toLocaleString(),
    totalPrice,
  });

  res.status(201).json({
    status: "success",
    data: { newOrder },
  });
});
