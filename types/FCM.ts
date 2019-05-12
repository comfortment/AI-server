export interface FCM {
  to: string;
  priority: "normal" | "high";
  notification: Notification;
  data: Data;
}

export interface Notification {
  title: string;
  body: string;
}

export interface Data {
  title: string;
  message: string;
}

export interface EmitNoise {
  decibel: number;
  to: string;
  buildingNumber: number;
  roomNumber: number;
}
