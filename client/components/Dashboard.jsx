import React from "react";
import axios from "axios";

import { useState, useEffect } from "react";
import { Box, Button , Dialog, DialogContent, TextField, FormControl, InputLabel, MenuItem, DialogActions, Select, Alert } from "@mui/material"

import JobList from "./JobList.jsx"


//Need to import statuses or set them here
const jobStatus = ["applied", "interviewing", "offer", "rejected"]

export default function Dashboard ({ currentUser }) {
  /**
   * A state variable that holds the list of job objects.
   * Updating state triggers re-render for job-list when job state changes.
   * @type {array}
   * @name jobs
  */
  const [jobs, setJobs] = useState([]);

  /**
   * A state variable that controls visibility of 'Create Job' dialog.
   * (False = hidden || True = visible)
   * @type {boolean}
   * @name openDialog
  */
  const [openDialog, setDialog] = useState(false);

  /**
   * A state variable that stores title of new job being created.
   * @type {string}
   * @name title
 */
  const [title, setTitle ] = useState("");

  /**
   * A state variable that stores title of new job being created.
   * //default to 'applied'
   * @type {string}
   * @name status
 */
  const [status, setStatus] = useState("applied");

  /**
   * A state variable that stores state of job link associated with job posting.
   * @type {string}
   * @name link
 */
  const [link, setLink] = useState("");

  // REPORTING STUFF

  /**
   * @name reportCount
   * A state variable that changes based on the number of reports it read on example.com's usersReported array.
   * @type {number}
  */
  const [reportCount, setReportCount] = useState(0); // just used to tell the user how many people have reported the link.

  /**
   * @name reportWarning
   * A state variable that decides whether the warning that people have reported the input-ed link should show up. It requires that at least 3 people have reported the link for it to show up.
   * @type {boolean}
  */
  const [reportWarning, setReportWarning] = useState(false); // tells the app whether or not it needs to display a warning to the user. 

  /**
   * @name getReportedLink
   * getReportedLink gets the link at the provided URL, and sees if it's in the reported-links table of the database.
   * @param url 
   * @type {string}
   * @returns Returns an axios-get request, its errors are already catch-ed. You can .then off of it to do more with this function.
  */
  const getReportedLink = (url) => {
    return axios
      .get("/api/reported-links", url ? { params: { link: url } } : {})
      .catch((err) => {
        console.error(
          `Something went wrong while GETting a report. Url passed in: ${url}`,
          err
        );
      });
  };

  /**
   * @name handleClickOffInput
   * This function is to be run when the user clicks off an input element. This specific handler sets reportWarning to true if more than 3 users have reported the link provided.
   * @param inputValue - the current 'value' of the input element.
   * @type {string}
   * @returns Nothing.
  */
  const handleClickOffInput = (inputValue) => {
    getReportedLink(inputValue).then((reportObj) => {
      if(reportObj) {
        if (reportObj.data.usersReported.length >= 3) {
          setReportCount(reportObj.data.usersReported.length);
          setReportWarning(true);
        }
      }
    });
  };

  //useEffect hook runs on mount renders all user jobs to dashboard
  useEffect(() => {
    //call to backend endpoint
    axios.get('/api/jobs', /*{ withCredentials: true }*/)
    //get jobs data in response
    .then((job) => {
      //save job data in jobs state
      setJobs(job.data);
      //error handling
    }).catch((err) => {
      console.log(err);
    })

  }, []) //useEffect runs once after mount

  //handle creating a new job when user sets title and status and clicks save
  const CreateJob = () => {
    //post to backend to create a job w/ job data in req body
    axios.post('/api/jobs', {title, status, link} /*,{ withCredentials: true }*/)
    .then((job) => {//when job created
      //add newly created job to existing jobs, update its state
      setJobs(prevJob => [...prevJob, job.data]);
      //close dialog
      setDialog(false);
      //set input to the initial state
      setTitle("");
      //set dropdown to default
      setStatus("applied");
      //set link to init state
      setLink("")

    }).catch((err) => {
      console.log(err);
    });

  }

  //handle updating a job
   const updateJob = (jobId, newStatus) => {
    //put to backend to update a job w/ by id
    axios.put(`/api/jobs/${jobId}`, {
      //set current state of status to the new status
      status: newStatus
    }).then((updated) => {
       //get updated jobs data in response
      const updatedJob = updated.data;

      setJobs(prevJobs => prevJobs.map(job =>
        job._id === updatedJob._id ? updatedJob : job
    ))
    }).catch((err) => {
      console.log(err);
    });

  }

    //handle deleting a job
   const deleteJob = (jobId) => {
    //put to backend to update a job w/ by id
    axios.delete(`/api/jobs/${jobId}`, {
    }).then(() => {
      setJobs(prevJob =>
        prevJob.filter(job => job._id !== jobId)
      )

    }).catch((err) => {
      console.log(err);
    });
   }




  return (
    /*create job button */
    <Box>
      <Button variant="outlined" sx={{ color: '#f49645ff', borderColor: '#f49645ff ', backgroundColor: '#FDFBFB' }} onClick={() => setDialog(true)}> CREATE JOB</Button>
    {/* create job dialog controlled by open state, onClose sets state to original state, clicking outside closes*/}
      <Dialog open={openDialog} onClose={() => setDialog(false)}>
        <DialogContent>
          {/* text input displays default title, onChange sets title to keystroke */ }
          <TextField required label="Enter Job Title" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth sx={{mb: 2}} />
              <TextField label="Enter Job Link" value={link} onChange={(e) => setLink(e.target.value)} fullWidth sx={{mb: 2}} onBlur={(event) => {handleClickOffInput(event.target.value)}}/>
              {reportWarning ? (
                <Alert severity="warning">
                  Are you sure you want to add this job? {reportCount} users have reported this job listing as fraudulent.
                </Alert>
              ) : (
                <></>
              )}
            <FormControl fullWidth>
              <InputLabel>STATUS</InputLabel>
              {/*shows default status, onChange sets status to status */}
              <Select labelId="statusLabel" id="status-label" value={status} label='STATUS' onChange={(e) => setStatus(e.target.value)}>
                 {/*loop through status array*/}
                {jobStatus.map((stat) => (
                <MenuItem key={stat} value={stat}>{/*value = value selected when item chosen (statuses can be selected)*/}
                  {stat.toUpperCase()} {/*display status*/}
                </MenuItem>
              ))}
              </Select>
            </FormControl>
        </DialogContent>
        <DialogActions>
              {/*cancel job button reset to init state*/}
          <Button onClick={() => setDialog(false)}>CANCEL</Button>
          {/*save job button*/}
          <Button onClick={CreateJob} variant="contained" color="primary"> Save </Button>
        </DialogActions>
        </Dialog>
        <JobList jobs={jobs} onUpdate={updateJob} onDelete={deleteJob} />

    </Box>

  )

}

