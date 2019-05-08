import { Handler, APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { docClient } from "../../../aws";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import {
  DYNAMODB_COMFORTMENT_AI,
  DYNAMODB_COMFORTMENT_AI_BY_BUILDING_NUMBER
} from "../../../constants";
import { FLOOR_NOT_FOUND } from "../../../errors";
import { ApartmentInformation } from "../../../types/ApartmentInformation";

const floorToApartmentRoomNumber = (floor: number): number => {
  return floor * 100;
};

const handler: Handler = async (
  event: APIGatewayProxyEvent,
  _,
  __
): Promise<APIGatewayProxyResult> => {
  const { buildingNumber: buildingNumberString, floor: floorString } = event.queryStringParameters;
  if (!buildingNumberString || !floorString) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Malformed request parameter."
      })
    };
  }

  const buildingNumber = Number(buildingNumberString),
    floor = Number(floorString);

  const dynamodbGetDataQuery: DocumentClient.QueryInput = {
    TableName: DYNAMODB_COMFORTMENT_AI,
    IndexName: DYNAMODB_COMFORTMENT_AI_BY_BUILDING_NUMBER,
    KeyConditionExpression: "buildingNumber = :buildingNumber",
    ExpressionAttributeValues: {
      ":buildingNumber": buildingNumber
    }
  };

  const { Items } = await docClient.query(dynamodbGetDataQuery).promise();

  if (!Items || !Items.length) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        message: FLOOR_NOT_FOUND.message
      })
    };
  }

  const apartmentsInFloor = Items.filter(({ roomNumber }: ApartmentInformation) => {
    const begin = floorToApartmentRoomNumber(floor);
    const end = floorToApartmentRoomNumber(floor + 1);

    return begin <= roomNumber && roomNumber < end;
  });

  return {
    statusCode: 200,
    body: JSON.stringify(apartmentsInFloor)
  };
};

export default handler;
