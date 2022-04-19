import * as React from "react";
import * as ReactDOM from "react-dom";
import { Page } from "../../src/templates/loc-hydrated";

const data = (window as any).__INITIAL__DATA__;
ReactDOM.hydrate(<Page data={data} />, document.getElementById("reactele"));