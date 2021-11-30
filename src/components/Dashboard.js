import {useParams } from 'react-router-dom';
import UsersCalendar from "./UsersCalendar";
import UpcomingRuns from './UpcomingRuns.js';
import '../usersCalendar.css'



function Dashboard(){

  const {userId}  = useParams()

  return (
    <>
      <h1>Dashboard</h1>
      <div className="flex dashboard">
        <UpcomingRuns/>
        <UsersCalendar userId={userId} />
      </div>
    </>
  )
}

export default Dashboard;

