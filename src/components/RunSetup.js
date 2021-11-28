import {useState} from 'react'
import axios from 'axios';

function RunSetup() {
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
  const [runResults, setRunResults] = useState({})
  const handleChange = (e)=>{
    const {id, value} = e.target;
    setFirstRun({...firstRun, [id]:value})
  }
  const handleTimeClick = (e)=>{
    e.preventDefault()
    const {id} = e.target;
    if(id === "userSunrise"){
      setFirstRun({...firstRun, userSunrise:true, userSunset:false})
    }else {
      setFirstRun({...firstRun, userSunrise:false, userSunset: true})
    }
  }
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
        console.log(response.data.results)
        // getting the values for sunrise and sunset from api call. the results we receive from the api call only provide time 
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
        
        // converting the utc time to local time which gives us a sting of date , time and year and time zone. 
        let localSunriseTime = new Date(utcSunrise).toString()
        let localSunsetTime = new Date(utcSunset).toString()
  
        // converting the strings into array to get the time for now. 
        const sunriseArray = localSunriseTime.split(" ")
        const sunsetArray = localSunsetTime.split(" ")
        
        localSunriseTime =  sunriseArray[4]
        localSunsetTime =  sunsetArray[4]
        let totalTime
        
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
          // firstRun.distance
        }
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
        // 
        let timeInMinutes
        if(firstRun.userSunrise){
          timeInMinutes = convertH2M(localSunriseTime);
        }else if(firstRun.userSunset){
          timeInMinutes = convertH2M(localSunsetTime);
        }
  
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
  
        localSunriseTime =  sunriseArray[4]
        localSunsetTime =  sunsetArray[4]  
        setRunResults({
          ...firstRun, 
          sunsetData: localSunsetTime, 
          sunriseData: localSunriseTime, 
          departureTime: convertingToHourMinute 
        }); 
      });
    }
    
  }
  function convertH2M(timeInHour){
    var timeParts = timeInHour.split(":");
    return Number(timeParts[0]) * 60 + Number(timeParts[1]);
  }
  return (
    <section>
      <h1>Let's setup your first run!</h1>
      <form onSubmit={setRun} >
        <div>
          <label htmlFor="pace">Pace</label>
          <select name="pace" id="pace" value={firstRun.pace} onChange={handleChange}> 
            <option value="Jog">Jog 8km/hr</option>
            <option value="Run">Run 16km/h</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="distance">Distance</label>
          <select name="distance" id="distance" value={firstRun.distance} onChange={handleChange}>
            <option value="5km">5km</option>
            <option value="10km">10km</option>
            <option value="Half Marathon">Half Marathon</option>
            <option value="Marathon">Marathon</option>
          </select>
        </div>
        <div>
        <label htmlFor="date">Start date:</label>
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