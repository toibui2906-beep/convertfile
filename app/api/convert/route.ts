import { NextRequest, NextResponse } from "next/server";
import { processRosterData } from "../../lib/roster-helpers";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "Vui lòng tải lên file Excel Roster hợp lệ." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    
    // Gọi hàm xử lý thuật toán chuyên biệt
    const processedBuffer = await processRosterData(arrayBuffer);

    return new NextResponse(processedBuffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="Roster_Converted_${Date.now()}.xlsx"`,
      },
    });
  } catch (error: any) {
    console.error("Error converting roster:", error);
    return NextResponse.json(
      { error: "Lỗi xử lý thuật toán file: " + error.message },
      { status: 500 }
    );
  }
}