"use client"
import {getExams, getExamsNames, updateStudentsExam} from "@/app/actions/examsActions";
import {Select, SelectItem} from "@nextui-org/select";
import {
    Button, Checkbox, Input, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip
} from "@nextui-org/react";
import {useCallback, useEffect, useState} from "react";
import {displayToast} from "@/app/ui/displayToast";
import {useRouter} from "next/navigation";

export default function EditExamForm({classesOptions, groupsOptions}) {
    const [selectedClass, setSelectedClass] = useState("")
    const [selectedGroup, setSelectedGroup] = useState("")
    const [selectedExamName, setSelectedExamName] = useState("")
    const [examDate, setExamDate] = useState("")
    const [loading, setLoading] = useState(false)
    const [nameLoading, setNameLoading] = useState(false)
    const [examsNames, setExamsNames] = useState([])
    const [examData, setExamData] = useState([])
    const [done, setDone] = useState(false)
    const groups = groupsOptions && groupsOptions.filter((item) => item.class_id === selectedClass);
    const router = useRouter();

    useEffect(() => {
        if (selectedClass && selectedGroup && examDate && selectedExamName) {
            setDone(true)
        }
    }, [selectedClass, selectedGroup, examDate, selectedExamName])

    const fetchStudents = async () => {
        try {
            setLoading(true)
            const {exams} = await getExams(selectedGroup, examDate, selectedExamName)
            const initialExamData = exams.map((student) => {
                return {
                    student_id: student.student_id._id,
                    id: student._id,
                    grade: student.grade === -1 ? "" : student.grade,
                    name: student.student_id.name,
                    code: student.student_id.code,
                    isAbsent: student.grade === -1
                }
            })
            setExamData(initialExamData)
            setLoading(false)
        } catch (e) {
            console.log(e)
        }
    }

    const fetchExamsNames = async () => {
        try {
            setNameLoading(true)
            const {examsNames} = await getExamsNames(selectedGroup)
            setExamsNames(examsNames)
            setNameLoading(false)
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        if (selectedGroup) {
            fetchExamsNames()
        }
    }, [selectedGroup]);

    useEffect(() => {
        if (selectedGroup && examDate && selectedExamName) {
            fetchStudents()
        }
    }, [selectedGroup, examDate, selectedExamName])

    const handleGradesChange = (id, grade) => {
        setExamData(prevState => prevState.map(student => student.student_id === id ? {
            ...student, grade: student.isAbsent ? "" : (grade === "" ? "" : parseInt(grade, 10)), isAbsent: grade === ""
        } : student));
    };

    const handleCheckboxChange = (id, checked) => {
        setExamData(prevState => prevState.map(student => student.student_id === id ? {
            ...student, isAbsent: checked, grade: checked ? "" : student.grade
        } : student));
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        const data = {
            date: examDate,
            examData
        }
        const res = await updateStudentsExam(data)
        if (res){
            displayToast({message: 'Exam Updated Successfully', type: 'success'});
            router.push("/dashboard/exams")
        } else {
            displayToast({message: 'Something went wrong', type: 'error'});
        }
    }

    return (<form
        onSubmit={handleSubmit}
    >
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
            <Select
                label='Exam Name'
                name='exam_name'
                placeholder='Select Exam Name'
                value={selectedExamName}
                onChange={(e) => setSelectedExamName(e.target.value)}
                isRequired
                items={examsNames}
                isLoading={nameLoading}
            >
                {item => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>}
            </Select>
            <Input type="date" label="Exam Date" name="exam_date" placeholder="Exam Date"
                   value={examDate} onChange={(e) => setExamDate(e.target.value)} isRequired/>
        </div>
        {done && <div className="mt-3">
            <Table
                color={"primary"}
                aria-label="Students Table"
            >
                <TableHeader>
                    <TableColumn align="center">Code</TableColumn>
                    <TableColumn align="center">Name</TableColumn>
                    <TableColumn align="center">Grade</TableColumn>
                    <TableColumn align="center">Absent</TableColumn>
                </TableHeader>
                <TableBody
                    emptyContent={"No Students Found"}
                    loadingState={loading ? "loading" : "idle"}
                    loadingContent={<Spinner/>}
                >
                    {examDate && examData.map((student) => (<TableRow key={student.student_id}>
                        <TableCell align="center">{student.code}</TableCell>
                        <TableCell align="center">{student.name}</TableCell>
                        <TableCell align="center">
                            <Input
                                type="number"
                                name="grade"
                                placeholder="Grade"
                                value={student.grade}
                                onChange={(e) => handleGradesChange(student.student_id, e.target.value)}
                            />
                        </TableCell>
                        <TableCell align="center">
                            <Checkbox
                                isSelected={student.isAbsent}
                                color={"danger"}
                                onChange={(e) => handleCheckboxChange(student.student_id, e.target.checked)}
                            />
                        </TableCell>
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
                            isDisabled={loading}
                    >
                        Save Exam
                    </Button>
                </Tooltip>
            </div>
        </div>}
    </form>)
}