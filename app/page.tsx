"use client";

import { EventLog } from "@/components/EventLogs";
import { FinalOutput } from "@/components/FinalOutput";
import InputSection from "@/components/InputSection";
import { useCrewJob } from "@/hooks/useCrewJob";

export default function Home() {
  const { 
    companies, 
    positions, 
    setCompanies, 
    setPositions, 
    startJob, 
    running,
    events,
    positionInfoList
  } = useCrewJob();

  return (
    <div className="bg-white min-h-screen text-black">
      <div className="flex">
        <div className="w-1/3 p-4">
          <InputSection 
            title="Companies" 
            placeholder="Search for companies" 
            data={companies} 
            setData={setCompanies} 
          />
          <InputSection 
            title="Positions" 
            placeholder="Search for positions" 
            data={positions} 
            setData={setPositions} 
          />
        </div>
        <div className="w-2/3 p-4 flex flex-col">
          <div className="flex justify-between items-center mb-4">  
            <h2 className="text-2xl font-bold">Output</h2>
            <button 
              disabled={running} 
              onClick={() => startJob()} 
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              {running ? "Stop" : "Start"}
            </button>
          </div>
          <FinalOutput positionInfoList={positionInfoList} />
          <EventLog events={events} />
        </div>
      </div>
    </div>
  );
}
