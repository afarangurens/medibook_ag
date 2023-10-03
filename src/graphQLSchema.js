import merge from 'lodash.merge';
import GraphQLJSON from 'graphql-type-json';
import { makeExecutableSchema } from 'graphql-tools';

import { mergeSchemas } from './utilities';

import {
	scheduledPaymentMutations,
	scheduledPaymentQueries,
	scheduledPaymentTypeDef
} from './swarch2023i/categories/typeDefs';

import {
	authTypeDef,
	authenticationQueries,
	authenticationMutations
} from './swarch2023i/auth/typeDefs';

import {
	RecordTypeDef,
	RecordTypeQueries,
	RecordTypeMutations
} from './swarch2023i/records/typeDefs';

import categoryResolvers from './swarch2023i/categories/resolvers';
import authResolvers from './swarch2023i/auth/resolvers';
import recordResolvers from './swarch2023i/records/resolvers';

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
export default makeExecutableSchema({
	typeDefs: mergedTypeDefs,
	resolvers: merge(
		{ JSON: GraphQLJSON }, // allows scalar JSON
		categoryResolvers,
		authResolvers,
		recordResolvers
	)
});
