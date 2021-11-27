import {useState} from 'react'
import axios from 'axios';

function RunSetup() {
  const d = new Date();
  const [firstRun, setFirstRun] = useState({
    pace :'Jog',
    distance: '5km',
    date: `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`,
    userSunrise: false,
    userSunset: false,
    lat: 43.64829, 
    lng: -79.39785
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
      const something = response.data.results.sunrise;
      console.log('something: ', something)

      const event = new Date();
      // expected output: Wed Oct 05 2011 16:48:00 GMT+0200 (CEST)
      // (note: your timezone may vary)

      // something:  12:25:27 PM

      // new Date('05 October 2011 14:48 UTC');
      
      const isoDate= event.toISOString()
      console.log("isoDate: ", isoDate);

      setRunResults({...response.data.results, ...firstRun});
      
      // if(firstRun.pace === "Jog" ){
      //   if(firstRun.distance === "5km"){
      //           {/* 
      //   if user chooses jog - 5k - 
      //   mid point: sunrise
      //   total time 37.5minutes
      //   runResults.sunrise -  37.5/2

      // */}
      //     const totalRunTime = 37.5
      //     const startTime = totalRunTime/
      //   }

      // }
      // if(firstRun.pace === "Run" ){

      // }
    


    });
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