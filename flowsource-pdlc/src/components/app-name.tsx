import React from "react";
import { APP_NAME } from "../constants/common";

const AppName = () => {
  return (
    <span className="app-name">
      {APP_NAME.map((item: { name: string; sup?: boolean }, i: number) => (
        <React.Fragment key={i}>
          {!item.sup ? item.name : <sup>{item.name}</sup>}
        </React.Fragment>
      ))}
    </span>
  );
};

export default AppName;
