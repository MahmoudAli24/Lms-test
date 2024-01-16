import Class from "@/app/models/Class";
import Group from "@/app/models/Group";
import dbConnect from "@/app/libs/dbConnect";
import {NextResponse} from "next/server";

export async function DELETE(req, {params}) {
    const {id} = params;
    await dbConnect();
    try {
        // Find the group and its associated class
        const group = await Group.findById(id);
        if (!group) {
            return NextResponse.json({message: "Group not found"}, {status: 404});
        }

        const {class_id} = group;

        // Find the class
        const class_ = await Class.findById(class_id);
        if (!class_) {
            return NextResponse.json({message: "Class not found"}, {status: 404});
        }

        // Filter out the deleted group from the class
        const {groups} = class_;
        const newGroups = groups.filter((groupId) => groupId.toString() !== id.toString());

        // Update the class with the filtered groups
        await Class.findByIdAndUpdate(
            {_id: class_id},
            {groups: newGroups},
            {new: true}
        );

        // Delete the group
        await Group.findByIdAndDelete(id);

        return NextResponse.json({message: "Group deleted successfully"}, {status: 200});
    } catch (error) {
        return NextResponse.json({message: error.message}, {status: 500});
    }
}

export async function GET(req, {params}) {
    try {
        await dbConnect()
        const {id} = params;

        const group = await Group.findById(id).populate({
            path: "student_ids",
            select: "name code attendance",
            populate: {
                path: "attendance",
                select: "date status",
            },
        })
        if (!group) {
            return NextResponse.json({message: "Group not found"}, {status: 404});
        }
        return NextResponse.json({group}, {status: 200});
    } catch (error) {
        return NextResponse.json({message: error.message}, {status: 500});
    }
}

