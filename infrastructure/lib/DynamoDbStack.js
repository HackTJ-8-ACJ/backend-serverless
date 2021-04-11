import * as sst from "@serverless-stack/resources";
import * as dynamodb from "@aws-cdk/aws-dynamodb";
import makeCfnOutput from "./export";

export default class DynamoDbStack extends sst.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);
    const app = this.node.root;

    const lotsTable = new dynamodb.Table(this, "lots", {
      partitionKey: {
        name: "id",
        type: dynamodb.AttributeType.STRING
      }
    })

    makeCfnOutput(this, app, "lots-table-name", lotsTable.tableName);
    makeCfnOutput(this, app, "lots-table-arn", lotsTable.tableArn);
  }
}
