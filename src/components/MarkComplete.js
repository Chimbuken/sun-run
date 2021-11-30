import React from 'react'
import {useState, useEffect} from 'react'
import firebase from '../firebase';


function MarkComplete(props) {

        // function to remove run from database
        function markComplete(markComplete) {
            
            const user = props.userInfo
            // if theres is a key property of runs then run the following functions
            if(user.runs){
                // copy the old array
                // let oldRunArray = [...user.runs]
                // filter the run that needs to be deleted by returning the elements whose id is not equal to the selected element
                // const filteredArray = oldRunArray.filter(run=> run.id !== removeItemId)
                // creating an object with the filtered array.
                // const runObj = {
                //     runs: filteredArray
                // }
                
                // rerendering the runs in the dom with the new array.
                // props.runReRender(filteredArray)

                // set 'completed' to be true
                const mark = {completed:true}

                // updating the runs array in the firebase with the new filtered array of runs.
                firebase.database().ref(`/sample/${props.userId}/runs/${props.run}`).update(mark);
                
            }else{
                console.log('nothing to mark complete')
            }
        }
    return (
        <button aria-label="mark run complete" className="runs-item" onClick={() => markComplete(props.run)}>
            <i class="fas fa-check-circle"></i>
        </button>
    )
}

export default MarkComplete
