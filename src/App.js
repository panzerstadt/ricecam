import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

import RiceCam from "./components/RiceCam";
class App extends Component {
  render() {
    return (
      <div className="App">
        <p>v1.4</p>
        <br />
        <RiceCam />
      </div>
    );
  }
}

export default App;
