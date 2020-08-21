const Products = require('../models/Product');

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const query = ctx.query && ctx.query.query;
  
  if (query) {
    const products = await Products.find({$text: {$search: query}});
    ctx.body = {products};
  }
};
