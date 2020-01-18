"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.putRecords = exports._putRecordBatches = exports.limits = void 0;var _lodashFirecloud = _interopRequireDefault(require("lodash-firecloud"));
var _awsSdk = _interopRequireDefault(require("aws-sdk"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}











// see https://docs.aws.amazon.com/firehose/latest/dev/limits.html
let limits = {
  batchByteSize: 4 * 1024 * 1024,
  batchRecord: 500,
  recordByteSize: 1000 * 1024 };exports.limits = limits;


let _putRecordBatches = async function ({
  firehose,
  recordBatches })
{
  let processedCount = 0;

  for (let recordBatch of recordBatches) {
    delete recordBatch.byteSize;
    await (async createError => {try {return await firehose.putRecordBatch(recordBatch).promise();} catch (_awaitTraceErr) {let err = createError();_awaitTraceErr.stack += "\n...\n" + err.stack;throw _awaitTraceErr;}})(() => new Error());
    processedCount = processedCount + recordBatch.Records.length;
  }

  return processedCount;
};exports._putRecordBatches = _putRecordBatches;

let putRecords = async function ({
  DeliveryStreamName,
  ctx,
  firehose = new _awsSdk.default.Firehose(),
  records })







{
  let largeRecords = [];
  let recordBatches = [];
  let recordBatch = {
    DeliveryStreamName,
    Records: [],
    byteSize: 0 };


  let toProcessCount = records.length;

  for (let record of records) {
    let Data = JSON.stringify(record);
    Data = `${Data}\n`;
    let dataByteSize = Buffer.byteLength(Data);

    if (dataByteSize > exports.limits.recordByteSize) {
      largeRecords.push(record);
      await (async createError => {try {return await ctx.log.error({ _babelSrc: { file: typeof __filename === "undefined" ? "src/firehose.ts" : __filename, babelFile: "src/firehose.ts", line: 66, column: 13 } }, `Skipping record larger than ${exports.limits.recordByteSize / 1024} KB: \
${dataByteSize / 1024} KB.`, {
            record });} catch (_awaitTraceErr2) {let err = createError();_awaitTraceErr2.stack += "\n...\n" + err.stack;throw _awaitTraceErr2;}})(() => new Error());

      toProcessCount = toProcessCount - 1;
      continue;
    }

    if (recordBatch.byteSize + dataByteSize > exports.limits.batchByteSize ||
    recordBatch.Records.length + 1 > exports.limits.batchRecord) {
      recordBatches.push(recordBatch);
      recordBatch = {
        DeliveryStreamName,
        Records: [],
        byteSize: 0 };

    }

    recordBatch.byteSize = recordBatch.byteSize + dataByteSize;

    recordBatch.Records.push({
      Data });

  }

  recordBatches.push(recordBatch);
  recordBatches = _lodashFirecloud.default.reject(recordBatches, function (recordBatch) {
    return recordBatch.byteSize === 0;
  });

  let processedCount = await (async createError => {try {return await exports._putRecordBatches({ firehose, recordBatches });} catch (_awaitTraceErr3) {let err = createError();_awaitTraceErr3.stack += "\n...\n" + err.stack;throw _awaitTraceErr3;}})(() => new Error());
  if (processedCount !== toProcessCount) {
    throw new Error(`Not all records processed. Expected ${toProcessCount}, actually ${processedCount}.`);
  }

  return {
    largeRecords };

};exports.putRecords = putRecords;

//# sourceMappingURL=firehose.js.map