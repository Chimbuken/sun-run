import React, { useState, useEffect } from 'react';
import {useParams , useNavigate, Link} from 'react-router-dom';
import firebase from '../firebase';


function Settings() {
    const [userInfo, setUserInfo]=useState({});
    const [usersLocation, setUsersLocation]=useState('')
    const {userId} = useParams()
    const [showNameForm, setShowNameForm] = useState(false);
    const [showEmailForm, setShowEmailForm] = useState(false);
    const [alert, setAlert] = useState({alert: false, alertMessage:''})
    const [zipcode, setZipcode] = useState('');
    const [country, setCountry] = useState('canada');
    const [postalCode, setPostalCode] = useState('');

    const handleInputChange =(e)=>{
        const {id, value} = e.target;
        setUserInfo({...userInfo, [id]:value});
    }
    const submitName=(e)=>{
        e.preventDefault()
        // console.log(userInfo)
        const nameRegex = /\s*([A-Za-z]{1,}([\.,] |[-']| ))+[A-Za-z]+\.?\s*$/g; //first last
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
    const submitEmail = (e)=>{
        e.preventDefault()
        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
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
    }, [])
    return (
        <main className="card-full">
            <Link to={`/dashboard/${userId}`}>Back to dashboard</Link>
            <section className="signup-form wrapper">
                <div >
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
                    <div className="flex">
                    <h4>{userInfo.location} </h4> <i className="far fa-envelope" onClick={()=>setShowEmailForm(!showEmailForm)}></i>

                    </div>
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
