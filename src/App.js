import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Podcasts from "./pages/podcasts";

import "./App.scss";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/" component={Podcasts} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
