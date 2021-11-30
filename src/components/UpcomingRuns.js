import {useState, useEffect} from 'react'
import firebase from '../firebase';
import {useParams} from 'react-router-dom'

import DeleteRun from './DeleteRun';
import EditRun from './EditRun';
import '../modal.css'

// nobody work on this please. wait till im finished functionality.

function UpcomingRuns() {

    // useState declarations
    const [userRuns, setUserRuns] = useState([]) // initial runs state, has both incomplete and complete
    const [incompleteRuns, setIncompleteRuns] = useState([]) // only holds runs that are incomplete
    const [completedRuns, setCompletedRuns] = useState([]) // only holds runs that are complete
    const [userInfo, setUserInfo]=useState({}) // adding this because i need it keep it- 😈sara

    // run modal states
    const [modal, setModal] = useState(false);
    const [runId, setRunId] = useState('');
    const [runKey, setRunKey] = useState('');
    const [runObj, setRunObj] = useState([]);
    const [note, setNote] = useState('');

    // get userId from url and store in userId
    const user = useParams()

    useEffect( () => {

        // make database connection using our userId
        const dbRef = firebase.database().ref(`/sample/${user.userId}`);

        // fetch user data stored in database
        dbRef.on('value', (response) => {
        
            // store user data in data variable
            const data = response.val();

            // check if data is fetched
            console.log(data.runs)

            // store all user's runs in useState
            if(data.runs){ // added by 😈sara 
                setUserRuns(data.runs)
            }
            setUserInfo(data) // added by 😈sara 
            
            // iterate through userRuns and deconstruct userRuns into separate useState arrays
            if(data.runs) {// added by 😈sara 
                //  added by 😈sara 
                let completedRunArray = []
                let incompletedRunArray = []
                data.runs.forEach(run=>{
                    if(run.completed === false){
                        incompletedRunArray.push(run)
                    }else {
                        completedRunArray.push(run)
                    }
                })
                setIncompleteRuns(incompletedRunArray)
                setCompletedRuns(completedRunArray)
            }
        })
    },[])

    // function to set and open modal
    function runModal(runId) {
        setModal(true);
        setRunId(runId);
        for(let i=0; i<incompleteRuns.length;i++) {
            console.log(incompleteRuns[i].id)

            if(incompleteRuns[i].id === runId) {
                console.log('im here')
                setRunKey(i);
            }
        }
    }
    // function to close the modal
    function closeModal() {
        setModal(false);
        setRunId('')
    }
    // function to add a note to your run
    const addNote = (event) => {
        event.preventDefault();

        // make db connection
        const dbRef = firebase.database().ref(`/sample/${user.userId}/runs/${runKey}`);
        // push note to db
        dbRef.update(note);
    }

    // handle note change
    const handleNoteChange = (event) => {

        const target = event.target;
        const value = target.value;
        const name = target.name;
    
        // set the data to note state
        setNote({
            ...note,
            [name]: value,
        })
        
    }

    // function to add a note to your run
    const markRunComplete = () => {
        // make db connection
        console.log('runKey', runKey)
        const dbRef = firebase.database().ref(`/sample/${user.userId}/runs/${runKey}`);
        // set 'completed' to be true
        const mark = {completed:true}
        
        // push mark obj to db
        dbRef.update(mark);
        console.log('runKey', runKey)

        closeModal()
    }

    return (
        <>
            <h3>Upcoming runs</h3>
            {/* list the user's upcoming runs */}
            <div>
                {
                    // using map to iterate through userRuns array
                    incompleteRuns.map((run) => {
                        return(
                            <div className="runs-panel" key={run.id}>
                                {/* <Link key={user.userId} to={`/run/${run.id}`}> */}
                                    <button className="runs-item" onClick={() => runModal(run.id)}>
                                        You have a run on {run.date} <i class="fas fa-ellipsis-h"></i>
                                    </button>

                                    {/* option to remove run (will place in dropdown menu) */}
                                    <DeleteRun run={run} userId={user.userId} userInfo={userInfo} runReRender={setIncompleteRuns}/> {/* added by 😈sara  */}
                                    <EditRun run={run} userId={user.userId} />
                            
                            </div>
                        )
                    })

                }
            </div>


            <h3>Completed runs</h3>
            {/* list the user's upcoming runs */}
            <div>
                {
                    // using map to iterate through userRuns array
                    completedRuns.map((run) => {
                        return(
                            <div key={run.id}>
                                <p>You have completed the run that was on {run.date}</p>
                                    {/* {
                                        // check if run is completed
                                        run.completed ?
                                        (
                                            <span> true</span>
                                            
                                        ) :
                                        (
                                            <span> false</span>
                                        )
                                    } */}
                            </div>

                            
                        )
                    })

                }
            </div>

            {/* modal for displaying run info and note pad */}
            {
                modal === true ? (
                    <>
                        {/* set modal overlay overtop of entire page */}
                        <div className="modal-overlay" onClick={() => closeModal()}></div>

                        {/* set modal card overtop of overlay */}
                        <div className="modal-card">

                            <div className="modal-grid modal-title">
                                <h3>Run information</h3>
                                <div className="modal-options">

                                    {/* mark run complete button */}
                                    <button aria-label="mark run complete" onClick={() => markRunComplete()}>
                                        <i class="fas fa-check-circle"></i>
                                    </button>

                                    {/* edit the run settings */}
                                    <button aria-label="edit the run settings">
                                        <i class="fas fa-edit"></i>
                                    </button>

                                    {/* delete the run */}
                                    <button aria-label="delete the run">
                                        <i class="fas fa-trash"></i>
                                    </button>

                                </div>
                            </div>

                            <div className="modal-grid modal-content">

                            {/* <p>Run id: {incompleteRuns[runKey].id}</p> */}
                            <p>Date: {incompleteRuns[runKey].date}</p>
                            <p>Departure time: {incompleteRuns[runKey].departureTime}</p>
                            <p>Distance: {incompleteRuns[runKey].distance}</p>
                            <p>Pace: {incompleteRuns[runKey].pace}</p>
                            <p>Duration: {incompleteRuns[runKey].runDuration}</p>
                            <p>Sun time: {incompleteRuns[runKey].suntime}</p>
                            <p>Time of Day: {incompleteRuns[runKey].timeOfDay}</p>

                            </div>
                            

                            {/* set modal card overtop of overlay */}
                            <h3>Run notes</h3>

                            {/* <p>Notes: {incompleteRuns[runKey].notes}</p> */}

                            {/* add sr-only label to textarea */}
                            <form className="modal-notepad-form" aria-label="Display income data with a remove income option" onSubmit={addNote}>
                                <textarea className="modal-notepad" name="note" id="note" onChange={handleNoteChange}>{incompleteRuns[runKey].note}</textarea>

                                <button aria-label="Add note" className="btn-green">Update notes</button>
                            </form>


                            <button aria-label="Close run info popup modal" className="modal-close" onClick={() => closeModal()}>
                                <i class="far fa-times-circle"></i>
                            </button>
                        </div>
                    </>
                ) : (
                    null
                )
            }

        </>
    )

}

export default UpcomingRuns