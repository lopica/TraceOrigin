export function findLastConsignAndTransportEvents(logs) {
  let consignId = "";
  let transportId = "";
  let receiveId = "";
  // Step 1: Find the last "ỦY QUYỀN" event
  for (let i = logs.length - 1; i >= 0; i--) {
    if (logs[i].eventType === "ỦY QUYỀN") {
      consignId = logs[i].itemLogId;
      // Step 2: Check for "VẬN CHUYỂN" events after the last "ỦY QUYỀN" event
      for (let j = i + 1; j < logs.length; j++) {
        if (logs[j].eventType === "VẬN CHUYỂN") {
          transportId = logs[j].itemLogId;
          break; // No need to look further for transport events
        } else if (logs[j].eventType === "NHẬN HÀNG") {
          receiveId = logs[j].itemLogId;
          break;
        }
      }
      break; // No need to look further for consign events
    }
  }

  if (consignId !== undefined) {
    return { consignId, transportId, receiveId };
  }

  return {
    consignId: "",
    transportId: "",
    receiveId: "",
  };
}
