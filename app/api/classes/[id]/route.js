import dbConnect from "@/app/libs/dbConnect";
import Class from "@/app/models/Class";
import Group from "@/app/models/Group";
import {NextResponse} from "next/server";

export async function DELETE(req, {params}) {
    const classCode = +params.id;
    await dbConnect();
    try {
        const class_ = await Class.findOne({code: classCode});
        if (!class_) {
            return NextResponse.json({message: "Class not found"});
        }
        await Class.findOneAndDelete({code: classCode});
        return NextResponse.json({message: "Class deleted successfully"});
    } catch (error) {
        return NextResponse.json({message: error.message});
    }
}

export async function GET(req, {params}) {
    const classCode = params.id;
    await dbConnect();
    try {
        const class_ = await Class.findById(classCode).select("-student_ids").populate("groups", "-student_ids -class_id -__v");
        if (!class_) {
            return NextResponse.json({message: "Class not found"});
        }
        return NextResponse.json({class_});
    } catch (error) {
        return NextResponse.json({message: error.message});
    }
}

export async function PATCH(req, {params}) {
    const classCode = params.id;
    const data = await req.json();
    console.log("dataaaaaaaaaaa", data)
    await dbConnect();
    try {
        const {className, groups} = data;

        // Update class details
        const updatedClass = await Class.findByIdAndUpdate({_id: classCode}, {className}, {
            new: true
        });

        if (!updatedClass) {
            return NextResponse.json({message: "Class not found"});
        }

        // Update or create groups associated with the class
        await Promise.all(groups.map(async (group) => {
            const {_id, groupName} = group;

            if (_id) {
                // If groupId is provided, update the existing group
                const existingGroup = await Group.findById(_id);

                if (existingGroup) {
                    await Group.findByIdAndUpdate({_id}, {groupName}, {new: true, runValidators: true});
                } else {
                    console.log('Group not found');
                }
            } else if (!_id) {
                // If groupId is not provided, create a new group
                const newGroup = new Group({groupName, class_id: classCode, student_ids: []});
                await newGroup.save();

                // Add the group to the class
                await Class.findByIdAndUpdate({_id: classCode}, {
                    $push: {groups: newGroup._id}
                }, {new: true});
                console.log('Group created')
            }
            return group;
        }));

        return NextResponse.json({class: updatedClass});
    } catch (error) {
        return NextResponse.json({message: error.message});
    }
}

