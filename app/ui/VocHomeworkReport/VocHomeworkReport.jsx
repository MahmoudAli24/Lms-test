"use client"
import {
    Input, Pagination, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip
} from "@nextui-org/react";
import {Select, SelectItem} from "@nextui-org/select";
import {useCallback, useEffect, useMemo, useState} from "react";
import Link from "next/link";
import {EyeIcon} from "@/app/ui/Icons/EyeIcon";
import {EditIcon} from "@/app/ui/Icons/EditIcon";
import {getVocAndHomeworkReport} from "@/app/actions/studentsActions";
import {format} from "date-fns";
import {calculateAverageVocabularyStatus, calculateHomeworkCompletionRate} from "@/app/functions/vocabularyAnalysis";

const vocStatusOptions = [{value: "excellent", label: "Excellent"}, {value: "good", label: "Good"}, {
    value: "very good", label: "Very Good"
}, {value: "weak", label: "Weak"}, {value: "absent", label: "Absent"}]
const homeworkStatusOptions = [{value: true, label: "Done"}, {value: false, label: "Not Done"}]

function VocHomeworkReport({classesOptions, groupsOptions}) {
    const [selectedClass, setSelectedClass] = useState(`${classesOptions[0].value}`)
    const groups = groupsOptions && groupsOptions.filter((item) => item.class_id === selectedClass)
    const [selectedGroups, setSelectedGroups] = useState(`${groups[0].value}`)
    const [vocStatus, setVocStatus] = useState(`absent`)
    const [homeworkStatus, setHomeworkStatus] = useState(`${homeworkStatusOptions[1].value}`)
    const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"))
    const [selectedStudents, setSelectedStudents] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [page, setPage] = useState(1);
    const [studentsCount, setStudentsCount] = useState(0);
    const rowsPerPage = 5;

    const pages = useMemo(() => {
        return studentsCount ? Math.ceil(studentsCount / rowsPerPage) : 1;
    }, [studentsCount, rowsPerPage]);

    const fetchStudentsStatus = async () => {
        try {
            setIsLoading(true)
            const {students ,count} = await getVocAndHomeworkReport(selectedGroups, selectedDate, vocStatus, homeworkStatus , page, rowsPerPage)
            const data = students.map((item) => {
                return {
                    ...item,
                    vocPercent: calculateAverageVocabularyStatus(item.vocabulary),
                    homeworkPercent: calculateHomeworkCompletionRate(item.homework)
                }
            })
            setSelectedStudents(data)
            setStudentsCount(count)
            setIsLoading(false)
        } catch (e) {
            console.log(e)
        }
    }
    console.log("selectedStudents" , selectedStudents)
    useEffect(() => {
        if (selectedClass && selectedGroups && selectedDate && vocStatus && homeworkStatus) {
            fetchStudentsStatus()
        }
    }, [selectedClass, selectedGroups, selectedDate, vocStatus, homeworkStatus , page]);

    const columns = [{name: "ID", uid: "id"}, {name: "NAME", uid: "name"}, {
        name: "PHONE", uid: "phone"
    }, {name: "Homework Percent", uid: "homeworkPercent"}, {name: "VOC Percent", uid: "vocPercent"}, {
        name: "ACTIONS", uid: "actions"
    }];

    const handleVocStatusChange = (e) => {
        setVocStatus(e.target.value)
        if (e.target.value === "absent") {
            setHomeworkStatus(`${homeworkStatusOptions[1].value}`)
        }
    }

    const renderCell = useCallback((item, columnKey) => {
        const cellValue = selectedStudents[columnKey];
        switch (columnKey) {
            case "id":
                return item.code;
            case "name":
                return <span className="flex justify-start">{item.name}</span>
            case "phone":
                return <span className="flex justify-start">{item.phone}</span>
            case "homeworkPercent":
                return <span className="text-blue-500 flex justify-start">{item.homeworkPercent}%</span>;
            case "vocPercent":
                return <span className="text-blue-500">{item.vocPercent}%</span>;
            case "actions":
                return <div className="flex gap-2 justify-start">
                    <Tooltip content='Details'>
                        <Link
                            href={`/dashboard/students/${item.code}`}
                            className='text-lg text-default-400 cursor-pointer active:opacity-50 bg-transparent'
                        >
                            <EyeIcon/>
                        </Link>
                    </Tooltip>
                    <Tooltip content='Edit Student'>
                        <Link
                            href={`/dashboard/students/${item.code}/edit`}
                            className='text-lg text-default-400 cursor-pointer active:opacity-50'>
                            <EditIcon/>
                        </Link>
                    </Tooltip>
                </div>;
            default:
                return cellValue;
        }
    }, [selectedStudents])
    return (<div className="laptop:grid laptop:grid-cols-9 gap-3 flex flex-col-reverse">
        <div className="laptop:col-span-6">
            <Table
                bottomContent={<div className='flex w-full justify-center'>
                    <Pagination
                        isCompact
                        showControls
                        showShadow
                        color='secondary'
                        page={page}
                        total={pages}
                        onChange={(page) => setPage(page)}
                    />
                </div>}
                classNames={{
                    wrapper: "min-h-[222px]",
                }}
            >
                <TableHeader columns={columns}>
                    {(column) => (<TableColumn
                        key={column.uid}
                        align={"center"}
                    >
                        {column.name}
                    </TableColumn>)}
                </TableHeader>
                <TableBody
                    items={selectedStudents ? selectedStudents : []}
                    emptyContent={"No Students Found"}
                    loadingState={isLoading ? "loading" : "idle"}
                    loadingContent={<Spinner/>}
                >
                    {(item) => (<TableRow key={item.code}>
                        {(columnKey) => (<TableCell>{renderCell(item, columnKey)}</TableCell>)}
                    </TableRow>)}
                </TableBody>
            </Table>
        </div>
        <div className="laptop:grid laptop:grid-cols-1 laptop:col-span-3">
            <Select color={"secondary"} variant="underlined" aria-label="gi"
                    selectedKeys={[vocStatus]}
                    onChange={(e)=> handleVocStatusChange(e)}>
                {vocStatusOptions.map((item) => (<SelectItem key={item.value} value={item.value}>
                    {item.label}
                </SelectItem>))}
            </Select>
            <Select color={"secondary"} variant="underlined" aria-label="gi"
                    selectedKeys={[homeworkStatus]}
                    onChange={(e) => setHomeworkStatus(e.target.value)}>
                {homeworkStatusOptions.map((item) => (<SelectItem key={item.value} value={item.value}>
                    {item.label}
                </SelectItem>))}
            </Select>
            <Input type="date" color="primary" variant="underlined" value={selectedDate}
                   onChange={(e) => setSelectedDate(e.target.value)}/>
            <Select color={"secondary"} variant="underlined" aria-label="gi"
                    onChange={(e) => setSelectedClass(e.target.value)}
                    defaultSelectedKeys={[`${classesOptions[0].value}`]}>
                {classesOptions.map((item) => (<SelectItem key={item.value} value={item.value}>
                    {item.label}
                </SelectItem>))}
            </Select>
            <Select color={"secondary"} variant="underlined"
                    defaultSelectedKeys={[selectedGroups]}
                    aria-label="gi"
                    onChange={(e) => setSelectedGroups(e.target.value)}
            >
                {groups && groups.map((item) => (<SelectItem key={item.value} value={item.value}>
                    {item.label}
                </SelectItem>))}
            </Select>
        </div>
    </div>)
}

export default VocHomeworkReport;