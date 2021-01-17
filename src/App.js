import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

// import Podcasts from "./pages/podcasts";
import Header from "./components/headerComponent/header";
import Wip from "./pages/wip";
import NotFound from "./pages/notFound";
import PodcastArrayComponent from "./components/podcastArrayComponent/podcastArrayComponent";

import "./App.scss";
import "@quentinguidee/react-jade-ui/dist/index.css";
import { CookiesConsent } from "@quentinguidee/react-jade-ui";
import Policy from "./pages/Policy";

function App() {
  return (
    <div className="App">
      <Router>
        <CookiesConsent toPolicy="/policy" />
        <Header />
        <Switch>
          <Route exact path="/" component={Wip} />
          <Route exact path="/podcasts" component={PodcastArrayComponent} />
          <Route exact path="/policy" component={Policy} />
          <Route component={NotFound} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
