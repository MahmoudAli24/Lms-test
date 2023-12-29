import {revalidatePath} from 'next/cache'
import {NextResponse} from "next/server";
import dbConnect from "../../libs/dbConnect";
import Student from "../../models/Student";
import Class from "@/app/models/Class";
import Group from "@/app/models/Group";

export async function GET(req) {
    try {
        await dbConnect();

        const page = +req.nextUrl.searchParams.get("page") ;
        const rowsPerPage = +req.nextUrl.searchParams.get("rowsPerPage") ;
        const searchName = req.nextUrl.searchParams.get("name");
        const selectedFields = req.nextUrl.searchParams.get("fields"); // Fields to be selected by the client
        const groupId = req.nextUrl.searchParams.get("group_id");
        let query = {};

        if (groupId) {
            query.group_id = groupId;
        }


        if (searchName) {
            // If a name is provided, add a search condition to the query
            query = { name: { $regex: new RegExp(searchName, 'i') } };
        }

        const projection = buildProjection(selectedFields); // Helper function to build the projection

        const count = await Student.countDocuments(query);
        const students = await Student.find(query)
            .populate('group_id', 'groupName -_id') // Populate groupName for the Group and exclude _id
            .populate('class_id', 'className -_id') // Populate groupName for the Group and exclude _id
            .select(projection) // Apply the projection to select fields
            .skip((page - 1) * rowsPerPage)
            .limit(rowsPerPage);

        const simplifiedStudents = students.map(student => {
            return {
                code: student.code,
                name: student.name,
                className: student.class_id ? student.class_id.className : "Not Have Group",
                groupName: student.group_id ? student.group_id.groupName : "Not Have Group",
                attendance: student.attendance,
                examGrades: student.examGrades,
                homework: student.homework,
                createdAt: student.createdAt,
            }
        });
        if (students.length > 0) {
            return NextResponse.json({ students:simplifiedStudents, count });
        } else {
            return NextResponse.json({ message: "No students found" });
        }
    } catch (error) {
        console.error("Error fetching students:", error);
        return NextResponse.json({ message: "Internal Server Error" });
    }
}

// Helper function to build the projection based on selected fields
function buildProjection(selectedFields) {
    if (!selectedFields) {
        // If no specific fields are requested, return all fields except _id
        return { _id: 0 };
    }

    // Split the selected fields and create a projection object
    const fieldsArray = selectedFields.split(',');
    const projection = {};

    fieldsArray.forEach(field => {
        projection[field] = 1;
    });

    return projection;
}

export async function POST(req) {
    const path = req.nextUrl.searchParams.get('path')
    const studentData = await req.json();
    console.log("studentData", studentData)
    await dbConnect();

    try {
        // Create a new instance of the Student model
        const newStudent = new Student({
            code: studentData.code,
            name: studentData.name,
            class_id: studentData.class_id,
            group_id: studentData.group_id,
            phone: studentData.phone,
            attendance: [],
            examGrades: [],
            homework: [],
            vocabulary: [],
        });
        const classDocument = await Class.findById(studentData.class_id);
        if (!classDocument) {
            return NextResponse.json({error: "Class not found"}, {status: 404});
        }
        const groupDocument = await Group.findById(studentData.group_id);
        if (!groupDocument) {
            return NextResponse.json({error: "Group not found"}, {status: 404});
        }

        // Check if the student code already exists
        const studentDocument = await Student.findOne({
            code: studentData.code,
        });
        if (studentDocument) {
            return NextResponse.json({error: "Student code already exists"}, {
                status: 400,
            });
        }
        // Save the student to the database
        const savedStudent = await newStudent.save();
        // Add the student to the class and group
        await Class.findByIdAndUpdate(
            studentData.class_id,
            {$push: {student_ids: savedStudent._id}},
            {new: true}
        );
        await Group.findByIdAndUpdate(
            studentData.group_id,
            {$push: {student_ids: savedStudent._id}},
            {new: true}
        );
        if (path) {
            revalidatePath(path)
        }
        return NextResponse.json({savedStudent});
    } catch (error) {
        console.error("Error saving student:", error);
        return NextResponse.json({message: "Internal Server Error"});
    }
}

//Update Many Students

export async function PATCH(req) {
    const {studentIds, studentData} = await req.json();

    try {
        await dbConnect();

        // Validate if the provided data is an array of student IDs
        if (!Array.isArray(studentIds)) {
            return NextResponse.json({message: "Invalid input for student IDs"});
        }

        // Update class and group if provided in the request
        if (studentData.class_id && studentData.group_id) {
            // Remove students from the old class and group
            await Class.updateMany(
                {student_ids: {$in: studentIds}},
                {
                    $pull: {
                        student_ids: {$in: studentIds},
                        "groups.$[].student_ids": {$in: studentIds},
                    },
                },
                {new: true}
            );

            // Add students to the new class and group
            const updatedClass = await Class.updateMany(
                {code: studentData.class_id, "groups.code": studentData.group_id},
                {
                    $push: {student_ids: {$each: studentIds}},
                    $addToSet: {"groups.$[].student_ids": {$each: studentIds}},
                },
                {new: true}
            );

            if (!updatedClass) {
                return NextResponse.json({message: "New Class not found"});
            }
        }

        // Update student data for each student
        const updatedStudents = await Student.updateMany(
            {code: {$in: studentIds}},
            {$set: studentData},
            {new: true}
        );

        if (!updatedStudents) {
            return NextResponse.json({message: "Error updating students"});
        }

        return NextResponse.json({updatedStudents});
    } catch (error) {
        console.error("Error updating students:", error);
        return NextResponse.json({message: "Internal Server Error"});
    }
}

export async function DELETE(req) {
    const {code} = await req.json();
    await dbConnect();
    try {
        const student = await Student.findOne({code});
        if (!student) {
            return NextResponse.json({message: "Student not found"});
        }
        await Class.findOneAndUpdate(
            {code: student.class_id},
            {$pull: {student_ids: code}},
            {new: true}
        );
        await Student.findOneAndDelete({code});
        return NextResponse.json({message: "Student deleted successfully"});
    } catch (error) {
        console.error("Error deleting student:", error);
        return NextResponse.json({message: "Internal Server Error"});
    }
}
