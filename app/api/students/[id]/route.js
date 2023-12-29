import Student from "../../../models/Student";
import Attendance from "@/app/models/Attendance";
import Homework from "@/app/models/Homework";
import Vocabulary from "@/app/models/Vocabulary";
import Class from "@/app/models/Class";
import Group from "@/app/models/Group";
import dbConnect from "../../../libs/dbConnect";
import {NextResponse} from "next/server";

export async function GET(req, { params }) {
    try {
        await dbConnect();
        const code = parseInt(params.id);
        const selectedFields = req.nextUrl.searchParams.get("fields");

        const projection = buildProjection(selectedFields);

        let studentQuery = Student.findOne({ code }, projection)
            .populate("attendance" , "status date -_id")
            .populate("homework" , "status date -_id")
            .populate("vocabulary" , "status date -_id")

        if (selectedFields && (selectedFields.includes("className") || selectedFields.includes("groupName"))) {
            studentQuery = studentQuery
                .populate("class_id", "className")
                .populate("group_id", "groupName")



            const student = await studentQuery;

            if (!student) {
                return NextResponse.json({ message: "Student not found" });
            }

            const simplifiedStudent = mapStudentToSimplifiedFormat(student);

            return NextResponse.json({ student : simplifiedStudent});
        }

        const student = await studentQuery;

        if (!student) {
            return NextResponse.json({ message: "Student not found" });
        }

        return NextResponse.json({ student });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Error fetching student" });
    }
}

function buildProjection(selectedFields) {
    if (!selectedFields) {
        return { _id: 0 };
    }

    const fieldsArray = selectedFields.split(',');
    const projection = {};

    fieldsArray.forEach(field => {
        projection[field] = 1;
    });

    return projection;
}

function mapStudentToSimplifiedFormat(student) {
    return {
        code: student.code,
        name: student.name,
        className: student.class_id ? student.class_id.className : "Not Have Class",
        groupName: student.group_id ? student.group_id.groupName : "Not Have Group",
        attendance: student.attendance,
        examGrades: student.examGrades,
        homework: student.homework,
        vocabulary: student.vocabulary,
        createdAt: student.createdAt,
    };
}

export async function PATCH(req, {params}) {
    try {
        await dbConnect();
        const studentCode = +params.id;
        const studentData = await req.json();
        const student = await Student.findOne({code: studentCode});

        if (!student) {
            return NextResponse.json({message: "Student not found"} , {status: 404});
        }

        // Check if the class and group have changed
        const classChanged = student.class_id !== studentData.class_id;
        const groupChanged = student.group_id !== studentData.group_id;

        if (classChanged) {
            // Update the class if it has changed
            await updateClass(student.class_id, student._id, studentData.class_id);
        }

        if (groupChanged) {
            // Update the group if it has changed
            await updateGroup(student.group_id, student._id, studentData.group_id, studentData.class_id);
        }

        await updateStudent(student._id, studentData);

        return NextResponse.json({ message: "Student updated successfully" });


    } catch (error) {
        console.error(error);
        return NextResponse.json({message: "Error updating student"});
    }
}

async function updateClass(oldClassId, studentId, newClassId) {
    // Remove student from the old class
    await Class.findByIdAndUpdate({ _id: oldClassId }, { $pull: { student_ids: studentId } }, { new: true });
    // Add student to the new class
    await Class.findByIdAndUpdate({ _id: newClassId }, { $push: { student_ids: studentId } }, { new: true });
}

async function updateGroup(oldGroupId, studentId, newGroupId, classId) {
    // Check if the new group is part of the class
    const isGroupInClass = await Group.findOne({ _id: newGroupId, class_id: classId });

    if (!isGroupInClass) {
        return NextResponse.json({
            message: "The new group is not part of the specified class",
        });
    }

    // Remove student from the old group
    await Group.findByIdAndUpdate({ _id: oldGroupId }, { $pull: { student_ids: studentId } }, { new: true });
    // Add student to the new group
    await Group.findByIdAndUpdate({ _id: newGroupId }, { $push: { student_ids: studentId } }, { new: true });
}

async function updateStudent(studentId, updatedData) {
    // Update the student data
    await Student.findByIdAndUpdate({ _id: studentId }, { ...updatedData }, { new: true });
}

export async function DELETE(req, {params}) {
    const studentCode = +params.id;
    await dbConnect();
    try {
        const student = await Student.findOne({code: studentCode});
        if (!student) {
            return NextResponse.json({message: "Student not found"});
        }
        await Class.findOneAndUpdate({code: student.class_id}, {$pull: {student_ids: student._id}}, {new: true});

        await Group.findOneAndUpdate({code: student.group_id}, {$pull: {student_ids: student._id}}, {new: true});

        await Student.findByIdAndDelete({_id: student._id});
        return NextResponse.json({message: "Student deleted successfully"});
    } catch (error) {
        console.error("Error deleting student:", error);
        return NextResponse.json({message: "Internal Server Error"});
    }
}
