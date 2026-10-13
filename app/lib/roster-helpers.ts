import ExcelJS from "exceljs";

export async function processRosterData(arrayBuffer: ArrayBuffer): Promise<ArrayBuffer> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(arrayBuffer);

  // 1. Lấy các sheet cần thiết
  const rosterSheet = workbook.getWorksheet("Roster") || workbook.worksheets[0];
  const accountSheet = workbook.getWorksheet("Account") || workbook.worksheets.find((s) => s.name.toLowerCase().includes("account"));
  const nurseSheet = workbook.getWorksheet("Nurses") || workbook.getWorksheet("Nurse") || workbook.worksheets.find((s) => s.name.toLowerCase().includes("nurse") || s.name.toLowerCase().includes("mã ca"));

  if (!rosterSheet || !accountSheet || !nurseSheet) {
    throw new Error("Thiếu một trong các sheet bắt buộc: Roster, Account, Nurses.");
  }

  // 2. Xây dựng Account Map (Ánh xạ nhân sự)
  const accountMap = new Map<string, { ad: string; name: string; contract: string; role: string }>();
  accountSheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;
    const ad = row.getCell(1).value?.toString().trim() || "";
    const code = row.getCell(2).value?.toString().trim() || "";
    const rawName = row.getCell(3).value?.toString().trim();
    const name: string = rawName ? rawName : "";
    const contract = row.getCell(4).value?.toString().trim() || "Full-time";
    const role = row.getCell(5).value?.toString().trim() || "";

    if (code) accountMap.set(code, { ad, name, contract, role });
    if (name) accountMap.set(name.toLowerCase(), { ad, name, contract, role });
  });

  // 3. Xây dựng Shift Map (Quy đổi mã ca từ sheet Nurses)
  const shiftMap = new Map<string, string>();
  nurseSheet.eachRow((row, rowNumber) => {
    if (rowNumber <= 2) return;
    const rosterCode = row.getCell(1).value?.toString().trim() || row.getCell(3).value?.toString().trim();
    const sysCode = row.getCell(2).value?.toString().trim();

    if (rosterCode && sysCode) {
      shiftMap.set(rosterCode.toUpperCase(), sysCode);
    }
  });

  // 4. Đọc thông tin tháng từ ô L1 để xác định năm/tháng gốc
  const cellL1Val = rosterSheet.getCell("L1").value?.toString().trim() || "";
  let baseYear = new Date().getFullYear();
  let baseMonth = 10; // Mặc định tháng 10

  if (cellL1Val.includes("-")) {
    const parts = cellL1Val.split("-");
    const monthStr = parts[0].toLowerCase();
    const yearStr = parts[1];

    const monthsMap: { [key: string]: number } = {
      jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
      jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12
    };

    if (monthsMap[monthStr]) {
      baseMonth = monthsMap[monthStr];
    }
    if (yearStr) {
      baseYear = Number(yearStr.length === 2 ? "20" + yearStr : yearStr);
    }
  }

  // 5. Xác định vùng cột ngày từ ngày 26 tháng này đến 25 tháng sau
  const datesList: string[] = [];
  const dateColIndexes: number[] = [];

  let foundStart26 = false;
  let countDays = 0;

  const row4 = rosterSheet.getRow(4);
  row4.eachCell((cell, colNumber) => {
    const rawVal = cell.value?.toString().trim();
    if (rawVal && !isNaN(Number(rawVal))) {
      const dayNum = Number(rawVal);
      
      if (dayNum === 26 && !foundStart26) {
        foundStart26 = true;
      }

      if (foundStart26 && countDays < 31) {
        countDays++;
        let targetYear = baseYear;
        let targetMonth = baseMonth;

        if (dayNum >= 1 && dayNum <= 25 && countDays > 1) {
          targetMonth = baseMonth + 1;
          if (targetMonth > 12) {
            targetMonth = 1;
            targetYear += 1;
          }
        }

        const mPad = String(targetMonth).padStart(2, "0");
        const dPad = String(dayNum).padStart(2, "0");
        const dateFormatted = `${targetYear}/${mPad}/${dPad}`;

        datesList.push(dateFormatted);
        dateColIndexes.push(colNumber);
      }
    }
  });

  // Dự phòng nếu không quét tự động được row 4
  if (datesList.length === 0) {
    let currentD = 26;
    let currM = baseMonth;
    let currY = baseYear;
    
    for (let i = 0; i < 31; i++) {
      if (i > 0 && currentD === 26) {
        currM++;
        if (currM > 12) { currM = 1; currY++; }
      }
      const mPad = String(currM).padStart(2, "0");
      const dPad = String(currentD).padStart(2, "0");
      datesList.push(`${currY}/${mPad}/${dPad}`);
      dateColIndexes.push(4 + i);

      currentD++;
      if (currentD > 31) {
        currentD = 1;
        currM++;
        if (currM > 12) { currM = 1; currY++; }
      }
    }
  }

  // 6. Khởi tạo Workbook đầu ra
  const outWorkbook = new ExcelJS.Workbook();
  const sheetTemplateGoc = outWorkbook.addWorksheet("Template Goc");
  const sheetImportPhanCa = outWorkbook.addWorksheet("Import_PhanCa");

  // Thiết lập Header cho Sheet Import_PhanCa
  sheetImportPhanCa.addRow([
    "STT",
    "Tài khoản AD *",
    "Mã Phòng/Vị trí *",
    "Tên Phòng/Vị trí *",
    "Loại hợp đồng *",
    "Vai trò/Vị trí (không bắt buộc)",
    "Ngày trực *(YYYY/mm/dd)",
    "Mã ca *",
    "Số giờ điều động theo giờ",
    "Số giờ điều động oncall",
    "Số giờ nghỉ đăng ký",
    "Số giờ công tác",
  ]);

  // Thiết lập Header cho Sheet Template Gốc
  sheetTemplateGoc.addRow(["LỊCH LÀM VIỆC KHỐI ĐIỀU DƯỠNG"]);
  sheetTemplateGoc.addRow([
    "STT",
    "Tài khoản AD *",
    "Họ và tên",
    "Mã Phòng/Vị trí *",
    "Tên Phòng/Vị trí *",
    "Loại hợp đồng *",
    "Vai trò/Vị trí",
    ...datesList
  ]);

  let importRowStt = 1;
  let templateStt = 1; 
  const defaultDeptCode = "HHN1";
  const defaultDeptName = "HHN - ED - Khoa Cấp cứu người lớn";

  // 7. Duyệt qua từng nhân sự trong Roster (từ dòng 5 trở đi)
  rosterSheet.eachRow((row, rowNumber) => {
    if (rowNumber < 5) return;

    const noVal = row.getCell(1).value?.toString().trim(); // Cột No (Cột A)
    const code = row.getCell(2).value?.toString().trim();   // Cột Code (Cột B)
    const rawName = row.getCell(3).value?.toString().trim(); // Cột Name (Cột C)
    const name: string = rawName ? rawName : "";

    // Điều kiện: Cột No phải là số (loại bỏ dòng tổng hợp phía trên), Code và Name phải khác rỗng
    if (!noVal || isNaN(Number(noVal))) return;
    if (!code || code === "" || !name || name === "") return;

    let accInfo = accountMap.get(code) || accountMap.get(name.toLowerCase());
    const adAccount = accInfo?.ad || "";
    const contract = accInfo?.contract || "Full-time";
    const role = accInfo?.role || "";

    const templateRowData = [
      templateStt++, 
      adAccount,
      name,
      defaultDeptCode,
      defaultDeptName,
      contract,
      role,
    ];

    dateColIndexes.forEach((colIdx, idx) => {
      const rawShift = row.getCell(colIdx).value?.toString().trim() || "";
      const mappedShift = shiftMap.get(rawShift.toUpperCase()) || rawShift || "OFF";

      templateRowData.push(mappedShift);

      // ĐIỀU KIỆN MỚI: Chỉ ghi vào sheet Import_PhanCa nếu nhân sự có Tài khoản AD khác rỗng
      if (adAccount && adAccount.trim() !== "") {
        sheetImportPhanCa.addRow([
          importRowStt++,
          adAccount,
          defaultDeptCode,
          defaultDeptName,
          contract,
          role,
          datesList[idx],
          mappedShift,
          "",
          "",
          "",
          "",
        ]);
      }
    });

    sheetTemplateGoc.addRow(templateRowData);
  });

  return await outWorkbook.xlsx.writeBuffer();
}