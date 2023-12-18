const resolvers = {
    Query: {
        users: async (_, __, { dataSources }) => {
            const { results: userData } = await dataSources.db.collection("users").list();
            const users = await Promise.all(
                userData.map(async ({ key }) => (await userData.get(key)).props)
              );
            return users;
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