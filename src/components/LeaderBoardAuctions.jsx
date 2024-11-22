import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";

const Leaderboard = () => {
  const { data, isLoading } = useQuery("leaderboard", async () => {
    const response = await axios.get("/api/leaderboard");
    return response.data; // Assuming this returns a list of leaderboard entries
  });

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Leaderboard</h3>
      <Grid container spacing={3}>
        {isLoading ? (
          <>
            <Grid item xs={12} sm={6} md={4}>
              <Skeleton variant="rectangular" height={100} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Skeleton variant="rectangular" height={100} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Skeleton variant="rectangular" height={100} />
            </Grid>
          </>
        ) : (
          data?.map((entry) => (
            <Grid item key={entry._id} xs={12} sm={6} md={4}>
              <div className="leaderboard-entry">
                <p>{entry.username}</p>
                <p>{entry.bidsCount} Bids</p>
              </div>
            </Grid>
          ))
        )}
      </Grid>
    </div>
  );
};

export default Leaderboard;
