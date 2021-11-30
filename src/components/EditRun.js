import React from 'react'
import {useState, useEffect} from 'react'
import firebase from '../firebase';
import axios from 'axios';


import {useParams , useNavigate} from 'react-router-dom'

function EditRun() {
    const month= ["January","February","March","April","May","June","July",
    "August","September","October","November","December"];
    const {userId} = useParams()
    const {runId} = useParams()
    const [runObj, setRunObj] = useState({})
    const [userInfo, setUserInfo] = useState({})
    const [showForm, setShowForm] =useState(true)
    const [showResult, setShowResult] =useState(false);
    const [alert, setAlert] = useState({alert: false, alertMessage:''})
    const [runResults, setRunResults] = useState({})


    console.log(userId)

    const handleChange = (e)=>{
        const {id, value} = e.target;
        setRunObj({...runObj, [id]:value})
    }
      // handleTimeClick stores the User's choice of Sunrise and Sunset
    const handleTimeClick = (e)=>{
        e.preventDefault()
        const {id} = e.target;
        console.log(id);
        if(id === "userSunrise"){
            setRunObj({...runObj, userSunrise:true, userSunset:false})
        }else {
            setRunObj({...runObj, userSunrise:false, userSunset: true})
        }
    }
    const editRun =(e)=>{
        e.preventDefault()
        console.log(runObj)
        axios({
            url: `https://api.sunrise-sunset.org/json?lat=${runObj.lat}=${runObj.lng}=${runObj.date}`,
            method: "GET",
            dataResponse: "json",
            params: {
              lat: runObj.lat,
              lng: runObj.lng
            }
          }).then((response) => {
            // Stored values of sunrise and sunset values from API call
            // Results in format HH:MM:SS AM or PM UTC timezone
            const sunrise = response.data.results.sunrise;
            const sunset = response.data.results.sunset;
      
            // Stored values of Date and converted from the User's Choice to be in the same format as the API call response in UTC time
            const selectedDateArray =  runObj.date.split("-")
            console.log('dateArray: ', selectedDateArray)
            const selectedYear = selectedDateArray[0]
            const selectedMonth = selectedDateArray[1]
            const selectedDate = selectedDateArray[2]
            const utcSunrise = `${selectedDate} ${month[selectedMonth-1]} ${selectedYear} ${sunrise} UTC`
            const utcSunset= `${selectedDate} ${month[selectedMonth-1]} ${selectedYear} ${sunset} UTC`
            
            // Converting UTC time to Local time by changing format from a string to an array
            let localSunriseTime = new Date(utcSunrise).toString()
            let localSunsetTime = new Date(utcSunset).toString()
            const sunriseArray = localSunriseTime.split(" ")
            const sunsetArray = localSunsetTime.split(" ")
            
            localSunriseTime =  sunriseArray[4]
            localSunsetTime =  sunsetArray[4]
    
            // User's Choice Logic
            // totalTime calculated using pre-determined Pace (Jog or Run km/h) and Distance (5km, 10km, 1/2 marathon, marathon) to minutes to make Time a number.
    
            let totalTime
            // Logic for Jog Choice
            if(runObj.pace ==="Jog" ){
              if(runObj.distance === '5km'){
                totalTime = 37.5
              }
              if(runObj.distance === '10km'){
                totalTime = 75
              }
              if(runObj.distance === 'Half Marathon'){
                totalTime = 157.5
              }
              if(runObj.distance === 'Marathon'){
                totalTime = 315
              }
            }
    
            // Logic for Run Choice
            if(runObj.pace ==="Run"){
              if(runObj.distance === '5km'){
                totalTime = 18.75
              }
              if(runObj.distance === '10km'){
                totalTime = 37.5
              }
              if(runObj.distance === 'Half Marathon'){
                totalTime = 78.75
              }
              if(runObj.distance === 'Marathon'){
                totalTime = 157.5
              }
            }
    
            // User's runObj values converted from a string to a number
            let userSelectedSunTime
            let timeInMinutes
            if(runObj.userSunrise){
              userSelectedSunTime=localSunriseTime
              timeInMinutes = convertH2M(localSunriseTime);
            }else if(runObj.userSunset){
              userSelectedSunTime=localSunsetTime
              timeInMinutes = convertH2M(localSunsetTime);
            }
            
            // Determining the User's Run Departure Time:
            // API results Sunrise or Sunset have been converted to a number.  The Sunrise and Sunset time act as the mid-point of the run.
            // totalRun time divided by 2 accounts for the User reaching the destination at the mid-point of the journey.
            // startTime is then converted back from a number to HH:MM AM/PM
            const startTime = Number(timeInMinutes) -(totalTime/2)
            let startMinute = Math.floor(startTime % 60)
            let startHour = (Math.floor(startTime / 60 ))
            if(startMinute < 10){
              startMinute = `0${startMinute}`
            }
    
            let convertingToHourMinute
            if(startHour > 12){
              convertingToHourMinute = (`${startHour-12}:${startMinute} PM`)
            }else {
              convertingToHourMinute = (`${startHour}:${startMinute} AM`)
            }
    
            // Converting Sunrise time to HH:MM AM
            const startSunrise = Number(timeInMinutes)
            let sunriseMin = Math.floor(startSunrise % 60)
            let sunriseHour = (Math.floor(startSunrise /60))
            if(sunriseMin < 10){
              sunriseMin = `0${sunriseMin}`
            }
    
            let sunriseToHourMinute
            if(sunriseHour > 12){
              sunriseToHourMinute = (`${sunriseHour-12}:${sunriseMin} PM`)
            }else {
              sunriseToHourMinute = (`${sunriseHour}:${sunriseMin} AM`)
            }
    
             // Converting Sunset time to HH:MM PM
            const startSunset = Number(timeInMinutes)
            let sunsetMin = Math.floor(startSunset % 60)
            let sunsetHour = (Math.floor(startSunset /60))
            if(sunsetMin < 10){
              sunsetMin = `0${sunsetMin}`
            }
    
            let sunsetToHourMinute
            if(sunsetHour > 12){
              sunsetToHourMinute = (`${sunsetHour-12}:${sunsetMin} PM`)
            }else {
              sunsetToHourMinute = (`${sunsetHour}:${sunsetMin} AM`)
            }
            setRunResults({...runObj, sunsetData: sunsetToHourMinute, sunriseData:sunriseToHourMinute, departureTime: convertingToHourMinute, runDuration: totalTime, userSelectedSunTime: userSelectedSunTime});   
            setShowForm(false)
            setShowResult(true)
          });
    }

    function convertH2M(timeInHour){
        let timeParts = timeInHour.split(":");
        return Number(timeParts[0]) * 60 + Number(timeParts[1]);
      }
    
    const handleConfirmation =()=>{
        console.log('runResults: ', runResults)
    }
    const showTheForm =()=>{
        setShowResult(false)
        setShowForm(true)
    }
    useEffect(() => {
        const dbRef = firebase.database().ref(`/sample/${userId}`);
        dbRef.on('value', (response) => {
        
            // store user data in data variable
            const data = response.val();
            console.log('data:', data)
            setUserInfo(data)
            data.runs.forEach(element => {
                if(element.id ===runId){
                    console.log('this is the run id: ', element)
                    const newObj={
                        pace : element.pace,
                        distance: element.distance,
                        date: element.date, //be default the value will be the current date
                        userSunrise: element.timeOfDay === "sunrise" ? true : false,
                        userSunset:element.timeOfDay === "sunset" ? true : false,
                        lat: data.coords.lat, 
                        lng: data.coords.long,
                    }
                    setRunObj(newObj)
                }
            });
        })
    }, [])


    return (
        <main  className="card-full">
            <section  className="runSetupPage signup-form wrapper">
                {
                    showForm === true ?
                <form  id="runSetupForm"  className="flex-column" onSubmit={editRun}>
                    <label htmlFor="pace" className="sr-only">Pace</label>
                    <select name="pace" id="pace" value={runObj.pace} onChange={handleChange}> 
                        <option value="Jog">Jog (8km/hr)</option>
                        <option value="Run">Run (16km/h)</option>
                    </select>

                    <label htmlFor="distance" className="sr-only">Distance</label>
                    <select name="distance" id="distance" value={runObj.distance} onChange={handleChange}>
                        <option value="5km">5km</option>
                        <option value="10km">10km</option>
                        <option value="Half Marathon">Half Marathon</option>
                        <option value="Marathon">Marathon</option>
                    </select>

                    <label htmlFor="date" className="sr-only">Start date:</label>
                    <input type="date" id="date" name="date"
                    onChange={handleChange}
                    value={runObj.date}
                    min={runObj.date}/>
                    <div className="select-box">
                    {/* selectedBtn */}
                    <button id="userSunrise" className={runObj.userSunrise ? 'selectedBtn btn-green' : 'btn-green'} onClick={handleTimeClick}>Sunrise</button>
                    <button id="userSunset" className={runObj.userSunset ? 'selectedBtn btn-green' : 'btn-green'} onClick={handleTimeClick}>Sunset</button>

                        {/* <input type="radio" name="userTime" id="userSunrise" onChange={handleTimeClick} checked={runObj.userSunrise}/>
                        <label htmlFor="userSunrise" >Sunrise</label>
                        <input type="radio" name="userTime" id="userSunset" onChange={handleTimeClick} checked={runObj.userSunset}/>
                        <label htmlFor="userSunset">Sunset</label> */}

                    </div>
                    <button className="btn-red" onSubmit={editRun}>VIew Result</button>
                </form> : null

                }

                {
            showResult === true ?
                <div className='runResults flex-column'>
                    <h3>Here's what we got for you:</h3>
                    {
                    runResults ?
                    <>
                    {runResults.userSunrise === true ? 
                    <div>
                        <h4>{runResults.date}</h4>
                        <p>Departure Time:  {runResults.departureTime}</p>
                        <p>Sunrise: {runResults.sunriseData}</p> 

                    </div>
                    : null}
                    {runResults.userSunset === true ? 
                    <div>
                        <h4>{runResults.date}</h4>
                        <p>Departure Time:  {runResults.departureTime}</p>
                        <p>Sunset: {runResults.sunsetData}</p>
                    </div>
                    
                    : null}
                    </>
                    : null
                    }
                    <div className="select-box">
                      <button id='confirmRun' className="btn-red" onClick={handleConfirmation}>Confirm Run</button>
                        <button id='editRun' className="btn-red" onClick={showTheForm}>Edit Run</button>
                    </div>
                </div>
                : null
            }
            </section>

        </main>
    )
}

export default EditRun
