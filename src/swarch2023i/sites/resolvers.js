import { generalRequest, getRequest } from '../../utilities';
import { url, port, entryPoint } from './server';

const URL = `https://${url}:${port}/${entryPoint}`;


const resolvers = {
	Query: {
		allSites: (_) =>
			getRequest(URL, 'sites'),
		siteById: (_, { id }) =>{
			return generalRequest(`${URL}/sites/${id}`, 'GET');
		},
		allLevels: (_) =>
			getRequest(URL, 'levels'),
		levelById: (_, {id}) => {
			return generalRequest(`${URL}/levels/${id}`, 'GET');
		}

	},
	Mutation: {
		createLevel: (_, { Level }) =>{
			console.log(`level is: ${Level.level_id}, ${Level.level_code}, ${Level.level_name}`);
			return generalRequest(`${URL}/levels/`, 'POST', Level);
		}
	}
};


export default resolvers;
