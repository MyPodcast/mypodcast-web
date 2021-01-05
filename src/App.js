import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Home from "./pages/home";

import "./App.scss";

function App() {
  return (
    <div className="App">
      <Router>
        <switch>
          <Route exact path="/" component={Home} />
        </switch>
      </Router>
    </div>
  );
}

export default App;
