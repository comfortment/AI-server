import { Handler, APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { docClient } from "../../../aws";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import {
  DYNAMODB_COMFORTMENT_AI,
  DYNAMODB_COMFORTMENT_AI_BY_BUILDING_NUMBER
} from "../../../constants";
import { BUILDING_NOT_FOUND } from "../../../errors";

const handler: Handler = async (
  event: APIGatewayProxyEvent,
  _,
  __
): Promise<APIGatewayProxyResult> => {
  const { buildingNumber } = event.queryStringParameters;
  const dynamodbGetDataQuery: DocumentClient.QueryInput = {
    TableName: DYNAMODB_COMFORTMENT_AI,
    IndexName: DYNAMODB_COMFORTMENT_AI_BY_BUILDING_NUMBER,
    KeyConditionExpression: "buildingNumber = :buildingNumber",
    ExpressionAttributeValues: {
      ":buildingNumber": Number(buildingNumber)
    }
  };

  const { Items } = await docClient.query(dynamodbGetDataQuery).promise();

  if (!Items || !Items.length) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: BUILDING_NOT_FOUND.message })
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(Items)
  };
};

export default handler;
