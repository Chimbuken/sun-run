import {useState} from 'react'
import axios from 'axios';

function RunSetup() {
  const d = new Date();
  const [firstRun, setFirstRun] = useState({
    pace :'Jog',
    distance: '5km',
    date: `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`,
    sunrise: false,
    sunset: false
  })
  
  const handleChange = (e)=>{
    const {id, value} = e.target;
  
    setFirstRun({...firstRun, [id]:value})

  }
  const handleTimeClick = (e)=>{
    e.preventDefault()

    const {id} = e.target;
    if(id === "sunrise"){
      setFirstRun({...firstRun, sunrise:true, sunset: !firstRun.sunset})
    }else {
      setFirstRun({...firstRun, sunrise:! firstRun.sunrise, sunset: true})
    }

  }
  const setRun = (e)=>{
    e.preventDefault()
    console.log(firstRun)
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
          <button id="sunrise" onClick={handleTimeClick}>Sunrise</button>
          <button id="sunset" onClick={handleTimeClick}>Sunset</button>
        </div>

        <button onSubmit={setRun}>Submit</button>
      </form>


    </section>
  )
}

export default RunSetup;