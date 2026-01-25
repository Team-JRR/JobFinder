import React from "react";

import StatusSection from "./StatusSection.jsx";

//Define columns names
const jobStatus = ["applied", "interviewing", "offer", "rejected"];

//Accepts props from dashboard
export default function JobList({jobs, onDelete, currentUser, onUpdate}){
  return(
    //Side by side flex box style
    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
      {/* for each status create a column */}
      {jobStatus.map((status) => {
       return <StatusSection
       currentUser={currentUser}
       // ^ this is so we can pass the current user data down to the JobListEntries.
       key={status}
       //column label is status name
       status={status}
       //what the column shows
       //filter jobs and get ones w/ status matching column name
       jobs={jobs.filter(job => job.status === status)}
       onDelete={onDelete}
       onUpdate={onUpdate}
       />
      })}
    </div>
  )

}
