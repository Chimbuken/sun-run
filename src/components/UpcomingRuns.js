import {useState, useEffect} from 'react'
import firebase from '../firebase';
import {useParams} from 'react-router-dom'

function UpcomingRuns() {

    // useState declarations
    const [userRuns, setUserRuns] = useState([]) // initial runs state, has both incomplete and complete
    const [incompleteRuns, setIncompleteRuns] = useState([]) // only holds runs that are incomplete
    const [completedRuns, setCompletedRuns] = useState([]) // only holds runs that are complete

    // get userId from url and store in userId
    const user = useParams()

    // console.log userId to check, delete this later
    console.log(user)

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
            setUserRuns(data.runs)
            
            // iterate through userRuns and deconstruct userRuns into separate useState arrays
            Object.entries(data.runs).map(([key, value]) => {

                // if run is completed (true) we push to incompleteRuns
                if(value.completed)
                {
                    setCompletedRuns(completedRuns => [...completedRuns, value])
                }
                // if run is incomplete (false) we push to completedRuns
                else
                {
                    setIncompleteRuns(incompleteRuns => [...incompleteRuns, value])
                }

            })

        })
    },[])

    


    return (
        <>
            <h3>UpcomingRuns</h3>

            {/* list the user's upcoming runs */}
            <ul>
                {
                    // using map to iterate through userRuns array
                    incompleteRuns.map((run) => {
                        return(
                            <li key={run.id}>
                                <p>Date: {run.date}</p>
                                <p>Completed:
                                    {
                                        // check if run is completed
                                        run.completed ?
                                        (
                                            <span> true</span>
                                            
                                        ) :
                                        (
                                            <span> false</span>
                                        )
                                    }
                                </p>
                            </li>
                        )
                    })

                }
            </ul>
        </>
    )

}

export default UpcomingRuns