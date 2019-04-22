import { Handler } from "aws-lambda";
import * as uuid from "uuid/v4";

import { docClient } from "../../../aws";
import { ApartmentInformation } from "../../../types/ApartmentInformation";
import { DocumentClient } from "aws-sdk/clients/dynamodb";

const handler: Handler = async (event: ApartmentInformation, _, __) => {
  const id = uuid();
  const input: DocumentClient.PutItemInput = {
    TableName: "ComfortmentAI",
    Item: {
      id,
      ...event
    }
  };

  await docClient.put(input).promise();
};

export default handler;
