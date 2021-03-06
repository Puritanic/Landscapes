require('dotenv').config({
	path: '.env.local',
});

const fs = require('fs');
const path = require('path');
const { ApolloServer, AuthenticationError } = require('apollo-server');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const filePath = path.join(__dirname, 'typeDefs.gql');
const typeDefs = fs.readFileSync(filePath, 'utf-8');
const resolvers = require('./resolvers');

const User = require('./models/User');
const Post = require('./models/Post');

// Verify JWT token passed from client
const getUser = async token => {
	if (token) {
		try {
			return await jwt.verify(token, process.env.JWT_SECRET);
		} catch (err) {
			throw new AuthenticationError('Your sesion has expired. Please sign in again.');
		}
	}

	return null;
};

mongoose
	.connect(
		process.env.MONGO_URI,
		{
			useNewUrlParser: true,
			useCreateIndex: true,
		}
	)
	.then(() => console.log('Connected to MongoDB'))
	.catch(err => console.error('Connection to MongoDB failed:', err));

const server = new ApolloServer({
	typeDefs,
	resolvers,
	formatError: err => ({
		name: err.name,
		message: err.message.replace('Context creation failed:', ''),
	}),
	context: async ({ req }) => {
		const token = req.headers.authorization;
		return {
			User,
			Post,
			currentUser: await getUser(token),
		};
	},
});

// By default we will listen on port 4000
server
	.listen({ port: process.env.PORT || 4000 })
	.then(({ url }) => console.info(`Server up and running on port ${url}`));
