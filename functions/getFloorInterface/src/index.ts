import { Handler, APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { lambda } from "../../../aws";

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

  try {
    const result = await lambda
      .invoke({
        FunctionName: "comfortment-AI_getFloor",
        Payload: JSON.stringify({
          buildingNumber: Number(buildingNumberString),
          floor: Number(floorString)
        })
      })
      .promise();

    return {
      statusCode: 200,
      body: JSON.stringify(result)
    };
  } catch (e) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        message: e.message
      })
    };
  }
};

export default handler;
