import { Handler } from "aws-lambda";
import { RegisterUser } from "../../../types/RegisterUser";
import { docClient } from "../../../aws";
import { DYNAMODB_COMFORTMENT_AI } from "../../../constants";

const handler: Handler = async (event: RegisterUser, _, __): Promise<boolean> => {
  const { id } = event;

  try {
    await docClient
      .put({
        TableName: DYNAMODB_COMFORTMENT_AI,
        Item: {
          id
        }
      })
      .promise();

    return true;
  } catch {
    return false;
  }
};

export default handler;
