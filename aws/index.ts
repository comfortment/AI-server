import { DynamoDB } from "aws-sdk";

const docClient = new DynamoDB.DocumentClient({ region: "ap-northeast-2" });

export { docClient };
