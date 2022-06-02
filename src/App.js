import { useState } from "react";
import "./App.css";

const App = () => {
  // ================================================= STATE
  const [username, setUsername] = useState("");
  const [data, setData] = useState();
  const [error, setError] = useState(null);

  // ================================================= APPEL A L'API
  const queryString = encodeURIComponent(`${username} in:login type:user `);

  async function getUsers() {
    await fetch(`https://api.github.com/search/users?q=${queryString}`)
      .then((response) => {
        if (!response.ok && response.status === 403) {
          throw new Error(`limite atteinte, veuillez patienter`);
        } else if (!response.ok) {
          throw new Error(`HTTP error status ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setData(data);
        setError(null);
        console.clear();
      })
      .catch((err) => {
        setError(err.message);
      });
  }
  // ================================================= INLINE METHODS
  const handleChange = (event) => {
    setUsername(event.target.value);
  };

  const handleClick = (event) => {
    event.preventDefault();
    getUsers();
  };

  return (
    <div className="app">
      <div className="input-container">
        <input
          type="text"
          placeholder="Entrer un nom d'utilisateur Github"
          onChange={handleChange}
        />
        <button onClick={handleClick}>Rechercher cet utilisateur</button>
      </div>
      {error && (
        <div className="error-message">{`There is a problem : ${error}`}</div>
      )}
      {!error && (
        <div className="data-container">
          {data &&
            data.items.map(({ id, login }) => <div key={id}>{login}</div>)}
          {data && data.items.length === 0 && (
            <div>Aucun utilisateur trouvé</div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
