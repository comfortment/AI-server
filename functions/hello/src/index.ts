import { Handler } from "aws-lambda";

const handler: Handler = (e, _, cb) => {
  console.log("processing event: %j", e);
  cb(null, { hello: "world" });
};

export default handler;
