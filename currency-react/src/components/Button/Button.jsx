import React from "react";
import "./Button.module.css";

export const Button = ({ label, onClick, style = "primary" }) => {
  return <button className={style} onClick={onClick}>{label}</button>;
};
