import AWS from "aws-sdk";

const dynamo = new AWS.DynamoDB.DocumentClient();
export { dynamo };