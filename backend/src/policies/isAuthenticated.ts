export default (policyContext, config, { strapi }) => {
  if (policyContext.state.auth?.credentials) {
    return true;
  }

  // Return 401 Unauthorized instead of 500
  policyContext.status = 401;
  policyContext.body = {
    error: {
      message: 'Autenticación requerida. Envía un JWT válido en el header Authorization',
      status: 'UNAUTHORIZED'
    }
  };
  return false;
};
