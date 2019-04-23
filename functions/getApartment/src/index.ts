import { Handler } from "aws-lambda";

import { DYNAMODB_COMFORTMENT_AI } from "../../../constants";
import { APARTMENT_NOT_FOUND } from "../../../errors";
import { docClient } from "../../../aws";
import { GetApartmentRequest } from "../../../types/GetApartmentRequest";
import { DocumentClient } from "aws-sdk/clients/dynamodb";

const handler: Handler = async (event: GetApartmentRequest, _, __) => {
  const { id } = event;
  const dynamodbGetData: DocumentClient.GetItemInput = {
    TableName: DYNAMODB_COMFORTMENT_AI,
    Key: {
      id
    }
  };

  const { Item } = await docClient.get(dynamodbGetData).promise();

  if (!Item) {
    throw APARTMENT_NOT_FOUND;
  }

  return Item;
};

export default handler;
