import logo from './logo.svg';
import { AppContainer, AppHeader, AppLink, AppLogo } from './App.ccm.css';

function App() {
  return (
    <AppContainer.div>
      <AppHeader.header>
        <AppLogo.img src={logo} alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <AppLink.a
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </AppLink.a>
      </AppHeader.header>
    </AppContainer.div>
  );
}

export default App;
