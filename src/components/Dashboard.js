import UsersCalendar from "./UsersCalendar";
import {useParams } from 'react-router-dom'


function Dashboard(){

  const {userId}  = useParams()

  return (
    <>
    <h1>Dashboard</h1>
    <UsersCalendar userId={userId} />

    </>
  )
}

export default Dashboard;

