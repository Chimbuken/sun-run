import {useState, useEffect} from 'react'
import firebase from '../firebase';
import {useParams, Routes, Route, Link} from 'react-router-dom'
import DeleteRun from './DeleteRun';

// nobody work on this please. wait till im finished functionality.

function UpcomingRuns() {
    const [userInfo, setUserInfo]=useState({}) // adding this because i need it keep it- 😈sara
    // useState declarations
    const [userRuns, setUserRuns] = useState([]) // initial runs state, has both incomplete and complete 🧢 dallan 
    const [incompleteRuns, setIncompleteRuns] = useState([]) // only holds runs that are incomplete 🧢 dallan 
    const [completedRuns, setCompletedRuns] = useState([]) // only holds runs that are complete 🧢 dallan 
    // run modal states
    const [modal, setModal] = useState(false);
    const [runId, setRunId] = useState('');
    const [runKey, setRunKey] = useState('');
    const [runObj, setRunObj] = useState([]);
    const [note, setNote] = useState('');

    // get userId from url and store in userId
    const user = useParams()

    // console.log userId to check, delete this later
    // console.log(incompleteRuns)

    useEffect( () => {
        // make database connection using our userId
        const dbRef = firebase.database().ref(`/sample/${user.userId}`);
        // fetch user data stored in database
        dbRef.on('value', (response) => {
        
            // store user data in data variable
            const data = response.val();
            console.log('data: ', data)

            // check if data is fetched
            // console.log(data.runs)

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
                //  by 🧢 dallan 
                // Object.entries(data.runs).map(([key, value]) => {
    
                    // if run is completed (true) we push to incompleteRuns
                //     if(value.completed)
                //     {
                //         setCompletedRuns(completedRuns => [...completedRuns, value])
                //     }
                    // if run is incomplete (false) we push to completedRuns
                //     else
                //     {
                //         setIncompleteRuns(incompleteRuns => [...incompleteRuns, value])
                //     }
                // })
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

        console.log(runKey);
        // push note to db

        const noteObj ={
            notes:[
                note
            ]
        }
        
        dbRef.update(noteObj);
    }

    // handle note change
    const handleNoteChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        setNote({
            ...note,
            [name]: value,
            })
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
                                {/* </Link> */}
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
                        <div className="modal-overlay"></div>

                        {/* set modal card overtop of overlay */}
                        <div className="modal-card">
                            <h3>Run information</h3>
                            <p>Run id: {incompleteRuns[runKey].id}</p>
                            <p>Date: {incompleteRuns[runKey].date}</p>
                            <p>Departure time: {incompleteRuns[runKey].departureTime}</p>
                            <p>Distance: {incompleteRuns[runKey].distance}</p>
                            <p>Pace: {incompleteRuns[runKey].pace}</p>
                            <p>runDuration: {incompleteRuns[runKey].runDuration}</p>
                            <p>Sun time: {incompleteRuns[runKey].suntime}</p>
                            <p>Time of Day: {incompleteRuns[runKey].timeOfDay}</p>

                            {/* set modal card overtop of overlay */}
                            <h4>Notes</h4>
                            <form aria-label="Display income data with a remove income option" onSubmit={addNote}>
                                <textarea name="note" id="note" onChange={handleNoteChange}>post a note here</textarea>

                                <button aria-label="Add note">Add note</button>
                            </form>


                            <button onClick={() => closeModal()}>close</button>
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