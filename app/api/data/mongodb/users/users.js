const { ObjectId } = require('mongodb');
import { connectToDatabase } from "../main";

export async function getUsers(){
    try {
        let { db } = await connectToDatabase();
        let users = await db.collection("users").find().toArray()
        return users;
    } catch (error) {
        client.close();
        return [];
    }
}

export async function getUserById(_id){
    try {
        let { db } = await connectToDatabase();
        let user = await db.collection("users").find({_id: new ObjectId(_id)}).toArray();
        return user[0] ? user[0] : null;				
    } catch (error) {
        client.close();
        return null;
    }
}

export async function getUserByEmail(email){
    try {
        let { db } = await connectToDatabase();
        let user = await db.collection("users").find({email: email}).toArray();
        return user[0] ? user[0] : null;
    } catch (error) {
        client.close();
        return null;
    }
}

export async function createUser(fullname, email, password, cellphone, rol){
    try {
        let { db } = await connectToDatabase();
        const users = await db.collection("users");
        const newUser = {
            fullname: fullname,
            email: email,
            password: password,
            cellphone:cellphone,
            rol: rol,
        };
        const insertedId = (await users.insertOne(newUser)).insertedId;
        let user = await db.collection("users").find({_id: new ObjectId(insertedId)}).toArray();
        return user[0] ? user[0] : null;
    } catch (error) {
        client.close();
        return 'Problem creating user'
    }
}

export async function updateUserById(_id, fullname, email, password, cellphone){
    try {
        let { db } = await connectToDatabase();
        const users = await db.collection("users");
        const updated = await users.updateOne(
            { _id: new ObjectId(_id) },
            {
                $set: {
                    fullname: fullname,
                    email: email,
                    password: password,
                    cellphone:cellphone
                }
            }
        );
        if (updated.matchedCount){
            let user = await db.collection("users").find({_id: new ObjectId(_id)}).toArray();
            return user[0] ? user[0] : null;
        }
    } catch (error) {
        client.close();
        return 'Problem updating user'
    }
}

export async function deleteUserById(_id){
    try {
        let { db } = await connectToDatabase();
        let deleted = await db.collection("users").deleteOne({_id: new ObjectId(_id)});
        return deleted.deletedCount ? `User id ${_id} deleted` : 'Problem deleting user'; 			
    } catch (error) {
        return 'Problem deleting user';
    }
}