export interface ApartmentInformation {
  buildingNumber: number;
  roomNumber: number;
  name: string;
  phoneNumber: string;
  disturbTimeRange: [number, number][];
  acceptedDecibel: number;
  hateNoiseDescription: string;
  hateSmellDescription: string;
  etc: string;
  role: "admin" | "user";
}
