import dbConnect from "@/app/libs/dbConnect";
import User from "@/app/models/User";
import {NextResponse} from "next/server";
import becrypt from "bcrypt";

export async function POST(req){
    try{
        await dbConnect();
        const {username, password} = await req.json();

        const existingUser = await User.findOne({username});

        if (!existingUser){
            return NextResponse.json({error: "Invalid username or password"}, {status: 401})
        }

        const isValid = await becrypt.compare(password, existingUser.passwordHash);

        if (!isValid){
            return NextResponse.json({error: "Invalid username or password"}, {status: 401})
        }
        console.log("Login successful")
        return NextResponse.json({
            username: existingUser.username,
            role: existingUser.role
            }, {status: 200})

    } catch (err){
        console.error(err)
    }
}

export async function GET(){
    try{
        await dbConnect();
        const users = await User.find({}).select('username role')
        return NextResponse.json(users, {status: 200})
    } catch (err){
        console.error(err)
    }
}