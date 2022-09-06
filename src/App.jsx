import "./App.css";
import Highlight from "./components/Highlight";

function App() {
  return (
    <div className="App">
      <div className="App-default App-content">
        <header className="header App-header">
          <div className="App-container">
            <h1>React Text Highlighter</h1>
          </div>
        </header>
        <main className="App-main">
          <div className="App-container">
            <Highlight />
          </div>
        </main>
        <footer className="App-footer">
          <div className="App-container">
            <div className="content">
              <span className="copyright">
                ©2022 - Rachel Chen • <a
                  className="App-link App-link-light"
                  href="https://rachel-chen-tw.netlify.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                >Blog
                </a>
              </span>
            </div>
            
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
