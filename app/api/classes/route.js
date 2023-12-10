
import ClassModel from '../../models/Class'
import GroupModel from '../../models/Group'
import dbConnect from '../../libs/dbConnect'

export async function GET(req) {
  const page = +req.nextUrl.searchParams.get("page");
  const rowsPerPage = +req.nextUrl.searchParams.get("rowsPerPage");
  await dbConnect()
  const count = await ClassModel.countDocuments();
  const classes = await ClassModel.find().skip((page - 1) * rowsPerPage).limit(rowsPerPage);
  if (classes.length > 0) {
    return Response.json({ classes, count })
  } else {
    return Response.json({ message: "no Classes Found" })
  }
}
// add class
export async function POST(req) {
  const { className, groups } = await req.json();
  try {
    await dbConnect()
    const classInstance = new ClassModel({
      className,
      groups: [], // Initialize with an empty array
    });

    // Save the class instance to get its _id
    const savedClass = await classInstance.save();

    // Create and save each group
    const savedGroups = await Promise.all(
      groups.map(async (groupData) => {
        const groupInstance = new GroupModel({
          ...groupData,
          class_id: savedClass._id,
        });
        return groupInstance.save();
      })
    );

    // Update the class instance with the saved groups
    savedClass.groups = savedGroups;
    await savedClass.save();

    return Response.json({ message: 'Class added successfully' })
  } catch (error) {
    console.error("Error adding class:", error);
    return Response.json({ message: 'Unable to add class' })
  }

}