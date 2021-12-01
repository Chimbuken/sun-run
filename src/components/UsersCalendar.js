import Calendar from "react-calendar";
// import 'react-calendar/dist/Calendar.css';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import firebase from "firebase";
import moment from "moment";
import '../usersCalendar.css'

function UsersCalendar(props) {
    const userId = props.userId
    let navigate = useNavigate();
    const [runDate, setRunDate] = useState(new Date());
    const [runs, setRuns] = useState([])

    const renderingRunsArray =({ date, view })=>{

        // "2021-11-30"
        let className = ''
        if(runs){

            if(runs.length>0){
                runs.forEach(run=>{
                    if(run.completed ===false){
                        if(run.date === moment(date).format("YYYY-MM-DD") ){
                            className='runDay'
                        }
                    }
                    if(run.completed ===true){
                        if(run.date === moment(date).format("YYYY-MM-DD") ){
                            className='runDone'
                        }
                    }
                })
            }
            return className
        }
    }
    const addRun =(e)=>{
        e.preventDefault()
        console.log(
            'add new run'
        )
        navigate(`/setup/${userId}`)
    }
    
    useEffect(()=>{
        const dbRef = firebase.database().ref(`/sample/${userId}`);
        dbRef.on('value', (response) => {
            const data = response.val();
            setRuns(data.runs)
        })
    },[])
    return(
        <div className="calendar-container flex-column">

            <div className="add-run">
                <button onClick={addRun} className="btn-green"><i className="fas fa-plus"></i> Add Run</button>
            </div>
            <Calendar
            onChange={setRunDate}
            value={runDate}
            tileClassName={renderingRunsArray}
            />
        </div>
    )
}
export default UsersCalendar;