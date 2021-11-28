import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import firebase from '../firebase';

// profanity list import
import list from '../includes/list.txt';


function SignUp() {

  // declare navigate to next page
  let navigate = useNavigate();

  // useState declarations
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [country, setCountry] = useState('canada');
  const [isNameValid, setIsNameValid] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isZipValid, setIsZipValid] = useState(false);
  const [isPostalValid, setIsPostalValid] = useState(false);
  const [isSignupValid, setIsSignupValid] = useState(' ');
  const [isBackendValid, setIsBackendValid] = useState(true);

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

  // handleCountryChange ->
  const handleCountryChange = (event) => {

    setIsPostalValid(false);
    setIsZipValid(false);

    // set Country
    setCountry(event.target.value);
    setZipcode('');
    setPostalCode('');

  }
  // handlePostalCodeChange ->
  const handlePostalCodeChange = (event) => {
    setIsPostalValid(false);

    // set Country
    setPostalCode(event.target.value);

    const nameRegex = /^[a-zA-z][\d][a-zA-z]$/g; //first last

    if (nameRegex.test(event.target.value)) {
      setIsPostalValid(true);
    }
  }
  // handleZipCodeChange ->
  const handleZipcodeChange = (event) => {
    setIsZipValid(false);
    
    // set Country
    setZipcode(event.target.value);

    const nameRegex = /^\d{5}(?:[-\s]\d{4})?$/g; //first last

    if (nameRegex.test(event.target.value)) {
      setIsZipValid(true);
    }
  }

  

  // handleSignup (handle all error checking, submit to firebase, proceed to runsetup)
  const handleSignup = async (event) => {

    event.preventDefault();

    // declare a variable which checks if all 3 inputs (name, email, address) are all valid
    // let isSignupValid = (isNameValid && isEmailValid && (isZipValid || isPostalValid)) ? true : false;
    
    setIsSignupValid((isNameValid && isEmailValid && (isZipValid || isPostalValid)) ? true : false)
    console.log('signupvalidation:', isSignupValid)

    if(isNameValid && isEmailValid && (isZipValid || isPostalValid)) {
      
      // generate uid for user
      const userId = uid();

      const userObj = {
        uid: userId,
        name: name,
        email: email,
        location: "",
        country: country,
        registrationDate: "",
        coords: {
          lat: 0,
          long: 0
        }
      }

      // fetch data via user entered address
      const axiosCanada = {
        method: "GET",
        url: "https://us1.locationiq.com/v1/search.php?",
        params: {
          key: 'pk.e792824e9f1ab7cae5b956f6c6de2845',
          format: 'json',
          postalcode: postalCode,
          matchquality: 1
        }}

      const axiosUSA = {
        method: "GET",
        url: "https://us1.locationiq.com/v1/search.php?",
        params: {
          key: 'pk.e792824e9f1ab7cae5b956f6c6de2845',
          format: 'json',
          postalcode: zipcode,
          country: 'USA',
          matchquality: 1
        }
      }

      let axiosParams = {};
      if (country === 'canada'){
        axiosParams = {...axiosCanada}
      } else {
        axiosParams = {...axiosUSA}
      }

      await axios(axiosParams)
        .then((res) => {
          console.log('data', res.data)
          console.log('number of results: ', res.data.length)
          
          userObj.coords.lat = res.data[0].lat
          userObj.coords.long = res.data[0].lon
          userObj.location = res.data[0].display_name

          // create a timestamp
          const currentDate = new Date()
          userObj.registrationDate = currentDate.toLocaleTimeString() + " " + currentDate.toLocaleDateString();

          console.log(userObj);
          // set up firebase prepare statement/reference
          const dbRef = firebase.database().ref(`sample/${userObj.uid}`);
          const dbRef2 = firebase.database().ref(`poop/${userObj.uid}`);
          // update db to user object
          dbRef.update(userObj);
          
          // check to see if userObj was updated
          dbRef.on('value', (response) => {
            
            // check if the response is null / does not exist
            if(response.val() !== null) {

              // route to run set up form
              navigate(`/setup/${userObj.uid}`)

            } else {

              setIsBackendValid(false)            

            }

          })


        })
        .catch((err) => {
          setIsBackendValid(false)
          console.error(err)
        })

    }
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
        <label htmlFor="name" className="sr-only">Name</label>
        <input type="text" id="name" name="name" value={name} onChange={handleNameChange} placeholder="Full name"></input>

        {/* Error handling suggestion for app.js: regex to check for email format, check for empty input*/}
        <label htmlFor="email" className="sr-only">Email</label>
        <input type="text" id="email" name="email" value={email} onChange={handleEmailChange} placeholder="Email address"></input>

        {/* Error handling suggestion for app.js: no illegal characters, check for empty input, maybe min amount of characters, check for numerical and alpha*/}
        <label htmlFor="country" className="sr-only">Country</label>
        <select name="country" id="country" onChange={handleCountryChange}>
          <option value="canada">Canada</option>
          <option value="usa">USA</option>
        </select>

        {/* Error handling suggestion for app.js: no illegal characters, check for empty input, maybe min amount of characters, check for numerical and alpha*/}
        {/* <label for="address" className="sr-only">Street Address</label>
        <input type="text" id="address" name="address" value={address} onChange={handleAddressChange} placeholder="Street Address"></input> */}

        {/* Error handling suggestion for app.js: no illegal characters, check for empty input, maybe min amount of characters, check for numerical and alpha*/}
        {country === 'canada' ?
        <>
        <label htmlFor="postalcode" className="sr-only">Postal Code</label>
        <input type="text" id="postalcode" name="postalcode" value={postalCode} onChange={handlePostalCodeChange} placeholder="first 3 letter o postalcode" maxLength="3"></input>
        </>
        :
        <>
          <label htmlFor="zipcode" className="sr-only">Zip Code</label>
            <input type="text" id="zipcode" name="zipcode" value={zipcode} placeholder="zipcode" onChange={handleZipcodeChange}></input>
        </>
        }
        

        {/* Error handling suggestion for app.js: no illegal characters, check for empty input, maybe min amount of characters, check for numerical and alpha*/}
        {/* <label for="city" className="sr-only">City</label>
        <input type="text" id="city" name="city" value={city} onChange={handleCityChange} placeholder="City"></input>
         */}
        {/* <input type="text" id="country" name="country" value={country} onChange={handleCountryChange} placeholder="Country"></input> */}
      
        {/* Submit button to sign up and pass info to input handlers */}
        <button aria-label="Sign up for account" id="submit" name="submit">Sign up</button>
        {!isSignupValid && <p className="error-text">Form is invalid, please try again.</p> }
        {!isBackendValid && <p className="error-text">Something's wrong on our end it's not your fault, try again later.</p> }
        {!isNameValid && <p className="error-text">Your name is not in the proper format.</p> }
        {!isEmailValid && <p className="error-text">Please enter a valid email address.</p> }
        {!isPostalValid && country === 'canada' && <p className="error-text">Please enter the first 3 characters of a valid postal code.</p> }
        {!isZipValid && country === 'usa' && <p className="error-text">Please enter a valid zip code.</p> }

      </form>
    </div>
  )
}



export default SignUp;
