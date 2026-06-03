const Product = require('../models/Product');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const { category, subCategory, popular, trending, bestseller, smChoice, minPrice, maxPrice, sort, search } = req.query;
    let query = {};
    if (category) query.category = { $regex: `^${category}$`, $options: 'i' };
    if (subCategory) {
      // Strip 'saree' and whitespace so 'Silk' matches 'Silk Saree' and vice versa
      const cleanSub = subCategory.replace(/saree/i, '').trim();
      query.subCategory = { $regex: cleanSub, $options: 'i' };
    }
    if (popular === 'true') query.popular = true;
    if (trending === 'true') query.trending = true;
    if (bestseller === 'true') query.bestseller = true;
    if (smChoice === 'true') query.smChoice = true;
    
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    
    const hasMinPrice = minPrice !== undefined && minPrice !== '';
    const hasMaxPrice = maxPrice !== undefined && maxPrice !== '';
    if (hasMinPrice && hasMaxPrice) {
      const minP = Number(minPrice);
      const maxP = Number(maxPrice);
      if (!isNaN(minP) && !isNaN(maxP) && minP > maxP) {
        req.query.minPrice = maxP;
        req.query.maxPrice = minP;
      }
    }

    if (hasMinPrice || hasMaxPrice) {
      query.price = {};
      if (hasMinPrice && !isNaN(Number(minPrice))) query.price.$gte = Number(minPrice);
      if (hasMaxPrice && !isNaN(Number(maxPrice))) query.price.$lte = Number(maxPrice);
    }
    
    let sortObj = {}
    if (sort === 'priceAsc') sortObj.price = 1;
    else if (sort === 'priceDesc') sortObj.price = -1;
    else sortObj.createdAt = -1; // Newest by default

    console.log('Product query:', query, 'sort:', sortObj);
    const products = await Product.find(query).sort(sortObj);
    console.log('Products matched:', products.length);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const { name, price, category, subCategory, image, description, stock, popular, trending, bestseller, smChoice } = req.body;
    
    const product = new Product({
      name,
      price,
      category,
      subCategory: subCategory || '',
      image: image || '/uploads/sample.jpg', // fallback
      description,
      stock,
      popular: popular || false,
      trending: trending || false,
      bestseller: bestseller || false,
      smChoice: smChoice || false
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const { name, price, category, subCategory, image, description, stock, popular, trending, bestseller, smChoice } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.price = price || product.price;
      product.category = category || product.category;
      product.subCategory = subCategory !== undefined ? subCategory : product.subCategory;
      product.image = image || product.image;
      product.description = description || product.description;
      product.stock = stock !== undefined ? stock : product.stock;
      product.popular = popular !== undefined ? popular : product.popular;
      product.trending = trending !== undefined ? trending : product.trending;
      product.bestseller = bestseller !== undefined ? bestseller : product.bestseller;
      product.smChoice = smChoice !== undefined ? smChoice : product.smChoice;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
