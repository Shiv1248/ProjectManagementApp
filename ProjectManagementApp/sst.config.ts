import { SSTConfig } from "sst";
import { ApiStack } from "./stacks/ApiStack";

export default {
  config(_input: any) {
    return {
      name: "ProjectManagementApp",
      region: "ap-south-1", // AWS region for deployment
    };
  },
  stacks(app: any) {
    app.stack(ApiStack); // Reference the ApiStack defined in stacks/ApiStack.ts
  },
} satisfies SSTConfig;
