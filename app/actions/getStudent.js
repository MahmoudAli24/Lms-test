import axios from "axios";

export default async function getStudent(code) {
    try {
        const res = await axios.get(`https://huhu-test.vercel.app/api/students/${code}`);
        return res.data
    } catch (error) {
        console.log(error);
    }
}