import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import Product from "../components/Product";

const UpcomingAuctions = () => {
  const { data, isLoading } = useQuery("upcoming-auctions", async () => {
    const response = await axios.get("/api/auctions/upcoming");
    return response.data; // Assuming this returns an array of upcoming auctions
  });

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Upcoming Auctions</h3>
      <Grid container spacing={3}>
        {isLoading ? (
          <>
            <Grid item xs={12} sm={6} md={4}>
              <Skeleton variant="rectangular" height={200} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Skeleton variant="rectangular" height={200} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Skeleton variant="rectangular" height={200} />
            </Grid>
          </>
        ) : (
          data?.map((auction) => (
            <Grid item key={auction._id} xs={12} sm={6} md={4}>
              <Product product={auction} />{" "}
              {/* Render auction item as a product */}
            </Grid>
          ))
        )}
      </Grid>
    </div>
  );
};

export default UpcomingAuctions;
