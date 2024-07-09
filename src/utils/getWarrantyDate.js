import { getDateFromEpochTime } from "./getDateFromEpochTime";

export function getWarrantyDate (createDate, warrantyMonth) {
    const warrantyMilliseconds = warrantyMonth * 30.44 * 24 * 60 * 60 * 1000;
    // Add createDate (in epoch) to converted warrantyMonth
    const warrantyEndDate = createDate + warrantyMilliseconds;
    // Convert the sum value to a readable date format using getDateFromEpochTime
    return getDateFromEpochTime(warrantyEndDate);
}