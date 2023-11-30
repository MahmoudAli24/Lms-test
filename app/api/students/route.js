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

  try {
    // Create a new instance of the Student model
    const newStudent = new Student({
      code: studentData.code,
      name: studentData.name,
      class_code: studentData.class_code,
      group_code: studentData.group_code,
      attendance: [],
      examGrades: [],
      homework: [],
    });
    const classDocument = await Class.findOne({ code: studentData.class_code });

    if (!classDocument) {
      return Response.json({ message: "Class not found" }, { status: 400 });
    }

    const groupToUpdate = classDocument.groups.find(
      (group) => group.code === studentData.group_code
    );

    if (!groupToUpdate) {
      return NextResponse.json({ message: "Group not found" }, { status: 400 });
    }

    // Save the new student
    const savedStudent = await newStudent.save();

    // Update the corresponding Class document's student_ids array and group's student_ids
    const updatedClass = await Class.findOneAndUpdate(
      { code: studentData.class_code, "groups.code": studentData.group_code },
      {
        $push: { student_ids: savedStudent.code },
        $addToSet: {
          "groups.$.student_ids": savedStudent.code,
        },
      },
      { new: true }
    );

    return NextResponse.json({ savedStudent });
  } catch (error) {
    console.error("Error saving student:", error);
    return NextResponse.json({ message: "Internal Server Error" });
  }
}

//Update Many Students

export async function PATCH(req) {
  const { studentIds, studentData } = await req.json();

  try {
    await dbConnect();

    // Validate if the provided data is an array of student IDs
    if (!Array.isArray(studentIds)) {
      return NextResponse.json({ message: "Invalid input for student IDs" });
    }

    // Update class and group if provided in the request
    if (studentData.class_code && studentData.group_code) {
      // Remove students from the old class and group
      await Class.updateMany(
        { student_ids: { $in: studentIds } },
        {
          $pull: {
            student_ids: { $in: studentIds },
            "groups.$[].student_ids": { $in: studentIds },
          },
        },
        { new: true }
      );

      // Add students to the new class and group
      const updatedClass = await Class.updateMany(
        { code: studentData.class_code, "groups.code": studentData.group_code },
        {
          $push: { student_ids: { $each: studentIds } },
          $addToSet: { "groups.$[].student_ids": { $each: studentIds } },
        },
        { new: true }
      );

      if (!updatedClass) {
        return NextResponse.json({ message: "New Class not found" });
      }
    }

    // Update student data for each student
    const updatedStudents = await Student.updateMany(
      { code: { $in: studentIds } },
      { $set: studentData },
      { new: true }
    );

    if (!updatedStudents) {
      return NextResponse.json({ message: "Error updating students" });
    }

    return NextResponse.json({ updatedStudents });
  } catch (error) {
    console.error("Error updating students:", error);
    return NextResponse.json({ message: "Internal Server Error" });
  }
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
