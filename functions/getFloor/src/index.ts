import { Handler, APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { docClient } from "../../../aws";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import {
  DYNAMODB_COMFORTMENT_AI,
  DYNAMODB_COMFORTMENT_AI_BY_BUILDING_NUMBER
} from "../../../constants";
import { FLOOR_NOT_FOUND } from "../../../errors";
import { ApartmentInformation } from "../../../types/ApartmentInformation";
import { GetFloorRequest } from "../../../types/GetFloorRequest";

const floorToApartmentRoomNumber = (floor: number): number => {
  return floor * 100;
};

const handler: Handler = async (event: GetFloorRequest, _, __): Promise<ApartmentInformation[]> => {
  const { buildingNumber, floor } = event;

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
    throw FLOOR_NOT_FOUND;
  }

  const apartmentsInFloor = Items.filter(({ roomNumber }: ApartmentInformation) => {
    const begin = floorToApartmentRoomNumber(floor);
    const end = floorToApartmentRoomNumber(floor + 1);

    return begin <= roomNumber && roomNumber < end;
  });

  return apartmentsInFloor as ApartmentInformation[];
};

export default handler;
