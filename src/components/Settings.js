import React, { useState, useEffect } from 'react';
import {useParams, Link} from 'react-router-dom';
import firebase from '../firebase';
import axios from 'axios';


function Settings() {
    const [userInfo, setUserInfo]=useState({});
    // const [usersLocation, setUsersLocation]=useState('')
    const {userId} = useParams()
    const [showNameForm, setShowNameForm] = useState(false);
    const [showEmailForm, setShowEmailForm] = useState(false);
    const [alert, setAlert] = useState({alert: false, alertMessage:''})

    // for editing location -> dallan's thingys
    // const [zipcode, setZipcode] = useState('');
    const [country, setCountry] = useState('canada');
    // const [postalCode, setPostalCode] = useState('');
    const [showLocationForm, setShowLocationForm] = useState(false);

    // when any of the inputs are changed we update the userInfo object
    const handleInputChange =(e)=>{
        const {id, value} = e.target;
        setUserInfo({...userInfo, [id]:value});
    }

    // when the user submits and updates their name
    const submitName=(e)=>{
        e.preventDefault()
        // console.log(userInfo)
        const nameRegex = /\s*([A-Za-z]{1,}([.,] |[-']| ))+[A-Za-z]+\.?\s*$/g; //first last
        if(nameRegex.test(userInfo.name)) {
            const dbRef = firebase.database().ref(`/sample/${userId}`);
            dbRef.update(userInfo)
            setAlert({alert: false, alertMessage:''})
            setShowNameForm(!showNameForm)
        }else {
            console.log('please provide a valid full name')
            setAlert({alert: true, alertMessage:'please provide a valid full name'})
        }
    }

    // when the user submits and updates their email
    const submitEmail = (e)=>{
        e.preventDefault()
        const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        if(emailRegex.test(userInfo.email)) {
            const dbRef = firebase.database().ref(`/sample/${userId}`);
            dbRef.update(userInfo)
            setAlert({alert: false, alertMessage:''})
            setShowEmailForm(!showEmailForm)
        }else {
            console.log('please provide a valid full name')
            setAlert({alert: true, alertMessage:'please provide a valid email'})
        }
    }

    // once location form is submit
    const submitLocation = async (e)=>{
        e.preventDefault()

        // the following are objects for the axios call to the api to get coords
        const axiosCanada = {
            method: "GET",
            url: "https://us1.locationiq.com/v1/search.php?",
            params: {
            key: 'pk.e792824e9f1ab7cae5b956f6c6de2845',
            format: 'json',
            postalcode: userInfo.postalCode,
            matchquality: 1
            }}

        const axiosUSA = {
            method: "GET",
            url: "https://us1.locationiq.com/v1/search.php?",
            params: {
            key: 'pk.e792824e9f1ab7cae5b956f6c6de2845',
            format: 'json',
            postalcode: userInfo.zipcode,
            country: 'USA',
            matchquality: 1
            }
        }

        // set the axios object to what country the user chose
        let axiosParams = (country === 'canada') ? { ...axiosCanada } : { ...axiosUSA };

        await axios(axiosParams)
        .then((res) => {
        
          // set the user info -> coords (lat, long), location
          userInfo.coords.lat = res.data[0].lat
          userInfo.coords.long = res.data[0].lon
          userInfo.location = res.data[0].display_name

        })
        .catch((err) => {
          console.error(err)
        })
        
        const postalRegex = /^[a-zA-z][\d][a-zA-z]$/g; // postal regex
        const zipRegex = /^\d{5}(?:[-\s]\d{4})?$/g; // zip code regex

        if(country === 'canada' && postalRegex.test(userInfo.postalCode)) {
            // delete the temporary zip and or postal from userInfo before pushing to db
            delete userInfo.zipcode;
            delete userInfo.postalCode;

            // make db connection
            const dbRef = firebase.database().ref(`/sample/${userId}`);

            // update the user
            dbRef.update(userInfo)
            setAlert({alert: false, alertMessage:''})
            setShowLocationForm(!showLocationForm)

        } else if(country === 'usa' && zipRegex.test(userInfo.zipcode)) {
            // delete the temporary zip and or postal from userInfo before pushing to db
            delete userInfo.postalCode;
            delete userInfo.zipcode;

            // make db connection
            const dbRef = firebase.database().ref(`/sample/${userId}`);

            // update the user
            dbRef.update(userInfo)

            // set the alert to false and empty it & close the form
            setAlert({alert: false, alertMessage:''})
            setShowLocationForm(!showLocationForm)

        } else {
            // delete the temporary zip and or postal from userInfo
            delete userInfo.postalCode;
            delete userInfo.zipcode;
            
            // set the alert to true with a message
            setAlert({alert: true, alertMessage:'please provide a valid postal or zip code'})
        }

    }

    useEffect(() => {
        // make database connection using our userId
        const dbRef = firebase.database().ref(`/sample/${userId}`);
        dbRef.on('value', (response)=>{
            const data = response.val();
            console.log('recieved data for user: ', data)
            setUserInfo(data)
            const userLocation= data.location.split(',').reverse()
            console.log('location:', userLocation)
        })
    }, [userId])

    // when the user selects their country of choice we update the country and clear the states
    const handleCountryChange = (event) => {

        // set Country
        setCountry(event.target.value);
        // setZipcode('');
        // setPostalCode('');

    }


    return (
        <main className="card-full">
            <section className="signup-form wrapper">
                <div >
                    <Link to={`/dashboard/${userId}`}>Back to Dashboard</Link>
                    <div className="flex">
                        <h1>{userInfo.name} </h1> <i className="fas fa-user-edit" onClick={()=>setShowNameForm(!showNameForm)}></i>
                    </div>
                    {showNameForm?
                    <form onSubmit={submitName}>
                        <label htmlFor="name" className="sr-only">Name</label>
                        <input type="text" id="name" name="name" value={userInfo.name} onChange={handleInputChange} placeholder="Full name"></input>
                        <button>save</button>
                        <i className="far fa-times-circle" onClick={()=>setShowNameForm(!showNameForm)}></i>
                    </form>
                    : null
                    }
                </div>
                <div >
                    <div className="flex">
                        <h4>{userInfo.email} </h4> <i className="far fa-envelope" onClick={()=>setShowEmailForm(!showEmailForm)}></i>
                    </div>
                    {showEmailForm?
                    <form onSubmit={submitEmail}>
                        <label htmlFor="email" className="sr-only">email</label>
                        <input type="text" id="email" name="email" value={userInfo.email} onChange={handleInputChange} placeholder="Email Address"></input>
                        <button>save</button>
                        <i className="far fa-times-circle" onClick={()=>setShowEmailForm(!showEmailForm)}></i>
                    </form>
                    : null
                    }
                </div>
                <div>
                    {/* display edit location form */}
                    {/* this will allow the user to enter their country, and either postal or zip code */}
                    <div className="flex">
                    <h4>{userInfo.location} </h4> <i class="fas fa-map-marker-alt" onClick={()=>setShowLocationForm(!showLocationForm)}></i>
                    </div>
                    {showLocationForm?
                    <form onSubmit={submitLocation}>
                        {/* <label htmlFor="country" className="sr-only">country</label>
                        <input type="text" id="email" name="email" value={userInfo.email} onChange={handleInputChange} placeholder="Email Address"></input> */}
                        
                        <label htmlFor="country" className="sr-only">Country</label>
                        <select value={country} name="country" id="country" onChange={handleCountryChange}>
                            <option value="canada">Canada</option>
                            <option value="usa">USA</option>
                        </select>

                        {/* Render either postal or zip code input depending on selected country */}
                        {country === 'canada' ?
                        <>
                            <label htmlFor="postalCode" className="sr-only">Postal Code</label>
                            <input type="text" id="postalCode" name="postalCode" value={userInfo.postalCode} onChange={handleInputChange} placeholder="First 3 digits of Postal Code" maxLength="3"></input>
                        </>
                        :
                        <>
                            <label htmlFor="zipcode" className="sr-only">Zip Code</label>
                            <input type="text" id="zipcode" name="zipcode" value={userInfo.zipcode} placeholder="Zipcode" onChange={handleInputChange} maxLength="5"></input>
                        </>
                        }
      
                        <button>save</button>
                        <i className="far fa-times-circle" onClick={()=>setShowLocationForm(!showLocationForm)}></i>
                    </form>
                    : null
                    }
                </div>
                {alert ?  <p>{alert.alertMessage}</p> : null }
            </section>
            change names
            change address
            change email
        </main>
    )
}

export default Settings
