import { SSTConfig } from "sst";
import Site from "./stacks/Site";

export default {
  config(_input) {
    return {
      name: "cv-ai",
      region: "eu-west-2",
    };
  },
  stacks(app) {
    app.stack(Site);
  }
} satisfies SSTConfig;