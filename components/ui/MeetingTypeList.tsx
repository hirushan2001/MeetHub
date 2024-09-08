"use client"

import { useState } from 'react'
import HomeCard from './HomeCard'
import { useRouter } from 'next/navigation'
import MeetingModal from './MeetingModal'
import { useUser } from '@clerk/nextjs'
import { useStreamVideoClient } from '@stream-io/video-react-sdk';
import { Call } from '@stream-io/video-react-sdk';
import { useToast } from "@/hooks/use-toast"


const MeetingTypeList = () => {
    const router = useRouter()
    const [meetingState, setMeetingState] = useState<'isSheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined>()
    const {user} = useUser();
    const client = useStreamVideoClient();
    const [values , setValues] = useState({
      dateTime: new Date(),
      description: '',
      link: '',
    })

    const [callDetails, setcallDetails] = useState<Call>()
    const toast = useToast();

    const createMeeting = async () => {
      if(!user || !client) return;

      try{

      if(!values.dateTime) {
        toast.toast({
          title: "Please Select Date and Time",
        })
        return;
      }
       const id = crypto.randomUUID();
       const call = client.call('default', id);

       if(!call) throw new Error('Call not created'); 
       const startsAt = values.dateTime.toISOString() || new Date(Date.now()).toISOString();
       const description = values.description || 'instant meeting';

      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom:{
            description
          }
        }
      })

      setcallDetails(call);
      if(!values.description){
        router.push(`/meeting/${call.id}`);
      }

      toast.toast({
        title: "Meeting Created",
        })
      }catch(error){
        console.log(error);
        toast.toast({
          title: "Faild to Create meeting",
          })
      }
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