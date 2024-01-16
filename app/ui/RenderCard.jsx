import {Card, CardBody} from "@nextui-org/react";

export default function RenderCard({title, value, bgColor, Icon}) {
    return (<Card className={`${bgColor}`}>
        <CardBody className="flex flex-row gap-3 items-center">
      <span className="w-[50px] h-[50px] rounded-full bg-white flex items-center justify-center">
        <Icon size="25" color="#000000"/>
      </span>
            <span className="flex flex-col">
        <p className="text-1xl light:text-white ">{title}</p>
        <span className="font-semibold text-lg">{value}</span>
      </span>
        </CardBody>
    </Card>)
}