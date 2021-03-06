import { Handler, APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import axios from "axios";
import { FCM, Notification, Data, EmitNoise } from "../../../types/FCM";
import { ApartmentInformation } from "../../../types/ApartmentInformation";
import { lambda } from "../../../aws";

const FCM_SERVER_KEY = process.env.FCM_SERVER_KEY;
const GET_FLOOR_API = process.env.GET_FLOOR_API;

const notification: Notification = {
  title: "시끄러워요~",
  body: "주변 세대에서 시끄러움을 느낄 수 있어요! 조금만 조용히 해 주세요~"
};

const data: Data = {
  title: "시끄러워요~",
  message: "주변 세대에서 시끄러움을 느낄 수 있어요! 조금만 조용히 해 주세요~"
};

const handler: Handler = async (
  event: APIGatewayProxyEvent,
  _,
  __
): Promise<APIGatewayProxyResult> => {
  const { decibel, to, buildingNumber, roomNumber } = JSON.parse(event.body) as EmitNoise;

  const message: FCM = {
    to,
    priority: "high",
    notification,
    data
  };

  const floor = Math.floor(roomNumber / 100);
  const underFloor = floor - 1;
  const underFloorRoomNumber = roomNumber - 100;

  if (underFloor > 0) {
    try {
      const underFloorsResponse = await lambda
        .invoke({
          FunctionName: "comfortment-AI_getFloor",
          Payload: JSON.stringify({
            buildingNumber,
            floor: floor - 1
          })
        })
        .promise();

      const underFloors: ApartmentInformation[] = JSON.parse(
        underFloorsResponse.Payload.toString()
      );
      const underFloorApartment = underFloors.filter(
        apartment => apartment.roomNumber === underFloorRoomNumber
      )[0];

      if (!underFloors || !underFloors.length || !underFloorApartment) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            message: "아래층 정보가 없어요~"
          })
        };
      }

      if (underFloorApartment.acceptedDecibel < decibel) {
        try {
          await axios.post("https://fcm.googleapis.com/fcm/send", message, {
            headers: {
              Authorization: "key=" + FCM_SERVER_KEY,
              "Content-Type": "application/json"
            }
          });
        } catch (e) {
          return {
            statusCode: 400,
            body: JSON.stringify({
              message: e.message
            })
          };
        }
      } else {
        return {
          statusCode: 400,
          body: JSON.stringify({
            message: "아래층에서 이 정도 소음은 용인하고 있어요~"
          })
        };
      }

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "success"
        })
      };
    } catch {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: `${floor} 층 정보를 찾지 못했어요!`
        })
      };
    }
  }

  return {
    statusCode: 400,
    body: JSON.stringify({
      message: "1층이네요."
    })
  };
};

export default handler;
