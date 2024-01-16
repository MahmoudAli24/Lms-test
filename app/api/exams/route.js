import dbConnect from "@/app/libs/dbConnect";
import Exam from "../../models/Exam";
import {NextResponse} from "next/server";

export async function POST(req){
    try{
        await dbConnect()
        const { group_id, date, examName, grades } = await req.json()

        const newExam = new Exam({
            group_id,
            date,
            examName,
            grades,
        });
        // Save the new exam to the database
        const savedExam = await newExam.save();

        return NextResponse.json({savedExam}, {status: 201})

    } catch (error) {
        throw error
    }
}