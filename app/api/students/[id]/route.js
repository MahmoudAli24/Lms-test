import Student from "../../../models/Student";
import Class from "@/app/models/Class";
import dbConnect from "../../../libs/dbConnect";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const code = parseInt(params.id);
  await dbConnect();

  try {
    const student = await Student.findOne({ code }).populate({
      path: "class_code",
      model: "Class",
      select: "className"
    })

    if (!student) {
      return NextResponse.json({ message: "Student not found" });
    }

    // Extract class and group names from the populated fields
    const className = student.class_code ? student.class_code.className : null;

    // Create a modified student object with class_name and group_name
    const modifiedStudent = {
      ...student.toJSON(),
      class_name: className,
      // Omit class_code and group_code from the response if desired
      // class_code: undefined,
      // group_code: undefined,
    };

    return NextResponse.json({ student: modifiedStudent });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error fetching student" }, 500);
  }
}


export async function PATCH(req, { params }) {
  const studentCode = +params.id;
  const studentData = await req.json();

  try {
    await dbConnect();

    // Retrieve the student
    const student = await Student.findOne({ code: studentCode });
    if (!student) {
      return NextResponse.json({ message: "Student not found" });
    }

    // Update class and group if provided in the request
    if (studentData.class_code && studentData.group_code) {
      // Remove student from the old class and group
      await Class.findOneAndUpdate(
        { student_ids: studentCode },
        {
          $pull: {
            student_ids: studentCode,
            "groups.$.student_ids": studentCode,
          },
        },
        { new: true }
      );

      // Add student to the new class and group
      const updatedClass = await Class.findOneAndUpdate(
        { code: studentData.class_code, "groups.code": studentData.group_code },
        {
          $push: { student_ids: studentCode },
          $addToSet: { "groups.$.student_ids": studentCode },
        },
        { new: true }
      );

      if (!updatedClass) {
        return NextResponse.json({ message: "New Class not found" });
      }
    }

    // Update student data
    const updatedStudent = await Student.findOneAndUpdate(
      { code: studentCode },
      { $set: studentData },
      { new: true }
    );

    if (!updatedStudent) {
      return NextResponse.json({ message: "Error updating student" });
    }

    return NextResponse.json({ updatedStudent });
  } catch (error) {
    console.error("Error updating student:", error);
    return NextResponse.json({ message: "Internal Server Error" });
  }
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
    await Student.findByIdAndDelete({ _id: student._id });
    return NextResponse.json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error("Error deleting student:", error);
    return NextResponse.json({ message: "Internal Server Error" });
  }
}
