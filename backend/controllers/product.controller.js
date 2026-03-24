import { redis } from '../config/redis.js';
import Product from './../models/product.model.js';


export const getAllProducts = async (req, res) => {
    try{
        const products = await Product.find();
        res.status(200).json(products);
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getFeaturedProducts = async (req, res) => {
    try{
        let featuredProducts = await redis.get('featuredProducts');
        if(featuredProducts){
            return res.status(200).json(JSON.parse(featuredProducts));
        }

        featuredProducts = await Product.find({ isFeatured: true }).lean();
        if (!featuredProducts) {
            return res.status(404).json({ message: 'No featured products found' });
        }
        
        await redis.set('featuredProducts', JSON.stringify(featuredProducts));

        res.status(200).json(featuredProducts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const createProduct = async (req, res) => {
    try{
        const { name, description, price, image , category } = req.body;
        let cloudinaryResponse = null;
        if (image) {
            cloudinaryResponse = await cloudinary.uploader.upload(image, {
                folder: 'products',
            });
        }
        const product = await Product.create({
            name,
            description,
            price,
            image: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "",
            category,
        });
        
        res.status(201).json(product);

    }
        catch (error) {
        res.status(500).json({ message: error.message });
        }
}
