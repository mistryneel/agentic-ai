import axios from "axios";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export type EventType = {
  data: string;
  timestamp: string;
};

export type NamedUrl = {
  name: string;
  url:string;
}

export type PositionType = {
  company: string;
  position: string;
  name: string;
  blog_articles_urls: string[];
  youtube_interviews_urls: NamedUrl[];
}

export const useCrewJob = () => {
  const [running, setRunning] = useState(false);
  const [companies, setCompanies] = useState<string[]>([]);
  const [positions, setPositions] = useState<string[]>([]);
  const [events, setEvents] = useState<EventType[]>([]);
  const [positionInfoList, setPositionInfoList] = useState<PositionType[]>([]);
  const [currentJobId, setCurrentJobId] = useState<string>("");

  useEffect(() => {
    let intervalId: number;

    const fetchJobStatus = async () => {

      try {
        const response = await axios.get<{
          status: string;
          events: EventType[];
          result: { positions: PositionType[]};
        }>(`${process.env.NEXT_PUBLIC_API_URL}/api/crew/${currentJobId}`);

        console.log(response.data);
        const { events: fetchedEvents, result, status } = response.data;
        setEvents(fetchedEvents);
        if (result) {
          console.log(result);
          setPositionInfoList(result.positions);
        }
        if (status === "COMPLETE" || status === "ERROR") {
          if (intervalId) {
            clearInterval(intervalId);
          }
          setRunning(false);
          toast.success("Job completed");
        }
      } catch (error) {
        if (intervalId) {
          clearInterval(intervalId);
        }
        toast.error("Job failed to start");
        console.error(error);
        setCurrentJobId("");
      }
    }
    if (currentJobId !== "") {
      intervalId = setInterval(fetchJobStatus, 1000) as unknown as number;
    }
  }, [currentJobId]);

  const startJob = async () => {
    setEvents([]);
    setPositionInfoList([]);
    setRunning(true);

    try {

      const response = await axios.post<{ job_id: string }>(`${process.env.NEXT_PUBLIC_API_URL}/api/crew`, {
        companies,
        positions,
      });

      toast.success("Job started");
      console.log(response.data);
      setCurrentJobId(response.data.job_id);
    } catch(error) {
      toast.error("Job failed to start");
      console.error(error);
      setCurrentJobId("");
    }
  };

  return { companies, positions, setCompanies, setPositions, startJob, running, events, positionInfoList };
};