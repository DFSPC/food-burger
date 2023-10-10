import {
    getUsers,
    getUserById,
    createUser,
    getUserByEmail,
    updateUserById,
    deleteUserById
} from "../../mongodb/users/users";
import { validateToken, createToken } from "./../../../common";
import { GraphQLError } from "graphql";

const graphql = require("graphql");
const bcrypt = require("bcryptjs");

export const UserType = new graphql.GraphQLObjectType({
    name: "User",
    fields: {
        _id: { type: graphql.GraphQLID },
        fullname: { type: graphql.GraphQLString },
        password: { type: graphql.GraphQLString },
        cellphone: { type: graphql.GraphQLFloat },
        email: { type: graphql.GraphQLString },
        rol: { type: graphql.GraphQLString },
        token: { type: graphql.GraphQLString }
    }
});

export const getUsersTask = {
    type: new graphql.GraphQLList(UserType),
    resolve: async (root, args, context, info) => {
        if (validateToken(context.req)) {
            return getUsers();
        } else {
            return new GraphQLError("User is not authenticated", {
                extensions: {
                    code: "UNAUTHENTICATED",
                    http: { status: 401 }
                }
            });
        }
    }
};

export const getUserByIdTask = {
    type: UserType,
    args: {
        _id: {
            type: new graphql.GraphQLNonNull(graphql.GraphQLID)
        }
    },
    resolve: async (root, { _id }, context, info) => {
        return getUserById(_id);
    }
};

export const getUserByEmailPasswordTask = {
    type: UserType,
    args: {
        email: {
            type: new graphql.GraphQLNonNull(graphql.GraphQLString)
        },
        password: {
            type: new graphql.GraphQLNonNull(graphql.GraphQLString)
        }
    },
    resolve: async (root, { email, password }, context, info) => {
        let user = await getUserByEmail(email);
        if (user) {
            const validatePassword = bcrypt.compareSync(
                password,
                user.password
            );
            if (validatePassword) {
                let token = createToken(user);
                return { ...user, token: token };
            }
        }
        return new GraphQLError("User is not authenticated", {
            extensions: {
                code: "UNAUTHENTICATED",
                http: { status: 401 }
            }
        });
    }
};

export const createUserTask = {
    type: UserType,
    args: {
        fullname: {
            type: new graphql.GraphQLNonNull(graphql.GraphQLString)
        },
        password: {
            type: new graphql.GraphQLNonNull(graphql.GraphQLString)
        },
        cellphone: {
            type: new graphql.GraphQLNonNull(graphql.GraphQLFloat)
        },
        email: {
            type: new graphql.GraphQLNonNull(graphql.GraphQLString)
        }
    },
    resolve: async (
        root,
        { fullname, email, password, cellphone },
        context,
        info
    ) => {
        const encryptedPassword = bcrypt.hashSync(password, 10);
        let userData = await createUser(
            fullname,
            email,
            encryptedPassword,
            cellphone,
            "consumer"
        );
        let token = createToken(userData);
        return { ...userData, token: token };
    }
};

export const updateUserByIdTask = {
    type: UserType,
    args: {
        _id: {
            type: new graphql.GraphQLNonNull(graphql.GraphQLID)
        },
        fullname: {
            type: new graphql.GraphQLNonNull(graphql.GraphQLString)
        },
        password: {
            type: new graphql.GraphQLNonNull(graphql.GraphQLString)
        },
        cellphone: {
            type: new graphql.GraphQLNonNull(graphql.GraphQLString)
        },
        email: {
            type: new graphql.GraphQLNonNull(graphql.GraphQLString)
        }
    },
    resolve: async (
        root,
        { _id, fullname, password, cellphone, email },
        context,
        info
    ) => {
        if (validateToken(context.req)) {
            return updateUserById(_id, fullname, email, password, cellphone);
        } else {
            return new GraphQLError("User is not authenticated", {
                extensions: {
                    code: "UNAUTHENTICATED",
                    http: { status: 401 }
                }
            });
        }
    }
};

export const deleteUserByIdTask = {
    type: graphql.GraphQLString,
    args: {
        _id: {
            type: new graphql.GraphQLNonNull(graphql.GraphQLID)
        }
    },
    resolve: async (root, { _id }, context, info) => {
        if (validateToken(context.req)) {
            return deleteUserById(_id);
        } else {
            return new GraphQLError("User is not authenticated", {
                extensions: {
                    code: "UNAUTHENTICATED",
                    http: { status: 401 }
                }
            });
        }
    }
};
