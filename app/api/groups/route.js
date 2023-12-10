import Group from "@/app/models/Group";

export async function GET(){
  try {
    const groups = await Group.find();
    return Response.json({ groups });
  } catch (error) {
    console.error("Error fetching groups:", error);
    return Response.json({ message: "Internal Server Error" });
  }
}