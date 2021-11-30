import React from 'react'

function EditRun(props) {
    const editRun=(rundId)=>{
        
    }
    return (
        <>
            <button className="runs-item" onClick={() => editRun(props.run.id)}>
                <i className="far fa-edit"></i>
            </button>
        </>
    )
}
export default EditRun
