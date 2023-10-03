'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Koa = _interopDefault(require('koa'));
var KoaRouter = _interopDefault(require('koa-router'));
var koaLogger = _interopDefault(require('koa-logger'));
var koaBody = _interopDefault(require('koa-bodyparser'));
var koaCors = _interopDefault(require('@koa/cors'));
var apolloServerKoa = require('apollo-server-koa');
var merge = _interopDefault(require('lodash.merge'));
var GraphQLJSON = _interopDefault(require('graphql-type-json'));
var graphqlTools = require('graphql-tools');
var request = _interopDefault(require('request-promise-native'));
var graphql = require('graphql');

/**
 * Creates a request following the given parameters
 * @param {string} url
 * @param {string} method
 * @param {object} [body]
 * @param {boolean} [fullResponse]
 * @return {Promise.<*>} - promise with the error or the response object
 */
async function generalRequest(url, method, body, fullResponse) {
	console.log(`URL is ${url} in generalRequest`);
	const parameters = {
		method,
		uri: encodeURI(url),
		body,
		json: true,
		strictSSL: false, //CERT problem, only for debugging...
		resolveWithFullResponse: fullResponse
	};
	if (process.env.SHOW_URLS) {
		// eslint-disable-next-line
		console.log(url);
	}

	try {
		return await request(parameters);
	} catch (err) {
		return err;
	}
}

/**
 * Adds parameters to a given route
 * @param {string} url
 * @param {object} parameters
 * @return {string} - url with the added parameters
 */
function addParams(url, parameters) {
	let queryUrl = `${url}?`;
	for (let param in parameters) {
		// check object properties
		if (
			Object.prototype.hasOwnProperty.call(parameters, param) &&
			parameters[param]
		) {
			if (Array.isArray(parameters[param])) {
				queryUrl += `${param}=${parameters[param].join(`&${param}=`)}&`;
			} else {
				queryUrl += `${param}=${parameters[param]}&`;
			}
		}
	}
	return queryUrl;
}

/**
 * Generates a GET request with a list of query params
 * @param {string} url
 * @param {string} path
 * @param {object} parameters - key values to add to the url path
 * @return {Promise.<*>}
 */
function getRequest(url, path, parameters) {
	console.log(`URL is ssss ${url}`);
	const queryUrl = addParams(`${url}/${path}`, parameters);
	console.log(`GENERAL REQUEST IS BEING CALLED WITHL ${queryUrl}`);
	return generalRequest(queryUrl, 'GET');
}

/**
 * Merge the schemas in order to avoid conflicts
 * @param {Array<string>} typeDefs
 * @param {Array<string>} queries
 * @param {Array<string>} mutations
 * @return {string}
 */
function mergeSchemas(typeDefs, queries, mutations) {
	return `${typeDefs.join('\n')}
    type Query { ${queries.join('\n')} }
    type Mutation { ${mutations.join('\n')} }`;
}

function formatErr(error) {
	const data = graphql.formatError(error);
	const { originalError } = error;
	if (originalError && originalError.error) {
		const { path } = data;
		const { error: { id: message, code, description } } = originalError;
		return { message, code, description, path };
	}
	return data;
}

const scheduledPaymentTypeDef = `
    type ScheduledPayment {
        _id: ID!
        user_id: Int
        name: String
        category_id: Int
        account_id: Int
        payment_method: String
        recipient: String
        frequency: String
        start_date: String
        notification_time: String
        periodicity_config: PeriodicityConfigType
    }

    type PeriodicityConfigType {
        time_unit: String
        time_lapse: Int
        days_of_week: [String]
        until: String
    }
    
    input CreateScheduledPayment {
        user_id: Int
        name: String
        category_id: Int
        account_id: Int
        payment_method: String
        recipient: String
        frequency: String
        start_date: String
        notification_time: String
        periodicity_config: CreatePeriodicityConfigInput
    }
      
    input UpdateScheduledPayment {
        _id: ID!
        user_id: Int
        name: String
        category_id: Int
        account_id: Int
        payment_method: String
        recipient: String
        frequency: String
        start_date: String
        notification_time: String
        periodicity_config: UpdatePeriodicityConfigInput
    }
      
    input DeleteScheduledPayment {
        _id: ID!
    }
        
    input CreatePeriodicityConfigInput {
        time_unit: String
        time_lapse: Int
        days_of_week: [String]
        until: String
    }
      
    input UpdatePeriodicityConfigInput {
        time_unit: String
        time_lapse: Int
        days_of_week: [String]
        until: String
    }`;

const scheduledPaymentQueries = `
    allScheduledPayments: [ScheduledPayment]
    scheduledPaymentById(_id: ID!): ScheduledPayment!
`;

const scheduledPaymentMutations = `
    createScheduledPayment(scheduledPayment: CreateScheduledPayment!): ScheduledPayment!
    updateScheduledPayment(_id: ID!, scheduledPayment: CreateScheduledPayment!): ScheduledPayment!
    deleteScheduledPayment(_id: ID!): Int
`;

const authTypeDef = `
    type User {
        _id: ID!
        username: String!
        password: String!
    }
    input UserInput {
        _id: ID!
        username: String!
        password: String!
    }
    type Session {
        userId: String!
        username: String!
        token: String!
    }`;

const authenticationQueries = `
    userById(id: ID!): User!
    validateToken(token: String!): Boolean!
`;

