const resolvers = {
    Query: {
        users: async (_, __, { dataSources }) => {
            const users = await dataSources.db.collection("users").list();
            return users.map((user) => ({
                id: user.id,
                ...user
            }));
        },
        getUserById: async (_, { userId }, { dataSources }) => {
            try {
                const userDoc = await dataSources.db.collection("users").get(userId);
                if (!userDoc.exists) {
                    throw new Error("User not found");
                }
                return userDoc;
            } catch (error) {
                throw new Error(`Error getting user by ID: ${error.message}`);
            }
        },
    },
    Mutation: {
        async addUser(_, { firstName, lastName, email, userName }, { dataSources }) {
          const ref = dataSources.db.collection("users").set(firstName, { firstName, lastName, email, userName });
          return ref.firstName;
        },
    },
};

module.exports = resolvers;