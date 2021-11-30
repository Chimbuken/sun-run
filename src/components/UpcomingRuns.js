import {useState, useEffect} from 'react'
import firebase from '../firebase';
import {useParams , useNavigate} from 'react-router-dom'
import raw from '../includes/list.txt'; // profanity list! >:)

// import components
import MarkComplete from './MarkComplete';
import DeleteRun from './DeleteRun';
import EditRun from './EditRun';

//import css
import '../modal.css'


function UpcomingRuns() {
    let navigate = useNavigate();


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

    const [runObjForModal, setRunObjForModal]=useState({})

    // note validity check
    const [isNoteValid, setIsNoteValid] = useState(0); // added by dallan
    const [didNoteUpdate, setDidNoteUpdate] = useState(0);

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
        userRuns.forEach((run, idx)=>{
            if(run.id === runId){
                console.log('runObj', run)
                console.log('run id', idx)
                setRunObjForModal(run)
            }
        })
        for(let i=0; i<userRuns.length;i++) {
            console.log(userRuns[i].id)

            if(userRuns[i].id === runId) {
                console.log('im here')
                setRunKey(i);
            }
        }
    }
    // function to close the modal
    function closeModal() {
        setModal(false);
        setRunId('')

        // reset note validation messages
        setIsNoteValid(0)
        setDidNoteUpdate(0)
    }

    // function to add a note to your run
    const addNote = (event) => { // by dallan
        event.preventDefault();

        // fetch the imported profanity list >:) by dallan
        fetch(raw)
        .then(r => r.text())
        .then(text => {
      
            // create an items array which adds each word by new line
            const keywords = text.split("\n");
        
            // remove empty word at bottom of array
            keywords.splice(452, 1);

            // regex for finding specific substring
            const regex = new RegExp('\\b('+keywords.join('|')+')\\b','i');
            
            // function finds if a string contains a value, not case sensitive, from array of words
            function anyValueMatches( o, r ) {
                // if a word matches any keyword return true
                for( const k in o ) if( r.test(o[k]) ) return true;

                // if no keyword is found return false
                return false;
            }

            let noteString = note.note;
            
            if(noteString === undefined) {
                noteString = '';
            }
            let errorCheck = 'false';
            // set isNoteValid to 1 if note contains profanity
            if(anyValueMatches(note,regex)) { 
                setIsNoteValid(1);
                setDidNoteUpdate(0);

                setTimeout(function(){
                    setIsNoteValid(0);
                }, 7000);

                console.log('noteisvalid: ', isNoteValid)
                errorCheck = 'true';
            }

            // set isNoteValid to 2 if note has more than 250 characters
            if(noteString.length > 250) {
                setIsNoteValid(2);
                setDidNoteUpdate(0);

                setTimeout(function(){
                    setIsNoteValid(0);
                }, 9000);

                console.log('noteisvalid: ', isNoteValid)
                errorCheck = 'true';
            }

            // if isNoteValid === 0 then add note to database
            if(errorCheck === 'false') {
                // make db connection
                const dbRef = firebase.database().ref(`/sample/${user.userId}/runs/${runKey}`);

                // push note to db
                if(dbRef.update(note)) {
                    setDidNoteUpdate(1);
                    setIsNoteValid(0);

                    setTimeout(function(){
                        setDidNoteUpdate(0)
                    }, 9000);
                }
            }

        })
  
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
        const dbRef = firebase.database().ref(`/sample/${user.userId}/runs/${runKey}`);

        // set 'completed' to be true
        const mark = {completed:true}
        
        // push mark obj to db
        dbRef.update(mark);

        // close the modal
        closeModal()

    }

    const editRun =(runObj)=>{
        console.log(runObj)
        navigate(`/setup/${user.userId}/${runObj.id}`);

    }

    return (
        <>

            <h3>Upcoming runs</h3>
            <div className="flex-container">            
            {/* list the user's upcoming runs */}
            <div>
                {
                    // using map to iterate through userRuns array
                    userRuns.map((run) => {
                        if(run.completed===false) {
                            return(
                                <div className="runs-panel" key={run.id}>
                                    {/* <Link key={user.userId} to={`/run/${run.id}`}> */}
                                        <button className="runs-item" onClick={() => runModal(run.id)}>
                                            You have a run on {run.date} <i class="fas fa-ellipsis-h"></i>
                                        </button>
                                        {/* option to remove run (will place in dropdown menu) */}
                                        {/* <DeleteRun run={run} userId={user.userId} userInfo={userInfo} runReRender={setIncompleteRuns}/> */}
                                        {/* added by 😈sara  */}
                                </div>
                            )
                        }
                    })

                }
            </div>


            <h3>Completed runs</h3>
            {/* list the user's upcoming runs */}
            <div>
                {
                    // using map to iterate through userRuns array
                    userRuns.map((run) => {
                        if(run.completed === true) {
                            return(
                                <div key={run.id}>
                                    <p>You have completed the run that was on {run.date}</p>
                                </div> 
                            )
                        }
                    })

                }
            </div>
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
                                    <MarkComplete 
                                        runKey={runKey} 
                                        userId={user.userId} 
                                        closeModal={closeModal}
                                    />

                                    {/* edit the run settings */}
                                    <button aria-label="edit the run settings" onClick={()=>editRun(runObjForModal)}>
                                        <i class="fas fa-edit"></i>
                                    </button>

                                    {/* delete the run */}
                                    <DeleteRun run={runObjForModal} setRunKey={setRunKey} userId={user.userId} userInfo={userInfo} runReRender={setIncompleteRuns} closeModal={closeModal}/> {/* added by 😈sara  */}
                                </div>
                            </div>

                            <div className="modal-grid modal-content">

                                {/* <p>Run id: {incompleteRuns[runKey].id}</p> */}
                                {/* <p>Date: {incompleteRuns[runKey].date}</p>
                                <p>Departure time: {incompleteRuns[runKey].departureTime}</p>
                                <p>Distance: {incompleteRuns[runKey].distance}</p>
                                <p>Pace: {incompleteRuns[runKey].pace}</p>
                                <p>Duration: {incompleteRuns[runKey].runDuration}</p>
                                <p>Sun time: {incompleteRuns[runKey].suntime}</p>
                                <p>Time of Day: {incompleteRuns[runKey].timeOfDay}</p> */}


                                {/* sara  😈 sara */}
                                <p>Date: {runObjForModal.date}</p>
                                <p>Departure time: {runObjForModal.departureTime}</p>
                                <p>Distance: {runObjForModal.distance}</p>
                                <p>Pace: {runObjForModal.pace}</p>
                                <p>Duration: {runObjForModal.runDuration}</p>
                                <p>Sun time: {runObjForModal.suntime}</p>
                                <p>Time of Day: {runObjForModal.timeOfDay}</p>
                            </div>
                            

                            {/* set modal card overtop of overlay */}
                            <h3>Run notes</h3>

                            {/* <p>Notes: {incompleteRuns[runKey].notes}</p> */}

                            {/* add sr-only label to textarea */}
                            <form className="modal-notepad-form" aria-label="Display income data with a remove income option" onSubmit={addNote}>
                                
                                {didNoteUpdate === 1 && <div className="modal-msg modal-success">Success! You've updated your notes.</div> }
                                {isNoteValid === 1 && <div className="modal-msg modal-error">Watch the language there chief.</div> }
                                {isNoteValid === 2 && <div className="modal-msg modal-error">The note cannot be more than 250 characters long! </div> }
                                
                                {/* <textarea className="modal-notepad" name="note" id="note" onChange={handleNoteChange}>{incompleteRuns[runKey].note}</textarea> */}
                                <textarea className="modal-notepad" name="note" id="note" onChange={handleNoteChange}>{runObjForModal.note}</textarea>

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