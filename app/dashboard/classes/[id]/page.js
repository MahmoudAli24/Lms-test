import {getClass} from "@/app/actions/classesActions";
async function ClassPage ({params}){
    const {id} = params;
    const {class_} = await getClass(id);

    return(
        <>
        <h1>{class_.className}</h1>
        </>
    )
}
export default ClassPage;