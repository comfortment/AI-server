import { Handler } from "aws-lambda";
import * as uuid from "uuid/v4";

import { docClient } from "../../../aws";
import { ApartmentInformation } from "../../../types/ApartmentInformation";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { DYNAMODB_COMFORTMENT_AI } from "../../../constants";

const handler: Handler = async (event: ApartmentInformation, _, __) => {
  const id = uuid();
  const dynamodbPutData: DocumentClient.PutItemInput = {
    TableName: DYNAMODB_COMFORTMENT_AI,
    Item: {
      id,
      ...event
    }
  };

  await docClient.put(dynamodbPutData).promise();

  return id;
};

export default handler;
