import {useState, useEffect} from 'react'
import firebase from '../firebase';
import {useParams , useNavigate} from 'react-router-dom'


// import components
import MarkComplete from './MarkComplete';
import DeleteRun from './DeleteRun';

//import css

import '../modal.css'
import Modal from './Modal';


function UpcomingRuns() {
    let navigate = useNavigate();
    // useState declarations
    const [userRuns, setUserRuns] = useState([]) // initial runs state, has both incomplete and complete
    const [userInfo, setUserInfo]=useState({}) // adding this because i need it keep it- 😈sara
    // run modal states
    const [modal, setModal] = useState(false);
    // const [runId, setRunId] = useState('');
    const [runKey, setRunKey] = useState('');

    const [runObjForModal, setRunObjForModal]=useState({})


    // get userId from url and store in userId
    const user = useParams()
    const getusersRuns = ()=>{

    }

    useEffect( () => {

        // make database connection using our userId
        const dbRef = firebase.database().ref(`/sample/${user.userId}`);

        // fetch user data stored in database
        dbRef.on('value', (response) => {
        
            // store user data in data variable
            const data = response.val();

            // store all user's runs in useState
            if(data.runs){ // added by 😈sara 
                setUserRuns(data.runs)
            }
            setUserInfo(data) // added by 😈sara 
        })
    },[])
    // function to set and open modal
    function runModal(runId) {
        setModal(true);
        // setRunId(runId);
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
    const editRun =(runObj)=>{
        console.log(runObj)
        navigate(`/editRun/${user.userId}/${runObj.id}`);
    }
    return (
        <>
        <div className="flex-container">
            <h3>Upcoming runs</h3>
            {/* list the user's upcoming runs */}
            <div>
                {
                    // using map to iterate through userRuns array
                    userRuns.map((run) => {
                        if(run.completed===false) {
                            return(
                                <div className="runs-panel" key={run.id}>
                                        <button className="runs-item" onClick={() => runModal(run.id)}>
                                            You have a run on {run.date} <i class="fas fa-ellipsis-h"></i>
                                        </button>
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
                    <Modal 
                    runKey={runKey} 
                    user={user}
                    editRun={editRun}
                    runObjForModal={runObjForModal}
                    setRunKey={setRunKey}
                    userInfo={userInfo}
                    setUserRuns={setUserRuns}
                    setModal={setModal}
                    />
                ) : (
                    null
                )
            }

        </>
    )
}

export default UpcomingRuns