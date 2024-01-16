"use client"
import 'react-day-picker/dist/style.css';
import {useState} from "react";
import {Popover, PopoverContent, PopoverTrigger} from "@radix-ui/react-popover";

import {Button} from "@nextui-org/react";
import {format} from "date-fns";
import {CiCalendarDate} from "react-icons/ci";
import {DayPicker} from "react-day-picker";

export default function DatePicker() {

    const [date, setDate] = useState();
    return (<Popover>
        <PopoverTrigger asChild>
            <Button
                color={date ? "primary" : "default"}
                className={`w-[280px] justify-start text-left font-normal ${date ? "text-black" : "text-white-500"}`}
            >
                <CiCalendarDate/>
                {date ? format(date, "d/M/yyyy") : <span>Pick a date</span>}
            </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
            <DayPicker
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
            />
        </PopoverContent>
    </Popover>);
}