'use client'

import MeetingRoom from '@/components/ui/MeetingRoom';
import MeetingSetup from '@/components/ui/MeetingSetup';
import { useGetCallById } from '@/hooks/useGetcallById';
import { StreamCall, StreamTheme } from '@stream-io/video-react-sdk'

import React, { useState } from 'react'

const Meeting = ({params:{ id }}:{params:{ id: string } }) => {

  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const { call  } = useGetCallById(id);

  
  return (
    
    <main className='h-screen w-full '>
    <StreamCall call={call}>
      <StreamTheme>
        {!isSetupComplete ? (<MeetingSetup setIsSetupComplete={setIsSetupComplete}/>) : (<MeetingRoom />)}
      </StreamTheme>
    </StreamCall>
    </main>
  )
}

export default Meeting