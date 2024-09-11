"use client";

import { useState } from "react";
import HomeCard from "./HomeCard";
import { useRouter } from "next/navigation";
import MeetingModal from "./MeetingModal";
import { useUser } from "@clerk/nextjs";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { Call } from "@stream-io/video-react-sdk";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "./textarea";
import ReactDatePicker from "react-datepicker";

const MeetingTypeList = () => {
  const router = useRouter();
  const [meetingState, setMeetingState] = useState<
    "isSheduleMeeting" | "isJoiningMeeting" | "isInstantMeeting" | undefined
  >();
  const { user } = useUser();
  const client = useStreamVideoClient();
  const [values, setValues] = useState({
    dateTime: new Date(),
    description: "",
    link: "",
  });

  const [callDetails, setcallDetails] = useState<Call>();
  const toast = useToast();

  const createMeeting = async () => {
    if (!user || !client) return;

    try {
      if (!values.dateTime) {
        toast.toast({
          title: "Please Select Date and Time",
        });
        return;
      }
      const id = crypto.randomUUID();
      const call = client.call("default", id);

      if (!call) throw new Error("Call not created");
      const startsAt =
        values.dateTime.toISOString() || new Date(Date.now()).toISOString();
      const description = values.description || "instant meeting";

      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description,
          },
        },
      });

      setcallDetails(call);
      if (!values.description) {
        router.push(`/meeting/${call.id}`);
      }

      toast.toast({
        title: "Meeting Created",
      });
    } catch (error) {
      console.log(error);
      toast.toast({
        title: "Faild to Create meeting",
      });
    }
  };

  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`
  return (
    <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      <HomeCard
        img="/icons/add-meeting.svg"
        title="New Meeting"
        description="Start am instant meeting"
        handleClick={() => setMeetingState("isInstantMeeting")}
        className="bg-orange-1"
      />

      <HomeCard
        img="/icons/schedule.svg"
        title="Schedule Meeting"
        description="Plan Your meeting"
        handleClick={() => setMeetingState("isSheduleMeeting")}
        className="bg-blue-1"
      />

      <HomeCard
        img="/icons/recordings.svg"
        title="View Recordings"
        description="Check Out of your recordings"
        handleClick={() => router.push("/recordings")}
        className="bg-purple-1"
      />

      <HomeCard
        img="/icons/join-meeting.svg"
        title="Join Meeting"
        description="Via invitation link"
        handleClick={() => setMeetingState("isJoiningMeeting")}
        className="bg-yellow-1"
      />

      {!callDetails ? (
        <MeetingModal
          isOpen={meetingState === "isSheduleMeeting"}
          onClose={() => setMeetingState(undefined)}
          title="Create Meeting"
          handleClick={createMeeting}
        >
          <div className="flex flex-col gap-2.5">
             <label className="text-base text-normal leading-[22px] text-sky-2"> Add a description</label>
             <Textarea className="border-none bg-dark-3 "
             onChange={(e) => setValues({ ...values, description: e.target.value })} />
          </div>
           <div className='flex w-full flex-col gap-2.5'>
           <label className="text-base text-normal leading-[22px] text-sky-2"> Select Date and Time</label>
           <ReactDatePicker 
              selected = {values.dateTime}
              onChange ={(date => setValues({ ...values, dateTime: date! }))}
              showTimeSelect
              timeIntervals={15}
              timeCaption="Time"
              dateFormat ="MMMM d, yyyy h:mm aa"
              className="w-full rounded  bg-dark-3 p-2 focus:outline-none"
           />
           </div>
        </MeetingModal>
      ) : (
        <MeetingModal
          isOpen={meetingState === "isSheduleMeeting"}
          onClose={() => setMeetingState(undefined)}
          title="Meeting Created"
          className="text-center"
          handleClick={() => {
            navigator.clipboard.writeText(meetingLink);
            toast.toast({
              title: "Meeting link copied to clipboard",
            })
          }}
          image="/icons/checked.svg"
          butoonIcon="/icons/copy.svg"
          buttonText = "Copy Link"
        />
      )}

      <MeetingModal
        isOpen={meetingState === "isInstantMeeting"}
        onClose={() => setMeetingState(undefined)}
        title="Start an Instant Meeting"
        className="text-center"
        buttonText="Start Meeting"
        handleClick={createMeeting}
      />
    </section>
  );
};

export default MeetingTypeList;
