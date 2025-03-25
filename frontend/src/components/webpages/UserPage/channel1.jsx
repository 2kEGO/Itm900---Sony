import React, {useState} from 'react'
import "./channel.css"

import FileUpload from '../UploadFiles/Upload'
import FileList from '../s3Item/s3Item'
import {availableProjects} from '../../../context/data.js'

const Channel1 = () => {
  
  const [channels, setChannels] = useState (["General", "Mix", "Master", "Demo","Static Asset", "Social content"])
  const [currentChannel, setCurrentChannel] = useState ("General")


  return (
    <div className="channel-container">
      <div className="channel-wrapper">

        <div className="channel-left-container">

          <div className="channel-left-wrapper">
  
            <div className="channels-title">
              <h1>Project Name: </h1>
            </div>
            

            <ul className='channels-section'>
              {channels.map((channel, index) => (
                <li key={index} className='channel'>
                  <button onClick={() => setCurrentChannel(channel)}>
                    {channel}
                  </button>
                </li>
              ))}
            </ul>

          </div>
        
        </div>


        <div className="channel-right-container">
          <div className="channel-right-wrapper">
              
            {currentChannel === "General" && <FileUpload />}
            {currentChannel === "Mix" && <FileList />}

          </div>
        </div>

      </div>
    </div>
  )
}

export default Channel1