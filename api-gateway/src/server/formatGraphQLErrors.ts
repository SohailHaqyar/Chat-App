import { GraphQLError } from "graphql";

const formatGraphQLErrors = (error: GraphQLError) => {
  /**
   * The Reason that's being ts-ignored is because of an apollo server typing issue
   */
  // @ts-ignore
  const errorDetails = error.originalError?.response?.body;
  try {
    if (errorDetails) return JSON.parse(errorDetails);
    if (error.message) return error.message;
  } catch (e) {
    if (error.message) return error.message;
  }

  return null;
};

export default formatGraphQLErrors;
