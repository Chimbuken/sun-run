import Calendar from "react-calendar";
// import 'react-calendar/dist/Calendar.css';
import { useState, useEffect } from "react";
import firebase from "firebase";
import moment from "moment";

function UsersCalendar(props) {
    const userId = props.userId
    console.log(props)
    const [runDate, setRunDate] = useState(new Date());
    const [runs, setRuns] = useState([])

    const renderingRunsArray =({ date, view })=>{
        // console.log('date: ', date)
        // console.log('view: ', view)
        // "2021-11-30"
        let className = ''

        if(runs.length>0){
            runs.forEach(run=>{
                // console.log('is it here')
                // console.log('this is from fire:',run.date)
                // console.log(moment(date).format("YYYY-MM-DD") )
                if(run.date === moment(date).format("YYYY-MM-DD") ){
                    className='runDay'
                  return 'runDay'
                }
            })

        }
        return className
    }
    
    useEffect(()=>{
        const dbRef = firebase.database().ref(`/sample/${userId}`);
        dbRef.on('value', (response) => {
            const data = response.val();
            console.log(data)
            setRuns(data.runs)

        })
    },[])
    return(
        <div>
            <Calendar
            onChange={setRunDate}
            value={runDate}
            tileClassName={renderingRunsArray}
            // tileContent ={showContent}
            />
            {/* {runs.map(run=>
                <p>{run.date}</p>
                )} */}
        </div>
    )
}
export default UsersCalendar;


//   const userId = useParams()
//   useEffect(()=>{
//     firebase.database().ref(`/sample/${userId.userId}`).on('value', (response) => {
//       const data = response.val();
//       console.log('date: ', data)
//       setUserInfo(data)
//       setFirstRun({
//         ...firstRun,
//         lat: data.coords.lat, 
//         lng: data.coords.long,
//       })
//     })
//   },[])