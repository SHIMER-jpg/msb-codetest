import React, { useState } from "react";
import "./GetRate.module.css"
import axios from "axios";

export const GetRate = ({ currencyList }) => {
  const [form, setForm] = useState({
    amount: 0,
    base: "USD",
    symbols: currencyList[0],
    date: new Date().toISOString().split('T')[0]
  })

  const [resultLabel, setResultLabel] = useState("");

  const handleSubmit = async (e) => {
    try {
      e.preventDefault()
      const { data } = await axios.post("http://localhost:8888/api/0.2", { ...form })
      const firstResult = data.results[0]
      setResultLabel(`${data.amount} ${firstResult.from} = ${firstResult.fullResult} ${firstResult.to}`)
    } catch (e) {
      setResultLabel("There was an error processing your request")
      console.log(e)
    }
  }

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div>
      <form onSubmit={(e) => handleSubmit(e)}>
        <input placeholder="amount" type="number" name="amount" onChange={handleChange}></input>
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
        {resultLabel}
      </div>
    </div >)
}
