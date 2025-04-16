export const mockRefundData = [
  {
    id: 1,
    courseName: "数学",
    refundAmount: 100,
    status: "已退款",
    date: "2023-10-01"
  },
  {
    id: 2,
    courseName: "英语",
    refundAmount: 50,
    status: "待处理",
    date: "2023-10-02"
  },
  {
    id: 3,
    courseName: "科学",
    refundAmount: 75,
    status: "已退款",
    date: "2023-10-03"
  }
];

export function fetchRefundData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockRefundData);
    }, 1000);
  });
}