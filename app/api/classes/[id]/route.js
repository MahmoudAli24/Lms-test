import dbConnect from "@/app/libs/dbConnect";
import Class from "@/app/models/Class";
import { NextResponse } from "next/server";

export async function DELETE(req , {params}){
  const classCode = +params.id;
  await dbConnect();
  try {
    const class_ = await Class.findOne({ code: classCode });
    if (!class_) {
      return NextResponse.json({ message: "Class not found" });
    }
    await Class.findOneAndDelete({ code: classCode });
    return NextResponse.json({ message: "Class deleted successfully" });
  } catch (error) {
    return NextResponse.json({ message: error.message });
  }
}