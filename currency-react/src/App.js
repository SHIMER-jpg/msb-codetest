import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";

import { Button } from "./components/Button/Button";
import { GetRate } from "./layouts/GetRate/GetRate";
import { RateHistory } from "./layouts/RateHistory/RateHistory";

import { getCurrencies } from "./queries/getCurrencies";

const App = () => {
  const [tab, setTab] = useState("getRate"); //getRate ||rateHistory
  const [currencyList, setCurrencyList] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const { data: currencies } = await getCurrencies();
      setCurrencyList(Object.keys(currencies));
    };
    fetchData();
  }, []);

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
        {tab === "getRate" && <GetRate currencyList={currencyList} />}
        {tab === "rateHistory" && <RateHistory />}
      </div>
    </div>
  );
};

export default App;
