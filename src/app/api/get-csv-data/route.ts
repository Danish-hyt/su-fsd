import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import csv from "csvtojson";

const CSV_FILE_PATH = path.join(process.cwd(), "public", "data.csv");

export async function GET() {
  try {
    const fileContent = await fs.readFile(CSV_FILE_PATH, "utf-8");
    const jsonArray = await csv().fromString(fileContent);
    return NextResponse.json({
      data: jsonArray.map((el) => {
        const [created_at, filename] =
          el["2023-06-25 11:00;1abc"].txt.split(";");
        return { created_at, filename };
      }),
    });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    return NextResponse.json(
      { message: "CSV file not found" },
      { status: 404 }
    );
  }
}
