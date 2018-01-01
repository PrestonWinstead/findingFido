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
  AUDIENCE: 'http://localhost:80',
  REDIRECT: 'http://localhost:8080/callback',
  SCOPE: 'openid profile email'
};