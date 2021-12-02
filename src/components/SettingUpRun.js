import React, {useState, useEffect} from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import moment from 'moment'
import firebase from '../firebase';
import runType from '../functions/runType';
import {convertH2M, convertM2H} from '../functions/runType.js'
import { v4 as uuidv4 } from 'uuid';

function SettingUpRun() {
    let navigate = useNavigate();
    const {selectedDate} = useParams()

    const {userId} = useParams()
    console.log('selected date: ', selectedDate)
    if(!selectedDate){
        console.log('selected date: what? ', selectedDate)
    }
      // handleChange targets User's choice of Pace and Distance
    const today = new Date();
    const [showResult, setShowResult]=useState(false)
    const [showForm, setShowForm] =useState(true)
    const [user, setUser]=useState({})
    const [firstRun, setFirstRun] = useState({
    pace :'Pace',
    distance: 'Distance',
    // date: moment(today).format('YYYY-MM-DD'), //be default the value will be the current date
    date: !selectedDate ? moment(today).format('YYYY-MM-DD') : selectedDate, //be default the value will be the current date
    timeOfDay:'Sunrise or Sunset'
    })
    // react-calendar__tile react-calendar__month-view__days__day react-calendar__month-view__days__day--neighboringMonth 
    const [runResults, setRunResults]= useState({})

    const handleChange = (e)=>{
        const {id, value} = e.target;
        setFirstRun({...firstRun, [id]:value})
    }
    const getSunTime =(e)=>{
        e.preventDefault()
        console.log(firstRun)
        // getting the total run time for the selected distance
        const totalTime = runType(firstRun)
        console.log(`TotalTime to ${firstRun.pace} a ${firstRun.distance} is ${totalTime} mins`, )
        axios({
            url: `https://api.sunrise-sunset.org/json?lat=${firstRun.lat}=${firstRun.long}=${firstRun.date}`,
            method: "GET",
            dataResponse: "json",
        }).then((response) => {
            const sunrise = response.data.results.sunrise;
            const sunset = response.data.results.sunset;
            console.log('direct from api: ', sunrise)
            console.log('direct from api: ', sunset)
            let startTime;
            if( firstRun.timeOfDay === "sunrise" ){
                const sunriseInMinute = convertH2M(sunrise);
                const startingTime = sunriseInMinute - totalTime/2
                startTime=convertM2H(startingTime, "sunrise")
            }else {
                const sunsetInMinute = convertH2M(sunset);
                const startingTime = sunsetInMinute - totalTime/2
                startTime=convertM2H(startingTime, "sunset")
            }
            console.log(`${firstRun.timeOfDay} is at ${firstRun.timeOfDay==="sunrise" ? sunrise : sunset } so you should start your ${firstRun.pace} by ${startTime} to cover ${firstRun.distance}`);
            setRunResults({
                ...firstRun,
                sunTime: firstRun.timeOfDay === "sunrise"? sunrise : sunset,
                departureTime: startTime,
                runDuration: totalTime            
            })
            setShowResult(true)
            setShowForm(false)
        })
    }
    const confirmRun = async()=>{
        const runId = uuidv4();

        console.log(runResults)
        if(user.runs){
            const newRun ={
                id: runId,
                pace: runResults.pace,
                distance: runResults.distance,
                timeOfDay: runResults.timeOfDay,
                date: runResults.date,
                departureTime: runResults.departureTime,
                runDuration: runResults.runDuration,
                suntime: runResults.sunTime,
                completed: false
            }
            let usersCurrenRunArray = [...user.runs]
            usersCurrenRunArray.push(newRun)
            const updateUsersRun={
                runs: usersCurrenRunArray
            }
            await firebase.database().ref(`/sample/${userId}`).update(updateUsersRun);
            navigate(`/dashboard/${userId}`);
            
        }else {
            const runObj ={
                runs:[
                    {
                        id: runId,
                        pace: runResults.pace,
                        distance: runResults.distance,
                        timeOfDay: runResults.timeOfDay,
                        date: runResults.date,
                        departureTime: runResults.departureTime,
                        runDuration: runResults.runDuration,
                        suntime: runResults.sunTime,
                        completed: false
                    }
                ]
            }
            await firebase.database().ref(`/sample/${userId}`).update(runObj);
            navigate(`/dashboard/${userId}`);
        }
    }
    useEffect(() => {
        firebase.database().ref(`/sample/${userId}`).on('value', (response) => {
    const data = response.val();
    console.log('data: ', data)
    setUser({...data})
    setFirstRun({...firstRun, lat: data.coords.lat, long: data.coords.long})
    })
    // eslint-disable-next-line
    }, [])

    return (
        <main className="card-full">
            <section className="runSetupPage signup-form wrapper">
                {
                    showForm? 
                    <> 
                        {user.runs?
                            <h1>Add New Run</h1> : <h1>Let's setup your first run!</h1>
                        }

                        <form action="" className="flex-column" onSubmit={getSunTime}>
                            
                                <label htmlFor="pace" className="sr-only">Pace</label>
                                <select name="pace" id="pace" value={firstRun.pace} onChange={handleChange}> 
                                    <option value="Pace" disabled selected hidden>Pace</option>
                                    <option value="Jog">Jog (8km/hr)</option>
                                    <option value="Run">Run (16km/h)</option>
                                </select>
                            
                                <label htmlFor="distance" className="sr-only">Distance</label>
                                <select name="distance" id="distance" value={firstRun.distance} onChange={handleChange} required>
                                    <option value="Distance" disabled selected hidden>Distance</option>
                                    <option value="5km">5km</option>
                                    <option value="10km">10km</option>
                                    <option value="Half Marathon">Half Marathon</option>
                                    <option value="Marathon">Marathon</option>
                                </select>
                            
                            
                                <label htmlFor="date" className="sr-only">Start date:</label>
                                <input type="date" id="date" name="date"
                                onChange={handleChange}
                                value={firstRun.date}
                                min={moment(today).format('YYYY-MM-DD')}/>

                                <label htmlFor="timeOfDay" className="sr-only">Select Time of Day</label>
                                <select name="timeOfDay" id="timeOfDay" value={firstRun.timeOfDay} onChange={handleChange} required>
                                    <option value="Sunrise or Sunset" disabled selected hidden>Sunrise or Sunset</option>
                                    <option value="sunrise">Sunrise</option>
                                    <option value="sunset">Sunset</option>
                                </select>

                                <button className="btn-gray">Next</button>
                        
                        </form>
                    </> 
                    : null
                }

                {showResult ? 
                <div  className='runResults flex-column'>
                    <h3 style={{color: '#ffffff'}}>Here's our suggestion for you</h3>
                    {
                        runResults ?
                        <>
                            <div>
                                <h4>{moment(runResults.date).format('dddd')}</h4>
                                <h4>{runResults.date}</h4>
                                <p>Total Run Time:  {runResults.runDuration} mins</p>
                                <p>Departure Time:  {runResults.departureTime}</p>
                                <p>{runResults.sunTime === "Sunrise"? "Sunrise" : "Sunset"  }: {runResults.sunTime}</p> 
                            </div>
                        </>
                        : null
                    }
                    <div className="select-box">
                        <button id='confirmRun' className="btn-red" onClick={confirmRun}>Save Run</button>
                        <button id='editRun' className="btn-red" onClick={()=>setShowForm(true)}>Edit Run</button>

                    </div>
                </div>
                : null}

            </section>
        </main>
    )
}

export default SettingUpRun
