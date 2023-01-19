import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";

import { Button } from "./components/Button/Button";
import { GetRate } from "./layouts/GetRate/GetRate";
import { RateHistory } from "./layouts/RateHistory/RateHistory";

const App = () => {
  const [tab, setTab] = useState("getRate"); //getRate ||rateHistory
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" width="400" />
      </header>
      <div>
        <div>
          <Button onClick={() => setTab("getRate")} label="Get Rate" />
          <Button
            onClick={() => setTab("rateHistory")}
            label="Rate 30 Day History"
          />
        </div>
        {tab === "getRate" && <GetRate />}
        {tab === "rateHistory" && <RateHistory />}
      </div>
    </div>
  );
};

export default App;
