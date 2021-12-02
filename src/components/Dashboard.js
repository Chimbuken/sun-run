import {useParams } from 'react-router-dom';
import UsersCalendar from "./UsersCalendar";
import UpcomingRuns from './UpcomingRuns.js';
import firebase from '../firebase';
import { useEffect, useState } from 'react';
import moment from 'moment';
import '../usersCalendar.css'
import axios from 'axios';
import Stats from './Stats';

function Dashboard(){
  const [updateName, setUpdateName] = useState({});
  const [todaySunrise, setTodaySunrise] = useState('');
  const [todaySunset, setTodaySunset] = useState('');

  const {userId}  = useParams()
  const user = useParams()

    useEffect( () => {

      const dbRef = firebase.database().ref(`/sample/${user.userId}`);

      dbRef.on('value', (response) => {
      
          const data = response.val();
          setUpdateName(data)
          axios({
            url: `https://api.sunrise-sunset.org/json?lat=${data.coords.lat}&lng=${data.coords.long}&date=today`,
            method: "GET",
            dataResponse: "json",
          }).then((response) => {

            const todaySunriseUTC = response.data.results.sunrise;
            const todaySunsetUTC = response.data.results.sunset;

            let todaySunriseUTCString = todaySunriseUTC.toString();
            console.log(todaySunriseUTCString);
          
            const time = moment.utc().format('LT');
            console.log('UTC',time)
            const local = moment.utc().local().format('LT')
            console.log('local', local)

            setTodaySunrise(todaySunriseUTC)
            setTodaySunset(todaySunsetUTC)
          })
      })   
      
    }, [user.userId])
    
    const todayDate = moment().format("dddd, MMMM Do YYYY")
  return (
    <section className="card-full">
      <div className="flex dashboard-welcome">
        <h2>Hello, {updateName.name}</h2>
        <div className="flex-column todays-metrics">
          <h3>{todayDate}</h3>
          {/* <p>Sunrise: {todaySunrise}</p>
          <p>Sunset: {todaySunset}</p> */}
        </div>

      </div>
      <div className="flex dashboard">
        <UpcomingRuns/>
        <UsersCalendar userId={userId} />
      </div>
        <Stats  userId={userId}/>
    </section>  
  )
}

export default Dashboard;

