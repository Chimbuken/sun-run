import { useState } from "react";
import { useNavigate } from "react-router-dom"
import firebase from '../firebase';



function SignIn() {
  let navigate = useNavigate();
  const myId = 'kwpcdxsyqt5yt93bnn'

  const [userId, setUserId] = useState('');
  const [userKeys, setUserKeys] = useState([]);
  const [isValid, setIsValid] = useState(true)

  const handleInputChange = (e) => {
    e.preventDefault();
    console.log(e.target.value);
    setUserId(e.target.value)
  }

  const handleSignIn = async (e) => {
    e.preventDefault();
    const userInput = userId;

    const dbRef = firebase.database().ref(`sample`);

    await dbRef.once('value', snapshot => {
      setUserKeys(Object.keys(snapshot.val()))
    })

    console.log('user keys: ', userKeys)

    if (userKeys.includes(userInput)){
      console.log('YES')
    } else {
      console.log('nothing here')
    }

  }

  return (
    <main className="card-full">
      <section className="signup-form wrapper flex-column">
        <h2>Welcome Back</h2>
        <form action="">
          <label htmlFor="name" className="sr-only">Please enter your user Id</label>
          <input type="text" id="name" name="name" onChange={handleInputChange} placeholder="Your User ID" value={userId} />
          {!isValid && <p>Can't find that user id, please try again!</p>}
          <button className="btn-gray" onClick={handleSignIn}>Sign In</button>
        </form>

      </section>
    </main>
  )
}

export default SignIn
