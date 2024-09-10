import { DeviceSettings, useCall, VideoPreview } from '@stream-io/video-react-sdk'
import React, { useState, useEffect } from 'react'
import { Button } from './button';

const MeetingSetup = ({setIsSetupComplete}:{setIsSetupComplete: (value: boolean) => void}) => {
  const [isMicCamToggledOn, setIsMicCamToggledOn] = useState(false);
  const call = useCall();

  useEffect(() => {
    if (!call) return; // Exit early if call is not available

    if(!call){
      throw new Error('Call not found');
    }

    if (isMicCamToggledOn) {
      call.camera?.disable();
      call.microphone?.disable();
    } else {
      call.camera?.enable();
      call.microphone?.enable();
    }
  }, [isMicCamToggledOn, call]);
  
  if (!call) {
    return <div>Loading...</div>; // Or any other loading indicator
  }

  return (
    <div className='flex h-screen w-full flex-col items-center justify-center gap-3 text-white'>
      <h1 className='text-2xl font-bold'>
        Setup
      </h1>
      <VideoPreview />
      <div className='flex h-16 items-center justify-center gap-3'>
        <label className='flex items-center gap-2 justify-center font-medium'>
          <input
          type="checkbox"
          checked={isMicCamToggledOn}
          onChange={(e) => setIsMicCamToggledOn(e.target.checked)}
          />
          join with mic and camera off
        </label>
        <DeviceSettings />
      </div>
    <Button className='rounded-md bg-green-500 px-4 py-2.5'
       onClick={() =>{ call.join(); setIsSetupComplete(true);}}>
       Join Meeting
    </Button>
    </div>
  )
}

export default MeetingSetup