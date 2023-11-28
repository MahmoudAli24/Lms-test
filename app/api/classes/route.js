
import Class from '../../models/Class'
import dbConnect from '../../libs/dbConnect'

export async function GET() {
  await dbConnect()
  const classes = await Class.find()
  if(classes.length > 0 ){
    return Response.json({classes})
  }else{
    return Response.json({message: 'No Classes found'})
  }
}

export async function POST(req) {
  const { className, code } = await req.json();
  await dbConnect()
  const class_ = await Class.create({ className, code })
  return Response.json({class_})
}