import Student from "../../../models/Student";
import Class from "@/app/models/Class";
import dbConnect from "../../../libs/dbConnect";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const code = params.id;
  await dbConnect();
  const student = await Student.findOne({ code });
  if (!student) {
    return NextResponse.json({ message: "Student not found" });
  }
  return NextResponse.json({ student });
}

export async function PATCH(req, { params }) {
  const studentCode = +params.id;
  const studentData = await req.json();
  await dbConnect();
  let update = await Student.findOneAndUpdate({ code: studentCode }, studentData, {new: true});
  if (!update) {
    return NextResponse.json({ message: "Student not found" });
  }
  return NextResponse.json({ update });
}

export async function DELETE(req, { params }) {
  const studentCode = +params.id;
  await dbConnect();
  try {
    const student = await Student.findOne({ code: studentCode });
    if (!student) {
      return NextResponse.json({ message: "Student not found" });
    }
    await Class.findOneAndUpdate(
      { code: student.class_code },
      { $pull: { student_ids: studentCode } },
      { new: true }
    );
    await Student.findByIdAndDelete({ _id: student._id })
    return NextResponse.json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error("Error deleting student:", error);
    return NextResponse.json({ message: "Internal Server Error" });
  }
}


