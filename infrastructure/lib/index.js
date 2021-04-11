import DynamoDbStack from "./DynamoDbStack";

export default function main(app) {
  new DynamoDbStack(app, "dynamo-db-stack");
}
