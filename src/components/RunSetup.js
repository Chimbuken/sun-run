import {useState} from 'react'
import axios from 'axios';

function RunSetup() {
  const month= ["January","February","March","April","May","June","July",
  "August","September","October","November","December"];

  const d = new Date();
  const [firstRun, setFirstRun] = useState({
    pace :'Jog',
    distance: '5km',
    date: `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`,
    userSunrise: false,
    userSunset: false,
    lat: 43.64829, 
    lng: -79.39785,
    year: d.getFullYear(),
    month: d.getMonth(),
    day: d.getDate()
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
    
// https://api.sunrise-sunset.org/json?lat=36.7201600&lng=-4.4203400
    axios({
      url: `https://api.sunrise-sunset.org/json?lat=${firstRun.lat}=${firstRun.lng}=today`,
      method: "GET",
      dataResponse: "json",
      params: {
        lat: firstRun.lat,
        lng: firstRun.lng
      }
    }).then((response) => {
      console.log(response.data.results)
      // getting the values for sunrise and sunset from api call. 
      const sunrise = response.data.results.sunrise;
      const sunset = response.data.results.sunset;
    
      // converting the results in to utc format so that we can convert it to local time. 
      const utcSunrise = `${firstRun.day} ${month[firstRun.month]} ${firstRun.year} ${sunrise} UTC`
      const utcSunset= `${firstRun.day} ${month[firstRun.month]} ${firstRun.year} ${sunset} UTC`

      // Sat Nov 27 2021 16:45:15 GMT-0500 (Eastern Standard Time) RunSetup.js:69
      
      // converting the utc time to local time which gives us a sting of date , time and year and time zone. 
      let localSunriseTime = new Date(utcSunrise).toString()
      let localSunsetTime = new Date(utcSunset).toString()

      // converting the strings into array to get the time for now. 
      const sunriseArray = localSunriseTime.split(" ")
      const sunsetArray = localSunsetTime.split(" ")
      console.log('local Sunrise Time with date: ', localSunriseTime);
      console.log('local Sunrise Time with date: ', localSunsetTime);
      console.log('sunset local time: ', sunsetArray);
      
      localSunriseTime =  sunriseArray[4]
      localSunsetTime =  sunsetArray[4]
      console.log('sunrise local time: ', localSunriseTime);
      console.log('sunset local time: ', localSunsetTime);

      let totalTime

      setRunResults({...response.data.results, ...firstRun});   
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
      console.log('localSunriseTime: ', localSunriseTime -localSunsetTime )
      
      let timeInMinutes = convertH2M(localSunriseTime);
      console.log('timeInMinutes: ', timeInMinutes);

      const startTime = Number(timeInMinutes) -(totalTime/2)
      const test = convertM2H(startTime)
      console.log('start time if sunrise: ', startTime)
      console.log('start time if sunrise: ', test)      
    });
    function convertH2M(timeInHour){
      var timeParts = timeInHour.split(":");
      return Number(timeParts[0]) * 60 + Number(timeParts[1]);
    }
    function convertM2H(timeInMinuets){
      var timeParts = timeInMinuets;
      return Number(timeInMinuets / 60);
    }
  }
  return (
    <section>
      <h1>Let's setup your first run!</h1>

      <form onSubmit={setRun} >
        <div>
          <label for="pace">Pace</label>
          <select name="pace" id="pace" value={firstRun.pace} onChange={handleChange}> 
            <option value="Jog">Jog 8km/hr</option>
            <option value="Run">Run 16km/h</option>
          </select>
        </div>
        
        <div>
          <label for="distance">Distance</label>
          <select name="distance" id="distance" value={firstRun.distance} onChange={handleChange}>
            <option value="5km">5km</option>
            <option value="10km">10km</option>
            <option value="Half Marathon">Half Marathon</option>
            <option value="Marathon">Marathon</option>
          </select>
        </div>
        <div>
        <label for="date">Start date:</label>
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
          runResults ?
          <>
          {runResults.userSunrise === true ? <p>sunrise: {runResults.sunrise}</p> : null}
          {/* {runResults.userSunrise === true ?
            runResults.pace ==='Jog'  ?
            <p>sunrise: {runResults.sunrise-}</p> 
            
           : null} */}
          {runResults.userSunset === true ? <p>sunset: {runResults.sunset}</p> : null}
          </>
          : null
        }
      </div>


    </section>
  )
}

export default RunSetup;