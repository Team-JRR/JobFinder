import React, { useState, useEffect, useMemo, useCallback } from "react";
import SuggestedListEntry from "./SuggestedListEntry.jsx";
import AddBox from "@mui/icons-material/AddBox";
import {
  Grid,
  Container,
  Box,
  Button,
  Input,
  FormControl,
  InputLabel,
  Typography,
  Divider,
  Modal,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";

export default function SuggestedJobList({ jobs, getJobListings, userPrefs }) {
  /**
   * A variable that holds how many jobs should be rendered per page.
   * @type {number}
   * @name JOBS_PER_PAGE
   */
  const JOBS_PER_PAGE = 15;
  /**
   * A state variable that holds the current page number the user is viewing.
   * @type {number}
   * @name currentPage
   */
  const [currentPage, setCurrentPage] = useState(1);
  /**
   * A state variable that holds the current value of the Zip Code input field
   * @type {string}
   * @name userZipCodeInput
   */
  const [userZipCodeInput, setUserZipCodeInput] = useState("");
  /**
   * A state variable that holds the current value of the Zip Code input field
   * @type {string}
   * @name userZipCodeInput
   */
  const [selectedJob, setSelectedJob] = useState(null);

  // Fetch jobs initially
  useEffect(() => {
    getJobListings(userPrefs);
  }, [getJobListings, userPrefs]);

  // Handle zip code input
  const handleInputChange = (e) => {
    setUserZipCodeInput(e.target.value);
  };

  // handle apply change button
  const handleApplyChanges = useCallback(() => {
    getJobListings(userPrefs, userZipCodeInput);
    setCurrentPage(1); // reset to first page
  }, [getJobListings, userPrefs, userZipCodeInput]);

  // Compute jobs to display for the current page
  const jobsToRender = useMemo(() => {
    const start = (currentPage - 1) * JOBS_PER_PAGE;
    const end = start + JOBS_PER_PAGE;
    return jobs.slice(start, end);
  }, [jobs, currentPage]);

  // Pagination controls
  const goToNextPage = () => {
    if (currentPage * JOBS_PER_PAGE < jobs.length)
      setCurrentPage((prev) => prev + 1);
  };
  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 8, bgcolor: '#FDFBFB'}}>
        {/* Zip code input */}
        <Box sx={{ justifyContent: "flex-end", display: "flex" }}>
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 2, mr: "13px" }}
          >
            <FormControl>
              <InputLabel htmlFor="zip-code-input">Enter Zip Code</InputLabel>
              <Input
                id="zip-code-input"
                onChange={handleInputChange}
                value={userZipCodeInput}
              />
            </FormControl>
            <Button
              onClick={handleApplyChanges}
              variant="outlined"
              color="inherit"
              sx={{ color: '#f49645ff', borderColor: '#f49645ff ', backgroundColor: '#FDFBFB', borderWidth: 2 }}
            >
              Apply Changes
            </Button>
          </Box>
        </Box>

        {/* Job list */}
        <Box sx={{ mt: 1, height: "100%", width: "100%" }}>
          <Grid
            container
            className="job-list"
            sx={{ maxHeight: 645, minWidth: 0, minHeight: 0 }}
          >
            {jobs.length !== 0 ? (
              jobsToRender.map((job) => (
                <SuggestedListEntry
                  name={job.title}
                  link={job.redirect_url}
                  description={job.description}
                  location={`${job.location.area[3]}, ${job.location.area[1]}`}
                  key={job.id}
                  onClick={() => setSelectedJob(job)}
                />
              ))
            ) : (
              <img
                style={{ margin: "auto" }}
                src="https://cdn.pixabay.com/animation/2022/07/29/03/42/03-42-22-68_512.gif"
              />
            )}
          </Grid>
        </Box>

        {/* Pagination controls */}
        {jobs.length > JOBS_PER_PAGE && (
          <Box
            sx={{ display: "flex", justifyContent: "center", mt: 2, gap: 2 }}
          >
            <Button onClick={goToPreviousPage} disabled={currentPage === 1} sx={{ color: '#f49645ff'}}>
              Previous
            </Button>
            <Typography sx={{ display: "flex", alignItems: "center" }}>
              Page {currentPage}
            </Typography>
            <Button
              onClick={goToNextPage}
              disabled={currentPage * JOBS_PER_PAGE >= jobs.length}
              sx={{color: '#f49645ff'}}
            >
              Next
            </Button>
          </Box>
        )}
      </Container>

      {/* Single Modal for selected job */}
      {selectedJob && (
        <Modal
          open={true}
          onClose={() => setSelectedJob(null)}
          aria-labelledby="full-job-listing-view"
          aria-describedby="full-job-listing-view"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              flexDirection: "row",
            }}
          >
            <Card sx={{ width: "100%", height: "100%" }}>
              <CardContent>
                <Typography variant="h5" textAlign="center">
                  {selectedJob.title}
                </Typography>
              </CardContent>
              <Divider />
              <CardContent>
                <Typography variant="body1" textAlign="center" fontSize={24}>
                  {
                    selectedJob.description
                      .split("Job Purpose")[0]
                      .split("Why join this team?")[0]
                  }
                </Typography>
              </CardContent>
              <Divider />
              <CardActions
                sx={{
                  position: "relative",
                  p: 2,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    sx={{
                      mr: 1,
                      justifyContent: "center",
                      bgcolor: "#f49645ff"
                    }}
                    href={selectedJob.redirect_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="contained"
                    color="primary"
                    size="large"

                  >
                    Apply To Job
                  </Button>
                </Box>
              </CardActions>
            </Card>
          </Box>
        </Modal>
      )}
    </>
  );
}
