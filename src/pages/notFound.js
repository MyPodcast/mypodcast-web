import React, { Component } from "react";

import "./scss/notFound.scss";

class NotFound extends Component {
  render() {
    return (
      <div className="notfound">
        <div className="notfound__sad">
          ^^'
          <br /> 404
        </div>
        <div className="notfound__message">
          <h1>Oh non ! La page demandée n'existe pas.</h1>
        </div>
      </div>
    );
  }
}

export default NotFound;
