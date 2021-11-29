// view components
import UpcomingRuns from './UpcomingRuns.js';

function Dashboard(){

  return (
    <>
      <h1>Dashboard</h1>
      <UpcomingRuns/>
    </>
  )
}

// upcomingRuns

/*
upcomingRuns component

- pull runs from database
- list each run that has not been completed, or is still upcoming

- each run listed will have a ... eclipses option will display a dropdown
- the dropdown will have an option to edit or delete or complete
- you can also click the run itself and it will display a modal

- the modal will consist of run details and a note app
- the note app will allow the user to post to database

*/

export default Dashboard;