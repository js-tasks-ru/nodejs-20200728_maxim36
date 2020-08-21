const Categories = require('../models/Category');
const Projection = require('../libs/projection');


module.exports.categoryList = async function categoryList(ctx, next) {
  const categories = await Categories.find({}, '', {lean: true})
    .populate({path: 'subcategories', options: {lean: true}});
  
  const categoriesProjection = categories.map( (item) => {

    const projCategories = new Projection(item).project('_id->id').without('__v').value;
    const projSubcategories = projCategories.subcategories.map( (item) => {
      return new Projection(item).project('_id->id').without('__v').value
    })
    
    projCategories.subcategories = projSubcategories;
    return projCategories;
  })

  ctx.body = {categories: categoriesProjection};
  
};
