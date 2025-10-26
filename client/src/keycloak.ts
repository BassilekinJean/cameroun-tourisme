import Keycloak from 'keycloak-js';
const keycloak = new Keycloak({
  url: 'http://localhost:8000',
  realm: 'my-app-realm',
  clientId: 'my-react-client'
});
export default keycloak;