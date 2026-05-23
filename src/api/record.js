export async function fetchRecordItems(experimentId) {
  const res = await fetch(`/api/experiments/${experimentId}/daily-record/items`, {
    credentials: "include",
  });
  const data = await res.json();
  if (data.result !== "Success") {
    throw new Error(data.error?.message || "기록 항목 조회 실패");
  }
  return data.success.values; // [{ recordItemKey: "기분" }, ...]
}
