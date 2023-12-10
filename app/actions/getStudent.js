import axios from "axios";

export default async function getStudent(code) {
    try {
        const res = await axios.get(`http://localhost:3000/api/students/${code}`);
        return res.data
    } catch (error) {
        console.log(error);
    }
}