import Product from "../models/Product.js";

export async function list(_req, res, next) {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (e) {
        next(e);
    }
}

export async function create(req, res, next) {
    try {
        const { name, description, price, image } = req.body;
        const product = await Product.create({ name, description, price, image });
        res.json(product);
    } catch (e) {
        next(e);
    }
}

export async function update(req, res, next) {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(product);
    } catch (e) {
        next(e);
    }
}

export async function remove(req, res, next) {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted successfully"});
    } catch (e) {
        next(e);    
    }
}
