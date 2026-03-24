import Product from "../models/product.model.js";

export const getCartProducts = async (req, res) => {
    try {
        const products = await Product.find({ _id: { $in: req.user.cartItems } });
        const cartItems = products.map((product) => {
            const item = req.user.cartItems.find((cartItem) => cartItem.id === product.id);
            return { ...product.toJSON(), quantity: item.quantity };
        });
        res.json(cartItems);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};  

