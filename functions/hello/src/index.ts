export default (e, ctx, cb) => {
  console.log("processing event: %j", e);
  cb(null, { hello: "world" });
};
