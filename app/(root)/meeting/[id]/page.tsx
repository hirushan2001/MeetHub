'use client'

import MeetingRoom from '@/components/ui/MeetingRoom';
import MeetingSetup from '@/components/ui/MeetingSetup';
import { useGetCallById } from '@/hooks/useGetcallById';
import { useUser } from '@clerk/nextjs'
import { StreamCall, StreamTheme } from '@stream-io/video-react-sdk'
import { Loader } from 'lucide-react';
import React, { useState } from 'react'

const Meeting = ({params:{ id }}:{params:{ id: string } }) => {

  const {user , isLoaded} = useUser();
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const { call , isCallLoading } = useGetCallById(id);

  if(!isLoaded || !isCallLoading) return <Loader />
  return (
    
    <main className='h-screen w-full '>
    <StreamCall call={call}>
      <StreamTheme>
        {!isSetupComplete ? (<MeetingSetup/>) : (<MeetingRoom />)}
      </StreamTheme>
    </StreamCall>
    </main>
  )
}

export default Meeting