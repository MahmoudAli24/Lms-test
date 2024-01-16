"use client";
import {Select, SelectItem} from "@nextui-org/select";
import {useCallback, useEffect, useState} from "react";
import {
    Autocomplete, AutocompleteItem,
    Button,
    Input, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip
} from "@nextui-org/react";
import {format} from "date-fns";
import {getStudents} from "@/app/actions/studentsActions";
import {displayToast} from "@/app/ui/displayToast";
import {addStudentsExam, getExamsNames} from "@/app/actions/examsActions";
import {isSameDay} from "@/app/functions/isSameDay";
import {useFilter} from "@react-aria/i18n";
import {useRouter} from "next/navigation";

const fields = "name,id,code,exams"

function AddExamForm({groupsOptions, classesOptions}) {
    const [selectedClass, setSelectedClass] = useState("");
    const [selectedGroup, setSelectedGroup] = useState("");
    const [examDate, setExamDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [done, setDone] = useState(false);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [examsNames, setExamsNames] = useState([]);
    const [examData, setExamData] = useState([]);
    const [fieldState, setFieldState] = useState({
        selectedKey: "",
        inputValue: "",
        items: examsNames,
    });
    const router = useRouter();
    const groups = groupsOptions && groupsOptions.filter((item) => item.class_id === selectedClass);

    const columns = [{name: "NAME", uid: "name"}, {name: "CODE", uid: "code"}, {name: "GRADES", uid: "grades"},];

    useEffect(() => {
        if (selectedClass && selectedGroup && examDate &&  fieldState) {
            setDone(true);
        }
    }, [selectedClass, selectedGroup, fieldState, examDate]);

    const fetchStudentsData = async () => {
        try {
            setLoading(true);
            const {students} = await getStudents(fields, selectedGroup)
            const filteredStudents =students ? students.filter((student) => {
                const hasAttendanceForSelectedDate = student.exams.some((entry) =>
                    isSameDay(new Date(entry.date), new Date(examDate))
                );
                return !hasAttendanceForSelectedDate;
            }):[];
            const initialExamData = filteredStudents.map((student) => {
                return {student_id: student._id, grade: -1}
            })
            const {examsNames} = await getExamsNames(selectedGroup)
            setExamsNames(examsNames)
            setSelectedStudents(filteredStudents);
            setExamData(initialExamData)
            setLoading(false);
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        if (selectedGroup) {
            fetchStudentsData();
        }
    }, [selectedGroup , examDate]);

    const handleGradesChange = (id, grade) => {
        setExamData((prev) =>
            prev.map((data) =>
                data.student_id === id
                    ? {
                        ...data,
                        grade: parseInt(grade)
                    }
                    : data
            )
        )
    };

    const renderCell = useCallback((item, columnKey) => {
        const cellValue = selectedStudents[columnKey];
        if (columnKey === "grades") {
            return (<span>
                <Input type="number" name="grade"
                       size={"sm"}

                       onChange={(e) => handleGradesChange(item._id, e.target.value)}
                       placeholder="Enter Grade"/>
            </span>)
        } else if (columnKey === "name") {
            return <span>{item.name}</span>;
        } else if (columnKey === "code") {
            return <span>{item.code}</span>;
        } else {
            return cellValue;
        }
    }, [selectedStudents]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            group_id: selectedGroup,
            date: examDate,
            examName : fieldState.inputValue,
            examData
        }
        const req = await addStudentsExam(data)
        console.log("req", req)
        if (req) {
            displayToast({type: "success", message: "Exam Added Successfully"})
            setSelectedClass("");
            setSelectedGroup("");
            setExamDate(format(new Date(), 'yyyy-MM-dd'));
            setExamData([]);
            setSelectedStudents([]);
            router.push("/dashboard/exams")
            setDone(false);
        } else {
            displayToast({type: "error", message: "Something Went Wrong"})
        }
    }
    const {startsWith} = useFilter({sensitivity: "base"});
    const onSelectionChange = (key) => {
        setFieldState((prevState) => {
            let selectedItem = prevState.items.find((option) => option.value === key);

            return {
                inputValue: selectedItem?.label || "",
                selectedKey: key,
                items: examsNames.filter((item) => startsWith(item.label, selectedItem?.label || "")),
            };
        });
    };
    const onInputChange = (value) => {
        setFieldState((prevState) => ({
            inputValue: value,
            selectedKey: value === "" ? null : prevState.selectedKey,
            items: examsNames.filter((item) => startsWith(item.label, value)),
        }));
    };
    const onOpenChange = (isOpen, menuTrigger) => {
        if (menuTrigger === "manual" && isOpen) {
            setFieldState((prevState) => ({
                inputValue: prevState.inputValue,
                selectedKey: prevState.selectedKey,
                items: examsNames,
            }));
        }
    };
    return (<div>
        <form onSubmit={handleSubmit}>
            <div className="grid laptop:grid-cols-4 laptop:gap-3 tablet:grid-cols-2 gap-2 mobile:grid-cols-1">
                <Select
                    label='Class'
                    name='class_id'
                    placeholder='Select Class'
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    isRequired
                >
                    {classesOptions.map((option) => (<SelectItem key={option.value} value={option.value}>
                        {option.label}
                    </SelectItem>))}
                </Select>
                <Select
                    label='Group'
                    name='group_id'
                    placeholder='Select Group'
                    value={selectedGroup}
                    onChange={(e) => setSelectedGroup(e.target.value)}
                    isRequired
                >
                    {groups.map((option) => (<SelectItem key={option.value} value={option.value}>
                        {option.label}
                    </SelectItem>))}
                </Select>
                {/*<Input type="text" label="Exam Name" name="exam_name" placeholder="Exam Name" value={examName}*/}
                {/*       onChange={(e) => setExamName(e.target.value)} isRequired/>*/}
                <Autocomplete
                    label="Exam Name"
                    isRequired
                    allowsCustomValue={true}
                    placeholder="Select Exam Name"
                    className="max-w-xs"
                    inputValue={fieldState.inputValue}
                    items={fieldState.items}
                    selectedKey={fieldState.selectedKey}
                    onInputChange={onInputChange}
                    onOpenChange={onOpenChange}
                    onSelectionChange={onSelectionChange}
                    onKeyDown={(e) => e.continuePropagation()}
                    allowsEmptyCollection={true}
                    isLoading={loading}
                >
                    {(item) => <AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>}
                </Autocomplete>
                <Input type="date" label="Exam Date" name="exam_date" placeholder="Exam Date"
                       value={examDate} onChange={(e) => setExamDate(e.target.value)} isRequired/>
            </div>
            {done && <div className="mt-3">
                <Table
                    color={"primary"}
                    aria-label="Students Table"
                >
                    <TableHeader columns={columns}>
                        {(column) => (<TableColumn
                            key={column.uid}
                            align={column.uid === "grades" ? "right" : column.uid === "id" ? "left" : "center"}
                        >
                            {column.name}
                        </TableColumn>)}
                    </TableHeader>
                    <TableBody
                        emptyContent={"No Students Found"}
                        loadingState={loading ? "loading" : "idle"}
                        loadingContent={<Spinner/>}
                    >
                        {selectedStudents && selectedStudents.map((item) => (<TableRow key={item._id}>
                            {(columnKey) => (<TableCell>{renderCell(item, columnKey)}</TableCell>)}
                        </TableRow>))}
                    </TableBody>
                </Table>
                <div className="mt-3">
                    <Tooltip text="Save Exam">
                        <Button type="submit"
                                color={"primary"}
                                auto
                                shadow
                                variant={"shadow"}
                                isDisabled={loading || !selectedStudents.length}
                        >
                            Save Exam
                        </Button>
                    </Tooltip>
                </div>
            </div>}
        </form>
    </div>)
}

export default AddExamForm;