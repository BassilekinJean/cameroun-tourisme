import { useKeycloak } from '@react-keycloak/web';
//import apiClient from './api'; 

function App() {
  const { keycloak, initialized } = useKeycloak();

  if (!initialized) {
    return <div>Chargement de Keycloak...</div>;
  }

  // Fonctions d'appel API (Inchangées)
//


  const buttonStyle = { marginRight: '10px', padding: '5px' };

  return (
    <div className="App" style={{ padding: '20px' }}>
      <h1>React + Spring Boot + Keycloak (PKCE)</h1>

      {/* C'EST ICI QUE VOS "ENDPOINTS" SE TROUVENT :
        Ce sont des fonctions qui REDIRIGENT vers Keycloak.
      */}
      <div style={{ marginBottom: '20px' }}>
        {!keycloak.authenticated && (
          <div>
            <button 
              style={buttonStyle} 
              onClick={() => keycloak.login()}
            >
              Se connecter
            </button>
            <button 
              style={buttonStyle} 
              onClick={() => keycloak.register()}
            >
              S'inscrire
            </button>
          </div>
        )}

        {keycloak.authenticated && (
          <div>
            <p>Connecté : {keycloak.tokenParsed?.preferred_username}</p>
            <button onClick={() => keycloak.logout()}>
              Se déconnecter
            </button>
          </div>
        )}
      </div>

      <hr />

      {/* Section d'Appels API (Inchangée) */}
      <h2>Appels API</h2>
      <div>


        <h3>Données Publiques:</h3>

        <h3>Données Protégées:</h3>
      </div>
    </div>
  );
}

export default App;