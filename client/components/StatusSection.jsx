
import React from "react"
import JobListEntry from "./JobListEntry.jsx";

//Accepts jobs and status props
export default function StatusSection({status, jobs, onDelete, onUpdate, currentUser}){
  return(
    <div style={{ flex: 1, margin: "0 10px", border: "1px solid #ccc", padding: 10 }}>
      <h3>{status[0].toUpperCase() + status.slice(1)}</h3>
      {/*map over jobs, make sure jobs is defined*/}
      {(jobs).map((job) => {
         {/*render one entry, pass one entry(job) down as prop, set unique key  */}
        return <JobListEntry key={job._id} job={job} onDelete={onDelete} onUpdate={onUpdate} currentUser={currentUser}/>
      })}
    </div>
  )
}
