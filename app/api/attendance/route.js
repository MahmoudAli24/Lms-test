// add Attendance route to app/api/attendance/route.js
import dbConnect from "@/app/libs/dbConnect";
import Attendance from "@/app/models/Attendance";
import Student from "@/app/models/Student";

export async function POST(req) {
    try {
        await dbConnect();
        const { group_id, date, grades } = await req.json();

        // Iterate through each student's grade
        for (const grade of grades) {
            // Check if the student already has attendance for the same date
            const existingAttendanceForStudent = await Student.findOne({
                _id: grade.student_id,
                'attendance.date': date,
            });

            // If no existing attendance for the same date, add attendance
            if (!existingAttendanceForStudent) {
                // Update student attendance
                await Student.updateOne(
                    { _id: grade.student_id },
                    {
                        $push: {
                            attendance: {
                                date,
                                status: grade.grade,
                            },
                        },
                    }
                );
            }
        }

        // Check if there is already an attendance record for the group on the same day
        const existingAttendance = await Attendance.findOne({ group_id, date });

        // If no existing attendance record, create a new one
        if (!existingAttendance) {
            const attendance = new Attendance({ group_id, date, grades });
            await attendance.save();
        }

        return Response.json({ message: 'Attendance added successfully' });
    } catch (error) {
        console.error('Error adding attendance:', error);
        return Response.json({ message: 'Internal Server Error' });
    }
}

// get attendance

export async function GET(req) {
    try {
        await dbConnect();
        const attendance = await Attendance.find()

        if (attendance.length > 0) {
            return Response.json({attendance})
        } else {
            return Response.json({message: "No attendance found"})
        }
    } catch (error) {
        console.error("Error fetching attendance:", error);
        return Response.json({message: "Internal Server Error"});
    }
}