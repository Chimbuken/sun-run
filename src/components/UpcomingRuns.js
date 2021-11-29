import {useState, useEffect} from 'react'
import firebase from '../firebase';
import {useParams} from 'react-router-dom'

function UpcomingRuns() {

    // useState declarations
    const [userRuns, setUserRuns] = useState([])

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
            console.log(data)

            // store all user's runs in useState
            setUserRuns(data.runs)

            
        })
    },[])

    console.log(userRuns)

    return (
        <>
            <h3>UpcomingRuns</h3>

            {/* list the user's upcoming runs */}
            <ul>
                {
                    // using map to iterate through userRuns array
                    userRuns.map((run) => {
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
                    
                    /*

                     we need to filter userRuns and store into a new array if completed is set to false
                    
                     */

                }
            </ul>
        </>
    )

}

export default UpcomingRuns