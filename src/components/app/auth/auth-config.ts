interface AuthConfig {
  CLIENT_ID: string;
  CLIENT_DOMAIN: string;
  AUDIENCE: string;
  REDIRECT: string;
  SCOPE: string;
}

export const AUTH_CONFIG: AuthConfig = {
  CLIENT_ID: 'FkcsFLCal4iwRdteOG4XUAlKOxXl0ojd',
  CLIENT_DOMAIN: 'findo.auth0.com', 
  AUDIENCE: 'http://159.89.41.217',
  REDIRECT: 'http://104.236.208.232/callback',
  SCOPE: 'openid profile email'
};