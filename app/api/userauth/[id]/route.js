import dbConnect from "@/app/libs/dbConnect";
import User from "@/app/models/User";
import {NextResponse} from "next/server";
import bcrypt from "bcrypt";

export async function DELETE(req, {params}) {
    await dbConnect();
    try {
        const id = params.id
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return NextResponse.json({error: "User not found"}, {status: 404})
        }
        return NextResponse.json({user}, {status: 200})
    } catch (err) {
        console.error(err)
    }
}

export async function GET(req, {params}) {
    await dbConnect();
    try {
        const id = params.id
        const user = await User.findById(id).select('username role')
        if (!user) {
            return NextResponse.json({error: "User not found"}, {status: 404})
        }
        return NextResponse.json({user}, {status: 200})
    } catch (err) {
        console.error(err)
    }
}

export async function PATCH(req, {params}) {
    await dbConnect();
    const id = params.id
    try {
        const {password, username, role} = await req.json()
        const passwordHash = await bcrypt.hash(password, 10)
        const user = await User.findByIdAndUpdate(id, {username, role, passwordHash}, {new: true})
        if (!user) {
            return NextResponse.json({error: "User not found"}, {status: 404})
        }
        return NextResponse.json({user}, {status: 200})
    } catch (err) {
        console.error(err)
    }
}