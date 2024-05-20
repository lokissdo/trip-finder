export const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Tháng trong JavaScript bắt đầu từ 0
    const year = date.getFullYear().toString(); // Lấy 2 chữ số cuối của năm
    return `${day}-${month}-${year}`;
  };