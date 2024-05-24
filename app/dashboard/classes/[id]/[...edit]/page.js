import {Card, CardBody} from "@nextui-org/react";
import {getClass} from "@/app/actions/classesActions";
import EditClassForm from "@/app/ui/EditClassForm/EditClassForm";

export const metadata = {
    title: 'Edit Class Page',
    description: 'Edit Class Page',
}
export default async function editClassPage({params}) {
    const id = params.id
    const {class_} = await getClass(id)


    return (<Card>
        <Card>
            <CardBody>
                <EditClassForm
                    classData={class_}
                />
            </CardBody>
        </Card>
    </Card>)
}