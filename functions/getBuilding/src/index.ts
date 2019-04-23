import { Handler } from "aws-lambda";

import { docClient } from "../../../aws";
import { GetBuildingRequest } from "../../../types/GetBuildingRequest";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import {
  DYNAMODB_COMFORTMENT_AI,
  DYNAMODB_COMFORTMENT_AI_BY_BUILDING_NUMBER
} from "../../../constants";
import { BUILDING_NOT_FOUND } from "../../../errors";

const handler: Handler = async (event: GetBuildingRequest, _, __) => {
  const { buildingNumber } = event;
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
    throw BUILDING_NOT_FOUND;
  }

  return Items;
};

export default handler;
