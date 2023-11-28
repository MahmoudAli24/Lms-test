import Student from "../../models/Student";
import Class from "@/app/models/Class";
import dbConnect from "../../libs/dbConnect";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();
  const students = await Student.find();
  if (students.length > 0) {
    return NextResponse.json({ students });
  } else {
    return NextResponse.json({ message: "No students found" });
  }
}

export async function POST(req) {
  const studentData = await req.json();
  await dbConnect();

  // Create a new instance of the Student model
  const newStudent = new Student({
    code: studentData.code,
    name: studentData.name,
    class_code: studentData.class_code,
    attendance: [],
    examGrades: [],
    homework: [],
  });

  // Save the new student
  newStudent
    .save()
    .then((savedStudent) => {
      const studentId = savedStudent.code;
      // Update the corresponding Class document's student_ids array
      Class.findOneAndUpdate(
        { code: studentData.class_code },
        { $push: { student_ids: studentId } },
        { new: true }
      )
        .then((updatedClass) => {
          console.log("updatedClass =>", updatedClass);
        })
        .catch((error) => {
          console.error("Error updating Class:", error);
        });

      return NextResponse.json({ savedStudent });
    })
    .catch((error) => {
      console.error("Error saving student:", error);
      return NextResponse.json({ message: "Internal Server Error" });
    });
}

export async function DELETE(req) {
  const { code } = await req.json();
  await dbConnect();
  try {
    const student = await Student.findOne({ code });
    if (!student) {
      return NextResponse.json({ message: "Student not found" });
    }
    await Class.findOneAndUpdate(
      { code: student.class_id },
      { $pull: { student_ids: code } },
      { new: true }
    );
    await Student.findOneAndDelete({ code });
    return NextResponse.json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error("Error deleting student:", error);
    return NextResponse.json({ message: "Internal Server Error" });
  }
}
