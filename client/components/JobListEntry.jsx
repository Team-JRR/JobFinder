import React from "react"
import {Button} from "@mui/material"
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import LaunchTwoToneIcon from '@mui/icons-material/LaunchTwoTone';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
// We would not need this normally, but we need it to adapt based on report input.
import { useState } from "react";
import axios from "axios";

//Accepts job prop from statusSection
export default function JobListEntry ({job, currentUser, onDelete, onUpdate}){

  // REPORTING STUFF

  /**
   * @name warnMessage
   * A state variable that decides whether or not to tell the user that they already reported the link.
   * @type {boolean}
  */
  const [warnMessage, setWarnMessage] = useState(false);

  /**
   * @name successMessage
   * A state variable that decides whether or not to tell the user that the report went through successfully.
   * @type {boolean}
  */
  const [successMessage, setSuccessMessage] = useState(false);

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
   * @name postReport
   * postReport posts the report to the database if the current user is the first one to ever report it.
   * @param url 
   * @type {string}
   * @param userID 
   * @type {string}
   * @returns Returns an axios-post request, its errors are already catch-ed. You can .then off of it to do more with this function.
  */
    const postReport = (url, userID) => {
      return axios
        .post("/api/reported-links", {
          report: {
            url,
            usersReported: [userID],
          },
        })
        .catch((err) => {
          console.error("Something went wrong while making a new report: ", err);
        });
    };
  
  /**
   * @name patchReport
   * patchReport adds the passed in userID to the report, if it wasn't there already.
   * @param url 
   * @type {string}
   * @param userID
   * @type {string}
   * @returns Returns an axios-patch request, its errors are already catch-ed. You can .then off of it to do more with this function.
  */
    const patchReport = (url, userID) => {
      return axios
        .patch("/api/reported-links", {
          user: userID,
          link: url,
        })
        .catch((err) => {
          console.error(
            "Something went wrong while adding the user to the report: ",
            err
          );
        });
    };

    /**
     * @name handleReportSubmission
     * This function checks if the link has ever been reported. If it hasn't, it posts the users request, and if it has, it patches your user into the request.
     * The function updates successMessage or warnMessage based on the output. 
     * If the user has already reported this link, warnMessage is true. 
     * If they haven't and the request worked, it sets successMessage to true.
     * @param reportedUrl - the url that is being reported.
     * @type {string}
     * @returns Nothing.
  */
    const handleReportSubmission = (reportedUrl) => {

      // first, it checks if the link has ever been reported...
      getReportedLink(reportedUrl).then((reportObj) => {
        if (reportObj) {
          // if it has...
          if (reportObj.data.usersReported.includes(currentUser._id)) {
            // has the user already reported it?
            // if so, display a message saying that they have already reported this link.
            setWarnMessage(true);
            setSuccessMessage(false);
          } else {
            // if not...
            // make a PATCH request, and send the current userID and related link.
            patchReport(job.link, currentUser._id).then(() => {
              // (for this example, the link will always be example.com, but really it would be attatched to the job that the report button is attatched to.)
              // once the request is complete, display the success message.
              setSuccessMessage(true);
            });
          }
        } else {
          // if it has not...
          postReport(job.link, currentUser._id).then(() => {
            // make a POST request to post the new report.
            // once the post request has gone through, display the success message.
            setSuccessMessage(true);
          });
        }
      });
    };

  return (
    <div style={{border: "1px solid #ddd", padding: 5, marginBottom: 5, borderRadius: 4}}>
      {`${'Added Job: '}`}{job.title}
      <Button  color="error" onClick={() => onDelete(job._id)} sx={{ borderRadius: '1000px' }}><DeleteForeverOutlinedIcon fontSize="medium"/></Button>
      {job.link && (<a href={job.link}style={{ fontSize: 60 }}><LaunchTwoToneIcon fontSize="small" color="default"/></a>)}
      {/* {job.link && (<a href={job.link} target="_blank" rel="noopener noreferrer" style={{ fontSize: 15 }}>View Job Posting</a>)} */}
      <Stack direction="row" divider={<Divider orientation="vertical" flexItem />} spacing={1}>
      {<Button variant="outlined" sx={{ color: '#f49645ff', borderColor: '#f49645ff'}} onClick={() => onUpdate(job._id, 'interviewing')}> Move to Interviewing</Button>}
      {<Button variant="outlined" sx={{ color: '#f49645ff', borderColor: '#f49645ff'}} onClick={() => onUpdate(job._id, 'applied')}> Move to Applied</Button>}
      {<Button variant="outlined" sx={{ color: '#f49645ff', borderColor: '#f49645ff'}} onClick={() => onUpdate(job._id, 'offer')}> Move to Offer</Button>}
      {<Button variant="outlined" sx={{ color: '#f49645ff', borderColor: '#f49645ff'}} onClick={() => onUpdate(job._id, 'rejected')}> Move to Rejected</Button>}
      </Stack>

      <div>
        <Button variant="outlined"
        sx={{ color: 'rgb(244, 107, 69)', borderColor: 'rgb(239, 2, 2)'}}
            onClick={(event) => {
              handleReportSubmission(job.link);
            }}
          >
            Report Job
          </Button>
          {warnMessage ? (
            <p id="report-warning-alreadysent">
              You have already reported this link. Another report was not sent.
            </p>
          ) : (
            <></>
          )}
          {successMessage ? (
            <p id="report-confirm">
              Thanks you for you input! We have saved your report.
            </p>
          ) : (
            <></>
          )}
      </div>
    </div>
  )
}