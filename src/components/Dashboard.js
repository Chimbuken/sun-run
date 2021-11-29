import {useParams } from 'react-router-dom';
import UsersCalendar from "./UsersCalendar";
import UpcomingRuns from './UpcomingRuns.js';



function Dashboard(){

  const {userId}  = useParams()

  return (
    <>
      <h1>Dashboard</h1>
      <UpcomingRuns/>
      <UsersCalendar userId={userId} />
    </>
  )
}

export default Dashboard;

