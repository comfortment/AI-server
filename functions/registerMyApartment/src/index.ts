import { Handler, APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as uuid from "uuid/v4";

import { docClient } from "../../../aws";
import { ApartmentInformation } from "../../../types/ApartmentInformation";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { DYNAMODB_COMFORTMENT_AI } from "../../../constants";
import { AWSError } from "aws-sdk";

const handler: Handler = async (
  event: APIGatewayProxyEvent,
  _,
  __
): Promise<APIGatewayProxyResult> => {
  const body = JSON.parse(event.body) as ApartmentInformation;
  const dynamodbPutData: DocumentClient.PutItemInput = {
    TableName: DYNAMODB_COMFORTMENT_AI,
    Item: {
      ...body
    }
  };

  try {
    await docClient.put(dynamodbPutData).promise();
  } catch {
    return {
      statusCode: 400,
      body: ""
    };
  }

  return {
    statusCode: 201,
    body: JSON.stringify({
      message: "success"
    })
  };
};

export default handler;
