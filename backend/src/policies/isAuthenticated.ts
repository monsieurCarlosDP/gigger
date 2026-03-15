export default (policyContext, config, { strapi }) => {
  if (policyContext.state.auth?.credentials) {
    return true;
  }

  return false;
};
