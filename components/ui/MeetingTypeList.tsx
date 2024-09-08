"use client"

import Image from 'next/image'
import { useState } from 'react'
import HomeCard from './HomeCard'
import { useRouter } from 'next/navigation'
import MeetingModal from './MeetingModal'

const MeetingTypeList = () => {
    const router = useRouter()
    const [meetingState, setMeetingState] = useState<'isSheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined>()

    const createMeeting = () => {
      
    }
  return (
    <section className='grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4'>
       <HomeCard
       img="/icons/add-meeting.svg"
       title="New Meeting"
       description="Start am instant meeting"
       handleClick={() => setMeetingState('isInstantMeeting')}
       className="bg-orange-1"
       />

       <HomeCard
       img="/icons/schedule.svg"
       title="Schedule Meeting"
       description="Plan Your meeting"
       handleClick={() => setMeetingState('isSheduleMeeting')}
       className="bg-blue-1"

       />

       <HomeCard
       img="/icons/recordings.svg"
       title="View Recordings"
       description="Check Out of your recordings"
       handleClick={() => router.push('/recordings')}
       className="bg-purple-1"
       />

       
       <HomeCard
       img="/icons/join-meeting.svg"
       title="Join Meeting"
       description="Via invitation link"
       handleClick={() => setMeetingState('isJoiningMeeting')}
       className="bg-yellow-1"
       />

       <MeetingModal 
        isOpen={meetingState === 'isInstantMeeting'}
        onClose={() => setMeetingState(undefined)}
        title="Start Meeting"
        className="text-center"
        buttonText="Start Meeting"
        handleClick={createMeeting} 
        />

    </section>
  )
}

export default MeetingTypeList