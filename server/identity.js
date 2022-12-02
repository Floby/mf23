const JOSE = require('jose');
module.exports = class Identity {
  constructor(issuer) {
    this.issuer = issuer;
    this.jwks = JOSE.createRemoteJWKSet(
      new URL(`${issuer}.well-known/jwks.json`)
    );
  }

  async verify(jwt) {
    const { payload } = await JOSE.jwtVerify(jwt, this.jwks, {
      issuer: this.issuer,
      audience: 'https://mf.flo.by/',
    });
    return {
      ...payload,
    };
  }
};
