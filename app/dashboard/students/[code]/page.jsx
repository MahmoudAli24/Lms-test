"use server"
import getStudent from "@/app/actions/getStudent";
import {Card , CardBody} from "@nextui-org/react";
export default async function page({params}) {
    const code = +params.code
    const details = await getStudent(code)
    return(
        <div>
            <Card>
                <CardBody>
                    <p>{details.student.name}</p>
                </CardBody>
            </Card>
        </div>
    )
}