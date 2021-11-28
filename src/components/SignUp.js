import axios from 'axios';
import { useEffect, useState } from 'react';
import firebase from '../firebase';

// profanity list import
import list from '../includes/list.txt';


function SignUp() {

  // useState declarations
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [isNameValid, setIsNameValid] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isAddressValid, setIsAddressValid] = useState(false);
  const [isCityValid, setIsCityValid] = useState(false);
  const [isCountryValid, setIsCountryValid] = useState(false);
  const [coordinates, setCoordinates] = useState({})


  // uid generator (for now)
  const uid = function(){
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // handleNameChange -> setName -> name
  const handleNameChange = (event) => {

    setIsNameValid(false)

    // set name
    setName(event.target.value);

    // this regex requires first and last name
    const nameRegex = /\s*([A-Za-z]{1,}([\.,] |[-']| ))+[A-Za-z]+\.?\s*$/g; //first last

    if(nameRegex.test(event.target.value)) {
      setIsNameValid(true);
    }

  }

  // handleEmailChange -> setEmail -> email
  const handleEmailChange = (event) => {
    
    setIsEmailValid(false)

    // set email
    setEmail(event.target.value);

    // check if email is in proper format and is not empty -> set email validation to true
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(emailRegex.test(event.target.value)) {
      setIsEmailValid(true); 
    }  

  }

  // handleAddressChange -> setAddress -> address
  const handleAddressChange = (event) => {

    setIsAddressValid(false)

    // set address
    setAddress(event.target.value);
  
    if(isNotEmpty(event.target.value)) {
      setIsAddressValid(true); 
    }
  }

  // handleCityChange
  const handleCityChange = (event) => {

    setIsCityValid(false)

    // set City
    setCity(event.target.value);
  
    if(isNotEmpty(event.target.value)) {
      setIsCityValid(true); 
    }
  }

  // handleCountryChange ->
  const handleCountryChange = (event) => {

    setIsCountryValid(false)

    // set Country
    setCountry(event.target.value);
  
    if(isNotEmpty(event.target.value)) {
      setIsCountryValid(true); 
    }
  }

  // declare a variable which checks if all 3 inputs (name, email, address) are all valid
  const isSignupValid = (isNameValid && isEmailValid && isAddressValid && isCityValid && isCountryValid) ? true : false;

  // handleSignup (handle all error checking, submit to firebase, proceed to runsetup)
  const handleSignup = (event) => {

    event.preventDefault();

    if(isSignupValid) {

      axios({
        url: "https://us1.locationiq.com/v1/search.php?",
        params: {
          key: 'pk.e792824e9f1ab7cae5b956f6c6de2845',
          format: 'json',
          street: address,
          city: city,
          country: country
        }
      })
        .then((data) => {
          const userObj = {
            uid: userId,
            name: name,
            email: email,
            address: address,
            city: city,
            country: country,
            coords: {
              lat: data.data[0].lat,
              long: data.data[0].lon
            }
          }
          const dbRef = firebase.database().ref(`sample/${userObj.uid}`);
          dbRef.update(userObj);
          console.log(userObj);
        })
        .catch((err) => console.error(err))


      // get long/lat based on user address
      // const coordinates = getCoordinate(address, city, country);
      // console.log(coordinates)

      // generate uid for user
      const userId = uid();

      // if all 3 inputs are valid without errors, then setUser to database
      // const userObj = {
      //   uid: userId,
      //   name: name,
      //   email: email,
      //   address: address,
      //   city: city,
      //   country: country,
      //   coords: {
      //     lat: 0,
      //     long: 0
      //   }
      // }

      // console.log(userObj);

      // set up firebase prepare statement/reference
      // const dbRef = firebase.database().ref(`sample/${userObj.uid}`);

      // update db to user object
      // dbRef.update(userObj);
      
    }
  }

  // function to fetch + get long+lat
  const getCoordinate = (address, city, country) => {
    console.log('in axios: ', address, city, country)
    let dataObj;
    axios({
      url: "https://us1.locationiq.com/v1/search.php?",
      params: {
        key: 'pk.e792824e9f1ab7cae5b956f6c6de2845',
        format: 'json',
        street: address,
        city: city,
        country: country
      }
    })
    .then((data) => {
      console.log('data', data)
      console.log(data.data[0].lon)
      // console.log('in functions: ', dataObj)
    })
    .catch((err) => console.error(err))

    

    return dataObj;
  }

  // function to check if input is empty
  const isNotEmpty = (input) => {

    // check if the input is empty
    if(input.trim() === '') {
      return false;
    }

    // if input is not empty return true
    return true;

  }

  return (
    /*
      This component is used to display the sign up form
      The user is required to type in their name, email and address
      The form will then be submitted to App.js through a function: handleSignup
    */
    <div>

      <h1>Home: Sign Up Page</h1>

      <h2>Welcome</h2>

      {/* Form for signup which takes the user's: name, email, address */}
      <form aria-label="Welcome wizard form" onSubmit={handleSignup}>

        {/* Error handling suggestion for app.js: alpha characters only, check for empty input*/}
        <label for="name" className="sr-only">Name</label>
        <input type="text" id="name" name="name" value={name} onChange={handleNameChange} placeholder="Full name"></input>

        {/* Error handling suggestion for app.js: regex to check for email format, check for empty input*/}
        <label for="email" className="sr-only">Email</label>
        <input type="text" id="email" name="email" value={email} onChange={handleEmailChange} placeholder="Email address"></input>

        {/* Error handling suggestion for app.js: no illegal characters, check for empty input, maybe min amount of characters, check for numerical and alpha*/}
        <label for="address" className="sr-only">Street Address</label>
        <input type="text" id="address" name="address" value={address} onChange={handleAddressChange} placeholder="Street Address"></input>

        {/* Error handling suggestion for app.js: no illegal characters, check for empty input, maybe min amount of characters, check for numerical and alpha*/}
        <label for="city" className="sr-only">City</label>
        <input type="text" id="city" name="city" value={city} onChange={handleCityChange} placeholder="City"></input>
        
        {/* Error handling suggestion for app.js: no illegal characters, check for empty input, maybe min amount of characters, check for numerical and alpha*/}
        <label for="country" className="sr-only">Country</label>
        <input type="text" id="country" name="country" value={country} onChange={handleCountryChange} placeholder="Country"></input>
      
        {/* Submit button to sign up and pass info to input handlers */}
        <button aria-label="Sign up for account" id="submit" name="submit">Sign up</button>

      </form>
    </div>
  )
}

export default SignUp;
