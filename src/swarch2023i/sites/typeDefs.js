export const SiteTypeDef = `
  type Level {
    level_id:ID!
    level_code:String
    level_name: String!
  }

  input LevelInput{
    level_id:ID!
    level_code:String
    level_name: String!
  }

  type Site{
    site_id:ID!
    email: String
    phone_number: String
    address: String
    site_name: String
    site_level: String
  }
  `;

export const SiteQueries= `
    allLevels:[Level]!
    allSites:[Site]!
    levelById(id: ID!): Level
    siteById(id: ID!): Site
`;
export const SiteMutations = `
    createLevel(Level:LevelInput!): Level
`;