import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Template, FeatureConfig, StreamOutput } from "../types";
import { reactWrapper } from "../wrapper";

export const config: FeatureConfig = {
  name: "loc-hydrated",
  streamId: "loc-jstesting",
  stream: {
    "$id": "loc-jstesting",
    "source": "knowledgeGraph",
    "destination": "pages",
    "fields": [
      "id",
      "uid",
      "meta",
      "name",
      "address",
      "mainPhone",
      "description",
      "hours",
      "photoGallery",
      "slug"
    ],
    "filter": {
      "entityTypes": [
        "location"
      ]
    },
    "localization": {
      "locales": [
        "en"
      ],
      "primary": false
    }
  }
};

export const getPath = (data: StreamOutput) =>
  `react/hydrated/loc-${data.id}`;

export const Page: Template = ({ data }) => {
  const { description, name, id  } = data;
  const [fontSize, setFontSize] = React.useState(20);

  return (
    <div
      style={{ display: "flex", alignItems: "center", flexDirection: "column" }}
    >
      <div>
        <button onClick={() => setFontSize((prev) => prev - 5)}>
          {`Decrease font size`}
        </button>
        <button onClick={() => setFontSize((prev) => prev + 5)}>
          {`Increase font size`}
        </button>
      </div>
      <div style={{ fontSize: fontSize }}>
        <h1>{`Location ${id}: ${name}`}</h1>
        <p>{description}</p>
      </div>
    </div>
  );
};

export const render = (data: any) =>
  reactWrapper(
    data,
    "loc-hydrated.js",
    renderToStaticMarkup(<Page data={data} />),
    true
  );
