import {useState} from 'react'
import axios from 'axios';

function RunSetup() {
  // useStates holds runSetup and firstRun setup default parameters
  const month= ["January","February","March","April","May","June","July",
  "August","September","October","November","December"];
  const d = new Date();
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

  // useState holds Users chosen values 
  const [runResults, setRunResults] = useState({})
  const handleChange = (e)=>{
    const {id, value} = e.target;
    setFirstRun({...firstRun, [id]:value})
  }

  // handlerTimeClick stores the User choice Sunrise and Sunset values
  const handleTimeClick = (e)=>{
    e.preventDefault()
    const {id} = e.target;
    if(id === "userSunrise"){
      setFirstRun({...firstRun, userSunrise:true, userSunset:false})
    }else {
      setFirstRun({...firstRun, userSunrise:false, userSunset: true})
    }
  }

  // setRun function - alerts User to select either Sunrise or Sunset
  // launches Axios call 
  // passes Users params (lat, lng) from Firebase
  // response Object holds data of Sunrise time and Sunset time of selected date
  const setRun = (e)=> {

    e.preventDefault()
    console.log(firstRun)
    if(firstRun.userSunrise ===false && firstRun.userSunset === false){
      console.log('please select at least sunrise or sunset')
      setAlert({alert: true, alertMessage:'Please atleast select sunrise or sunset'})
    } else{
      setAlert({alert: false, alertMessage:''})
      // https://api.sunrise-sunset.org/json?lat=36.7201600&lng=-4.4203400
      axios({
        url: `https://api.sunrise-sunset.org/json?lat=${firstRun.lat}=${firstRun.lng}=${firstRun.date}`,
        method: "GET",
        dataResponse: "json",
        params: {
          lat: firstRun.lat,
          lng: firstRun.lng
        }
      }).then((response) => {
        console.log(`API Call`, response.data.results)
        // getting the values for sunrise and sunset from api call. results are in format HH:MM:SS AM or PM in UTC 
        const sunrise = response.data.results.sunrise;
        const sunset = response.data.results.sunset;
  
        // getting the values of date to convert the time from utc to local time
        const selectedDateArray =  firstRun.date.split("-")
        console.log('dateArray: ', selectedDateArray)
        const selectedYear = selectedDateArray[0]
        const selectedMonth = selectedDateArray[1]
        const selectedDate = selectedDateArray[2]
      
        // converting the results in to utc format so that we can convert it to local time. 
        const utcSunrise = `${selectedDate} ${month[selectedMonth-1]} ${selectedYear} ${sunrise} UTC`
        const utcSunset= `${selectedDate} ${month[selectedMonth-1]} ${selectedYear} ${sunset} UTC`
        
        // converting the utc time to local time which gives a sting for the date, time and year and time zone. 
        let localSunriseTime = new Date(utcSunrise).toString()
        let localSunsetTime = new Date(utcSunset).toString()
  
        // converting the strings into array to get the time for now. 
        const sunriseArray = localSunriseTime.split(" ")
        const sunsetArray = localSunsetTime.split(" ")
        
        localSunriseTime =  sunriseArray[4]
        localSunsetTime =  sunsetArray[4]

        // User Choice Logic
        // totalTime calculated using Pace (Jog or Run km/h) and Distance (5km, 10km, 1/2 marathon, marathon) in minutes

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

        // converting time from a string to a number - take time of day in hours and calculates total minutes
        let timeInMinutes
        if(firstRun.userSunrise){
          timeInMinutes = convertH2M(localSunriseTime);
        }else if(firstRun.userSunset){
          timeInMinutes = convertH2M(localSunsetTime);
        }
        
        // takes the API result of sunrise or sunset time minus the total run time divided by 2
        // total time is divided by 2 to account the user reaching the destination as the mid-point of the journey, and then back
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
  
        // localSunriseTime =  sunriseArray[4]
        // localSunsetTime =  sunsetArray[4] 
        
        setRunResults({...firstRun, sunsetData: sunsetToHourMinute, sunriseData:sunriseToHourMinute, departureTime: convertingToHourMinute });   
  
      });
    }
    
  }

  function convertH2M(timeInHour){
    let timeParts = timeInHour.split(":");
    return Number(timeParts[0]) * 60 + Number(timeParts[1]);
  }

  return (
    <section>
      <h1>Let's setup your first run!</h1>

      <form onSubmit={setRun} id="runSetupForm">
        <div>
          <label htmlFor="pace" className="sr-only">Pace</label>
          <select name="pace" id="pace" value={firstRun.pace} onChange={handleChange}> 
            <option value="Jog">Jog (8km/hr)</option>
            <option value="Run">Run (16km/h)</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="distance" className="sr-only">Distance</label>
          <select name="distance" id="distance" value={firstRun.distance} onChange={handleChange}>
            <option value="5km">5km</option>
            <option value="10km">10km</option>
            <option value="Half Marathon">Half Marathon</option>
            <option value="Marathon">Marathon</option>
          </select>
        </div>
        <div>
        <label htmlFor="date" className="sr-only">Start date:</label>
          <input type="date" id="date" name="date"
          onChange={handleChange}
          value={firstRun.date}
          min={firstRun.date}/>
        </div>
        <div>
          <button id="userSunrise" onClick={handleTimeClick}>Sunrise</button>
          <button id="userSunset" onClick={handleTimeClick}>Sunset</button>
        </div>

        <button onSubmit={setRun}>Set</button>
      </form>

      <div className='runResults'>
        <h3>Here's what we got for you:</h3>
        {
          alert.alert === true ? <p style={{color: "red"}}>{alert.alertMessage}</p> : null
        }

        {
          runResults ?
          <>
          {runResults.userSunrise === true ? 
          <div>
            <p>Date: {runResults.date}</p>
            <p>Sunrise: {runResults.sunriseData}</p> 
            <p>Departure Time:  {runResults.departureTime}</p>

          </div>
          : null}
          {/* {runResults.userSunrise === true ?
            runResults.pace ==='Jog'  ?
            <p>sunrise: {runResults.sunrise-}</p> 
            
           : null} */}
          {runResults.userSunset === true ? 
          <div>
            <p>Date: {runResults.date}</p>
            <p>Sunset: {runResults.sunsetData}</p>
            <p>Departure Time:  {runResults.departureTime}</p>

          </div>
          
          : null}
          </>
          : null
        }
      </div>


    </section>
  )
}

export default RunSetup;