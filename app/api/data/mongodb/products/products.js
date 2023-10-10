const { ObjectId } = require("mongodb");
import { connectToDatabase } from "../main";

export async function getProducts() {
    try {
        let { db } = await connectToDatabase();
        let products = await db.collection("products").find().toArray();
        return products;
    } catch (error) {
        client.close();
        return [];
    }
}

export async function getProductById(_id) {
    try {
        let { db } = await connectToDatabase();
        let product = await db
            .collection("products")
            .find({ _id: new ObjectId(_id) })
            .toArray();
        return product[0] ? product[0] : null;
    } catch (error) {
        client.close();
        return null;
    }
}

export async function createProduct(
    title,
    description,
    img_url,
    price,
    featured
) {
    try {
        let { db } = await connectToDatabase();
        const products = await db.collection("products");
        const newProduct = {
            title: title,
            description: description,
            img_url: img_url,
            price: price,
            featured: featured
        };
        const insertedId = (await products.insertOne(newProduct)).insertedId;
        let product = await db
            .collection("products")
            .find({ _id: new ObjectId(insertedId) })
            .toArray();
        return product[0] ? product[0] : null;
    } catch (error) {
        client.close();
        return "Problem creating product";
    }
}

export async function updateProductById(
    _id,
    title,
    description,
    img_url,
    price,
    featured
) {
    try {
        let { db } = await connectToDatabase();
        const products = await db.collection("products");
        const updated = await products.updateOne(
            { _id: new ObjectId(_id) },
            {
                $set: {
                    title: title,
                    description: description,
                    img_url: img_url,
                    price: price,
                    featured: featured
                }
            }
        );
        if (updated.matchedCount) {
            let product = await db
                .collection("products")
                .find({ _id: new ObjectId(_id) })
                .toArray();
            return product[0] ? product[0] : null;
        }
    } catch (error) {
        client.close();
        return "Problem updating product";
    }
}

export async function deleteProductById(_id) {
    try {
        let { db } = await connectToDatabase();
        let deleted = await db
            .collection("products")
            .deleteOne({ _id: new ObjectId(_id) });
        return deleted.deletedCount
            ? `Product id ${_id} deleted`
            : "Problem deleting product";
    } catch (error) {
        return "Problem deleting product";
    }
}
