import React from 'react'

function Loader({variant}) {
    let classes = `dot-spin ${variant}`
    return (
        <div className={classes}/>
    )
}

export default Loader
