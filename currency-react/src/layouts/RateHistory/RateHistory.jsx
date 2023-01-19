import React, { useState } from "react";
import axios from "axios";
import { Line } from 'react-chartjs-2';

export const RateHistory = ({ currencyList }) => {
  const [form, setForm] = useState({
    amount: 1,
    base: "USD",
    symbols: "",
  })

  const [data, setData] = useState({ labels: [], datasets: [] })


  const handleSubmit = async (e) => {
    try {
      e.preventDefault()
      if (form.symbols === "")
        return
      const dates = await [...Array(30).keys()].reverse().map(days => {
        const now = new Date()
        now.setDate(now.getDate() - days)
        return now.toISOString().split("T")[0]
      })
      const historicData = await Promise.all(dates.map(async (date) => {
        const { data } = await axios.post("http://localhost:8888/api/0.2", { ...form, date })
        return { ...data.results[0], date }
      }));
      setData({ labels: dates, datasets: [{ data: historicData }] })
      console.log({ labels: dates, datasets: [{ data: historicData }] })
    } catch (e) {
      console.log(e)
    }
  }

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  return (<div>
    <form onSubmit={(e) => handleSubmit(e)}>
      <input id="" name="base" disabled={true} value={form.base} type="text" list="base" onChange={handleChange} />
      <datalist id="base">
      </datalist>
      <input id="" name="symbols" value={form.symbols} type="text" list="symbols" onChange={handleChange} />
      <datalist id="symbols">
        {currencyList.length > 0 && currencyList.map((item) => (<option key={item} value={item}></option>))}
      </datalist>
      <button type="submit">GO</button>
    </form>
    <div>
      {/*Here we would have the chart */}
    </div>
  </div >)
}
