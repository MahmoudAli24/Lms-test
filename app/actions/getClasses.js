"use server"
import axios from "axios";

export default async function getClasses() {
  try {
    return  await fetch(`${process.env.NEXT_PUBLIC_URL}/api/classes`,{cache:"no-store"}).then(res => res.json())
  } catch (error) {
    console.log(error);
  }
}
