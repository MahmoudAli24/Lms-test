import User from "@/app/models/User";
import bcrypt from "bcrypt";
import dbConnect from "@/app/libs/dbConnect";
import {NextResponse} from "next/server";

export async function POST(req) {
    try {
        await dbConnect();
        const { username, password, role } = await req.json();
        const userExists = await User.findOne({ username, role });
        if (userExists) {
            return NextResponse.json({ message: 'User already exists' },{ status: 400 });
        }
        const passwordHash = await bcrypt.hash(password, 10);
        await User.create({ username, passwordHash, role });
        return NextResponse.json({ message: 'User created' } ,{ status: 201 });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }

}