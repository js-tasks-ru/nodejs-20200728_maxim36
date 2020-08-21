const mongoose = require('mongoose');
const Products = require('../models/Product');
const Projection = require('../libs/projection');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const subcategoryId = ctx.query && ctx.query.subcategory;
  if (subcategoryId) {
    const isValid = mongoose.Types.ObjectId.isValid(subcategoryId);
    if (isValid) {
      const products = await Products.find({subcategory: subcategoryId}, '', {lean: true});
      const productsProjection = products.map( product => {
        return new Projection(product).project('_id->id').without('__v').value;
      });

      if (!productsProjection.length) ctx.status = 404;

      ctx.body = {products:productsProjection};
      
    } else {
      ctx.status = 400;
      ctx.body = 'Subcategory Id is not valid';
    }

  } else {
    return next()
  }

};

module.exports.productList = async function productList(ctx, next) {
  const products = await Products.find({}, '', {lean: true});
  
  const productsProjection = products.map( (product) => {
    return new Projection(product).project('_id->id').value;
  });
  ctx.body = {products: productsProjection};
};

module.exports.productById = async function productById(ctx, next) {
 const {id} = ctx.params;
 const isValidId = mongoose.Types.ObjectId.isValid(id);
 
 if(!isValidId) {
   ctx.status = 400;
   ctx.body = "Product Id is not valid";
   return;
 }

 const product = await Products.findById(id, '', {lean: true});

 if(!product) {
   ctx.status = 404;
   ctx.body = 'Product not found';
   return;
 }
 const productProjected = new Projection(product).project('_id->id').value;
 ctx.body ={product: productProjected};
};

