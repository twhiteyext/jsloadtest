type featureId = string;
type streamId = string;

export type FeatureConfig = {
  hydrate?: boolean;
  name: featureId;
  streamId: streamId;
  stream: any;
};

export type Template = ({ data }: { data: StreamOutput }) => JSX.Element;

export type TemplateExports = {
  default: Template;
  config: FeatureConfig;
};
export interface StreamOutput {
  externalEntityId: string;
  description: string;
  name: string;
  id: string;
}

export interface Data {
  streamOutput: StreamOutput;
  feature: string;
}

export interface Result {
  content: string;
  path: string;
  redirects: string[];
}
