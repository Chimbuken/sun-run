import {useState, useEffect} from 'react'
import axios from 'axios';
import firebase from '../firebase';
import { useParams, useNavigate} from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment'


function RunSetup() {
  const month= ["January","February","March","April","May","June","July",
  "August","September","October","November","December"];
  const [today, setToday]=useState(new Date())

  const d = new Date();
  
  let navigate = useNavigate();

  // useState
  const [alert, setAlert] = useState({alert: false, alertMessage:''})
  const [firstRun, setFirstRun] = useState({
    pace :'Jog',
    distance: '5km',
    date: `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`, //be default the value will be the current date
    userSunrise: false,
    userSunset: false,
    lat: 43.64829, 
    lng: -79.39785,
  })

  const [showForm, setShowForm] =useState(true)
  const [showResult, setShowResult] =useState(false);
  const [ userInfo, setUserInfo] =useState({})
  const [runResults, setRunResults] = useState({})
  
  // Event Handlers
  // handleChange targets User's choice of Pace and Distance
  const handleChange = (e)=>{
    const {id, value} = e.target;
    setFirstRun({...firstRun, [id]:value})
  }

  // handleTimeClick stores the User's choice of Sunrise and Sunset
  const handleTimeClick = (e)=>{
    e.preventDefault()
    const {id} = e.target;
    console.log(id);
    if(id === "userSunrise"){
      setFirstRun({...firstRun, userSunrise:true, userSunset:false})
    }else {
      setFirstRun({...firstRun, userSunrise:false, userSunset: true})
    }
  }

  // setRun function - alerts User to select either Sunrise or Sunset
  // launches Axios call 
  // passes User's params (lat, lng) from Firebase
  // Response Object holds data of Sunrise and Sunset time of selected date
  const setRun = (e)=> {

    e.preventDefault()
    console.log(firstRun)
    if(firstRun.userSunrise ===false && firstRun.userSunset === false){
      console.log('please select at least sunrise or sunset')
      setAlert({alert: true, alertMessage:'Please select sunrise or sunset'})
    } else{
      setAlert({alert: false, alertMessage:''})
      
      axios({
        url: `https://api.sunrise-sunset.org/json?lat=${firstRun.lat}=${firstRun.lng}=${firstRun.date}`,
        method: "GET",
        dataResponse: "json",
        params: {
          lat: firstRun.lat,
          lng: firstRun.lng
        }
      }).then((response) => {
        // Stored values of sunrise and sunset values from API call
        // Results in format HH:MM:SS AM or PM UTC timezone
        const sunrise = response.data.results.sunrise;
        const sunset = response.data.results.sunset;
  
        // Stored values of Date and converted from the User's Choice to be in the same format as the API call response in UTC time
        const selectedDateArray =  firstRun.date.split("-")
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
        if(firstRun.pace ==="Jog" ){
          if(firstRun.distance === '5km'){
            totalTime = 37.5
          }
          if(firstRun.distance === '10km'){
            totalTime = 75
          }
          if(firstRun.distance === 'Half Marathon'){
            totalTime = 157.5
          }
          if(firstRun.distance === 'Marathon'){
            totalTime = 315
          }
        }

        // Logic for Run Choice
        if(firstRun.pace ==="Run"){
          if(firstRun.distance === '5km'){
            totalTime = 18.75
          }
          if(firstRun.distance === '10km'){
            totalTime = 37.5
          }
          if(firstRun.distance === 'Half Marathon'){
            totalTime = 78.75
          }
          if(firstRun.distance === 'Marathon'){
            totalTime = 157.5
          }
        }

        // User's firstRun values converted from a string to a number
        let userSelectedSunTime
        let timeInMinutes
        if(firstRun.userSunrise){
          userSelectedSunTime=localSunriseTime
          timeInMinutes = convertH2M(localSunriseTime);
        }else if(firstRun.userSunset){
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
        setRunResults({...firstRun, sunsetData: sunsetToHourMinute, sunriseData:sunriseToHourMinute, departureTime: convertingToHourMinute, runDuration: totalTime, userSelectedSunTime: userSelectedSunTime});   
        setShowForm(false)
        setShowResult(true)
      });
    }
  }

  function convertH2M(timeInHour){
    let timeParts = timeInHour.split(":");
    return Number(timeParts[0]) * 60 + Number(timeParts[1]);
  }

  // Function to handle User's Choice to confirm and store their Run Results or move back to the Run Setup form to edit their run pace, distance and time of day.
  // Firebase collects User's info and pushes to the User's Account for storage of their Run Data
  const handleConfirmation = (e)=> {
    const runId = uuidv4();

    console.log('runId: ', runId)
    const confirmationID = e.target.id
    if (confirmationID === "confirmRun") {
      console.log('confirm')
      if(userInfo.runs){
        console.log('there are some runs')        
        let timeOfDay ;
        if(runResults.userSunrise){
          timeOfDay = 'sunrise'
        }else {
          timeOfDay = 'sunset'
        }
        const newRun ={
                id: runId,
                pace: runResults.pace,
                distance: runResults.distance,
                timeOfDay: timeOfDay,
                date: runResults.date,
                departureTime: runResults.departureTime,
                runDuration: runResults.runDuration,
                suntime: runResults.userSelectedSunTime,
                completed: false
              }
              let usersCurrenRunArray = [...userInfo.runs]
              console.log('usersCurrenRunArray', usersCurrenRunArray)
              usersCurrenRunArray.push(newRun)
          console.log(usersCurrenRunArray)
          const updateUsersRun={
            runs: usersCurrenRunArray
            }
          firebase.database().ref(`/sample/${userId.userId}`).update(updateUsersRun);
          console.log('firebase updated')
          navigate(`/dashboard/${userId.userId}`);

          // remove this later 
          window.location.reload(false);

      } else {
        console.log('there are no runs')
        let timeOfDay;
        if(runResults.userSunrise){
          timeOfDay = 'sunrise'
        }else {
          timeOfDay = 'sunset'
        }
        const runObj ={
          runs:[
              {
                id: runId,
                pace: runResults.pace,
                distance: runResults.distance,
                timeOfDay: timeOfDay,
                date: runResults.date,
                departureTime: runResults.departureTime,
                runDuration: runResults.runDuration,
                suntime: runResults.userSelectedSunTime,
                completed: false
              }
          ]
      }
        firebase.database().ref(`/sample/${userId.userId}`).update(runObj);
        console.log('firebase updated')
        navigate(`/dashboard/${userId.userId}`);
        
        // remove this later 
        window.location.reload(false);
      }

    } else {
      console.log('edit run')
      setShowForm(true)
      setShowResult(true)
    }
  }

  // Firebase connection to intake users latitude and longitude from address from sign up form using useParams
  const userId = useParams()
  useEffect(()=>{
    firebase.database().ref(`/sample/${userId.userId}`).on('value', (response) => {
      const data = response.val();
      console.log('date: ', data)
      setUserInfo(data)
      setFirstRun({
        ...firstRun,
        lat: data.coords.lat, 
        lng: data.coords.long,
      })
    })
  },[])

  return (

    <main className="card-full">
    <section className="runSetupPage signup-form wrapper">
      
      {
        showForm === true ?
      <>
      {userInfo.runs?
      
      <h1>Add New</h1>
      :
      <h1>Let's setup your first run!</h1>
    }
      <form onSubmit={setRun} id="runSetupForm" className="flex-column">
        
          <label htmlFor="pace" className="sr-only">Pace</label>
          <select name="pace" id="pace" value={firstRun.pace} onChange={handleChange}> 
            <option value="Jog">Jog (8km/hr)</option>
            <option value="Run">Run (16km/h)</option>
          </select>
        
        
          <label htmlFor="distance" className="sr-only">Distance</label>
          <select name="distance" id="distance" value={firstRun.distance} onChange={handleChange}>
            <option value="5km">5km</option>
            <option value="10km">10km</option>
            <option value="Half Marathon">Half Marathon</option>
            <option value="Marathon">Marathon</option>
          </select>
        
        
        <label htmlFor="date" className="sr-only">Start date:</label>
          <input type="date" id="date" name="date"
          onChange={handleChange}
          value={firstRun.date}
          min={`${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`}/>
        
        <div className="select-box">
          {/* selectedBtn */}
          {/* <button id="userSunrise" className={firstRun.userSunrise ? 'selectedBtn btn-green' : 'btn-green'} onClick={handleTimeClick}>Sunrise</button>
          <button id="userSunset" className={firstRun.userSunset ? 'selectedBtn btn-green' : 'btn-green'} onClick={handleTimeClick}>Sunset</button> */}

          <input type="radio" name="userTime" id="userSunrise" onChange={handleTimeClick} checked={firstRun.userSunrise}/>
          <label htmlFor="userSunrise" >Sunrise</label>
          <input type="radio" name="userTime" id="userSunset" onChange={handleTimeClick} checked={firstRun.userSunset}/>
          <label htmlFor="userSunset">Sunset</label>

        </div>
        <button className="btn-red" onSubmit={setRun}>Set</button>
      </form>
      </>
      :
      null
      }

{
  alert.alert === true ? <p style={{color: "red"}}>{alert.alertMessage}</p> : null
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
                {/* moment().format('dddd') */}
                <h4>{moment(runResults.date).format('dddd')}</h4>
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
                <button id='editRun' className="btn-red" onClick={handleConfirmation}>Edit Run</button>
            </div>

            {userInfo.runs?
      
            <button id='cancelBtn' className="btn-red" onClick={()=>navigate(`/dashboard/${userId.userId}`)}>Cancel</button>
              : null            }
          </div>
          : null
      }
    </section>
    </main>
  )
}

export default RunSetup;