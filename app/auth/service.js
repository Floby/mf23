import { set } from '@ember/object';
import UrlAssembler from 'url-assembler';
import { tracked } from '@glimmer/tracking';
import Service, { service } from '@ember/service';
import config from 'mf23/config/environment';
import crypto from 'crypto-js';
import ms from 'ms';
import Store from 'store2';

const AUTH_CONFIG = config.auth0;
const AUTH_BASE_URI = UrlAssembler(`https://${AUTH_CONFIG.domain}`);
const AUTH_TOKEN_URI = AUTH_BASE_URI.segment('/oauth/token');
const AUTH_USERINFO_URI = AUTH_BASE_URI.segment('/userinfo');
const AUTH_AUTHORIZE_URI = AUTH_BASE_URI.segment('/authorize');
const AUTH_LOGOUT_URI = AUTH_BASE_URI.segment('/logout');

const INITIAL = {};

export default class AuthService extends Service {
  @service router;
  @tracked lastUpdated = null;

  constructor(...args) {
    super(...args);
    set(this, 'sessionStore', Store.namespace('auth'));
    this.stateStore = Store.namespace('authstate');
    this.refreshCheckInterval = setInterval(
      () => this.checkRefresh(),
      ms('30 seconds')
    );
    this.setupExpirationTimeout();
    this.checkRefresh();
  }
  async login() {
    const state = randomBytesAsBase64(8);
    const verifierPair = generateVerifierPair();
    this.stateStore.set(state, verifierPair);
    window.location = AUTH_AUTHORIZE_URI.query({
      code_challenge: verifierPair.challenge,
      code_challenge_method: 'S256',
      state: state,
      response_type: 'code',
      audience: 'https://mf.flo.by/',
      scope:
        'openid profile username nickname email user_metadata offline_access',
      client_id: AUTH_CONFIG.clientId,
      //client_secret: AUTH_CONFIG.clientSecret,
      redirect_uri: window.location.origin + '/profile',
    });
  }

  async tryToAuthenticate(queryParams) {
    if (queryParams.code) {
      try {
        const { verifier } = this.stateStore.get(queryParams.state);
        this.stateStore.remove(queryParams.state);
        const response = await fetch(AUTH_TOKEN_URI, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            client_id: AUTH_CONFIG.clientId,
            //client_secret: AUTH_CONFIG.clientSecret,
            grant_type: 'authorization_code',
            redirect_uri: window.location.origin + '/profile',
            code: queryParams.code,
            code_verifier: verifier,
          }),
        });
        if (response.status >= 400) {
          throw Error('Could not login');
        }
        const reply = await response.json();
        if (reply.access_token && reply.id_token) {
          this.setSession(reply);
          await this.syncUserInfo(reply.access_token);
          this.eraseAuthParameters();
        }
        this.stateStore.remove(queryParams.state);
      } catch (error) {
        console.error(error);
        throw error;
      }
    }
  }

  async checkRefresh() {
    const session = this.getSession();
    const shouldRefresh = !this.isAuthenticated && session?.refresh_token;
    if (shouldRefresh) {
      return this.refresh();
    }
  }

  async refresh() {
    const response = await fetch(AUTH_TOKEN_URI, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'refresh_token',
        client_id: AUTH_CONFIG.clientId,
        //client_secret: AUTH_CONFIG.clientSecret,
        refresh_token: this.session?.refresh_token,
      }),
    });
    if (response.status >= 400) {
      this.sessionStore.remove('refresh_token');
    } else {
      const body = await response.json();
      this.setSession(body);
      await this.syncUserInfo(this.session.access_token);
    }
  }

  async fetchUserInfo(accessToken) {
    const userInfoResponse = await fetch(AUTH_USERINFO_URI, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return userInfoResponse.json();
  }

  async syncUserInfo(accessToken) {
    const userInfo = await this.fetchUserInfo(accessToken);
    this.setUserInfo(userInfo);
  }

  @tracked _userInfo = INITIAL;
  setUserInfo(userInfo) {
    this.sessionStore.set('userInfo', userInfo);
    this._userInfo = userInfo;
  }
  getUserInfo() {
    if (this._userInfo === INITIAL) {
      return this.sessionStore.get('userInfo');
    }
    return this._userInfo;
  }

  get userInfo() {
    return this.getUserInfo();
  }

  eraseAuthParameters() {
    //const router = this.get('router')
    //const pathWithoutHash = router.currentURL.split('#').shift()
    const pathWithoutHash = '/profile';
    history.replaceState(
      { path: pathWithoutHash },
      pathWithoutHash,
      pathWithoutHash
    );
  }

  get isAuthenticated() {
    return this.accessToken && !this.isExpired;
  }

  @tracked _session = INITIAL;
  getSession() {
    if (this._session !== INITIAL) {
      return this._session;
    }
    const session = this.sessionStore.get('session');
    if (!session) {
      return null;
    }
    return {
      ...session,
      expires_at: new Date(session.expires_at),
    };
  }

  setSession(authResult) {
    this.lastUpdated = Date.now();
    if (authResult && authResult.access_token && authResult.id_token) {
      // Set the time that the access token will expire at
      let expiresAt = authResult.expires_in * 1000 + new Date().getTime();
      const session = { ...authResult, expires_at: expiresAt };
      this.sessionStore.set('session', session);
      this._session = this.getSession();
      this.setupExpirationTimeout();
    }
  }

  get permissions() {
    const at = this.session?.access_token;
    if (!at) return null;
    const [_, payload] = at.split('.');
    const json = JSON.parse(atob(payload));
    return json.permissions;
  }

  get session() {
    return this.getSession();
  }

  get accessToken() {
    return this.session?.access_token;
  }

  logout() {
    // Clear access token and ID token from local storage
    this.sessionStore.remove('access_token');
    this.sessionStore.remove('id_token');
    this.sessionStore.remove('expires_at');
    this.sessionStore.remove('userInfo');
    this.getSession();
    window.location = AUTH_LOGOUT_URI.query({
      client_id: AUTH_CONFIG.clientId,
      returnTo: window.location.origin + '/',
    });
  }

  get isExpired() {
    let expiresAt = this.session.expires_at;
    return Date.now() > expiresAt.getTime();
  }

  setupExpirationTimeout() {
    if (this._expirationTimeout) {
      clearTimeout(this._expirationTimeout);
      this._expirationTimeout = null;
    }
    let expiresAt = this.session?.expires_at;
    if (!expiresAt) {
      return;
    }
    const delay = expiresAt.getTime() - Date.now();
    if (delay > 0) {
      this._expirationTimeout = setTimeout(async () => {
        this.setSession(this.getSession());
        await this.refresh();
      }, delay);
    }
  }
}

function randomBytesAsBase64(nBytes) {
  return base64URLEncode(crypto.lib.WordArray.random(nBytes));
}

function generateVerifierPair() {
  const verifier = randomBytesAsBase64(32);
  const challenge = base64URLEncode(sha256(crypto.enc.Utf8.parse(verifier)));
  return { verifier, challenge };
}

function sha256(buffer) {
  return crypto.SHA256(buffer);
}

function base64URLEncode(buffer) {
  return crypto.enc.Base64.stringify(buffer)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}
