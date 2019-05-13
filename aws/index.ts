import { DynamoDB, Lambda } from "aws-sdk";

const docClient = new DynamoDB.DocumentClient({ region: "ap-northeast-2" });
const lambda = new Lambda({ region: "ap-northeast-2" });

export { docClient, lambda };