const authenticationMutations = `
    createUser(user: UserInput!): User!
    deleteUser(id: ID!): User!
    updateUser(id: ID!, user: UserInput!): User!

    signIn(username: String!, password: String!): Session!
    signOut(token: String!): Session!
`;

const RecordTypeDef = `
  type RecordType {
    id:ID!
    record_type_id:String
    name: String!
    r_type: String!
    created_at: String!
    updated_at: String!
  }
  input RecordTypeInput{
    name: String!
    r_type: String! 
  }`;

const RecordTypeQueries= `
    allRecordTypes:[RecordType]!
`;
const RecordTypeMutations = `
    createRecordType(RecordType:RecordTypeInput!): RecordType!
`;

// export const RecordsDef = `
//   type Records {
//     id:ID!
//     record_id:Int!
//     user_id:Int!
//     account_id:Int!
//     category_id:Int!
//     name: String!
//     record_type_id:Int!
//     amount:Int!
//     date: String!
//     created_at: String!
//     updated_at: String!
//   }
//   input RecordsInput{
//     record_id:Int!
//     user_id:Int!
//     account_id:Int!
//     category_id:Int!
//     name: String!
//     record_type_id:Int!
//     amount:Int!
//     date: String!
//   }
// `;

// export const RecordsQueries= `
//     allRecords:[Records]!
// `;

// export const RecordsMutations = `
//     createRecords(Records:RecordsInput!): Records!
// `;

// {
//     "id": 1,
//     "record_type_id": null,
//     "name": "string",
//     "r_type": "string",
//     "created_at": "2023-03-14T07:53:39.950Z",
//     "updated_at": "2023-03-14T07:53:39.950Z"
// },

const url = 'localhost';
const port = '7051';
const entryPoint = 'ScheduledPayment';

const URL = `https://${url}:${port}/${entryPoint}`;

const resolvers = {
	Query: {
		allScheduledPayments: (_) =>
			getRequest(`${URL}`, 'list'),
		scheduledPaymentById: (_, { _id }) =>
			generalRequest(`${URL}/list/${_id}`, 'GET')	
	},
	Mutation: {
		createScheduledPayment: (_, scheduledPayment) => 
			generalRequest(`${URL}/`, 'POST', scheduledPayment),
		updateScheduledPayment: (_, { _id, scheduledPayment}) =>
			generalRequest(`${URL}/${_id}`, 'PUT', scheduledPayment),
		deleteScheduledPayment: (_, { _id }) =>
			generalRequest(`${URL}/${_id}`, 'DELETE')
	}
};

const url$1 = 'localhost';
const port$1 = '3000';
const entryPoint$1 = '';

const URL$1 = `http://${url$1}:${port$1}/${entryPoint$1}`;

const resolvers$1 = {
    Query: {
        userById: (_, {id} ) =>
            generalRequest(`${URL$1}/${_id}`, 'GET')
    },
    Mutation: {
        signIn: async (_, {username, password} ) => {
            console.log(`${URL$1}login`);
            let user = await generalRequest(
                `${URL$1}login`,
                'POST',
                { username, password }
            );
            //if (user.statusCode !== 200) 
            return user;


        }
    }
};

const url$2 = 'db3c-186-31-187-243.ngrok-free.app';
const port$2 = '';
const entryPoint$2 = 'record_types';

const URL$2 = `http://${url$2}:${port$2}/${entryPoint$2}`;


const resolvers$2 = {
	Query: {
		allRecordTypes: (_) =>
			getRequest(URL$2, '')

	},
	Mutation: {
		createRecordType: (_, { recordtype }) =>
			generalRequest(`${URL$2}/`, 'POST', recordtype)

	}
};

// merge the typeDefs
const mergedTypeDefs = mergeSchemas(
	[
		'scalar JSON',
		scheduledPaymentTypeDef,
		authTypeDef,
		RecordTypeDef
	],
	[
		scheduledPaymentQueries,
		authenticationQueries,
		RecordTypeQueries
	],
	[
		scheduledPaymentMutations,
		authenticationMutations,
		RecordTypeMutations
	]
);

// Generate the schema object from your types definition.
var graphQLSchema = graphqlTools.makeExecutableSchema({
	typeDefs: mergedTypeDefs,
	resolvers: merge(
		{ JSON: GraphQLJSON }, // allows scalar JSON
		resolvers,
		resolvers$1,
		resolvers$2
	)
});

const app = new Koa();
const router = new KoaRouter();
const PORT = process.env.PORT || 5000;

app.use(koaLogger());
app.use(koaCors());

// read token from header
app.use(async (ctx, next) => {
	if (ctx.header.authorization) {
		const token = ctx.header.authorization.match(/Bearer ([A-Za-z0-9]+)/);
		if (token && token[1]) {
			ctx.state.token = token[1];
		}
	}
	await next();
});

// GraphQL
const graphql$1 = apolloServerKoa.graphqlKoa((ctx) => ({
	schema: graphQLSchema,
	context: { token: ctx.state.token },
	formatError: formatErr
}));
router.post('/graphql', koaBody(), graphql$1);
router.get('/graphql', graphql$1);

// test route
router.get('/graphiql', apolloServerKoa.graphiqlKoa({ endpointURL: '/graphql' }));

app.use(router.routes());
app.use(router.allowedMethods());
// eslint-disable-next-line
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
