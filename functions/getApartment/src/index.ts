import { Handler, APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { DYNAMODB_COMFORTMENT_AI } from "../../../constants";
import { APARTMENT_NOT_FOUND } from "../../../errors";
import { docClient } from "../../../aws";
import { GetApartmentRequest } from "../../../types/GetApartmentRequest";
import { DocumentClient } from "aws-sdk/clients/dynamodb";

const handler: Handler = async (
  event: APIGatewayProxyEvent,
  _,
  __
): Promise<APIGatewayProxyResult> => {
  const { id } = event.queryStringParameters;
  const dynamodbGetData: DocumentClient.GetItemInput = {
    TableName: DYNAMODB_COMFORTMENT_AI,
    Key: {
      id
    }
  };

  const { Item } = await docClient.get(dynamodbGetData).promise();

  if (!Item) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        message: APARTMENT_NOT_FOUND.message
      })
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(Item)
  };
};

export default handler;
