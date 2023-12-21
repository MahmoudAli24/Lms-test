import Student from "../../../models/Student";
import Class from "@/app/models/Class";
import Group from "@/app/models/Group";
import dbConnect from "../../../libs/dbConnect";
import {NextResponse} from "next/server";

export async function GET(req, {params}) {
    const code = parseInt(params.id);
    await dbConnect();

    try {
        const student = await Student.findOne({code})

        if (!student) {
            return NextResponse.json({message: "Student not found"});
        }


        return NextResponse.json({student});
    } catch (error) {
        console.error(error);
        return NextResponse.json({message: "Error fetching student"});
    }
}


export async function PATCH(req, {params}) {
    const studentCode = +params.id;
    const studentData = await req.json();

    try {
        await dbConnect();

        // Retrieve the student
        const student = await Student.findOne({code: studentCode});
        if (!student) {
            return NextResponse.json({message: "Student not found"});
        }

        // check if the class and group have changed
        const classChanged = student.class_code !== studentData.class_code;
        const groupChanged = student.group_code !== studentData.group_code;

        if (classChanged) {
            // if the class has changed, update the class
            await Class.findOneAndUpdate(
                {code: student.class_code},
                {$pull: {student_ids: studentCode}},
                {new: true}
            );
            await Class.findOneAndUpdate(
                {code: studentData.class_code},
                {$push: {student_ids: studentCode}},
                {new: true}
            );
        }

        if (groupChanged) {
            // if the group has changed, update the group
            await Group.findOneAndUpdate(
                {code: student.group_code},
                {$pull: {student_ids: studentCode}},
                {new: true}
            )
            await Group.findOneAndUpdate(
                {code: studentData.group_code},
                {$push: {student_ids: studentCode}},
                {new: true}
            )
        }

        // if neither the class nor the group has changed, update the student
        await Student.findOneAndUpdate(
            {code: studentCode},
            { ...studentData , code: studentCode},
            {new: true}
        );

        return NextResponse.json({message: "Student updated successfully"});

    } catch (error) {
        console.error("Error updating student:", error);
        return NextResponse.json({message: "Internal Server Error"});
    }
}

export async function DELETE(req, {params}) {
    const studentCode = +params.id;
    await dbConnect();
    try {
        const student = await Student.findOne({code: studentCode});
        if (!student) {
            return NextResponse.json({message: "Student not found"});
        }
        await Class.findOneAndUpdate(
            {code: student.class_code},
            {$pull: {student_ids: studentCode}},
            {new: true}
        );

        await Group.findOneAndUpdate(
            {code: student.group_code},
            {$pull: {student_ids: studentCode}},
            {new: true}
        );

        await Student.findByIdAndDelete({_id: student._id});
        return NextResponse.json({message: "Student deleted successfully"});
    } catch (error) {
        console.error("Error deleting student:", error);
        return NextResponse.json({message: "Internal Server Error"});
    }
}
