export const config = {
  graphqlApiUrl: process.env.NEXT_PUBLIC_GRAPHQL_API_URL 
    ? `${process.env.NEXT_PUBLIC_GRAPHQL_API_URL}/graphql`
    : 'http://localhost:3008/graphql',
};
