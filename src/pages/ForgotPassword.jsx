import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

// Styled Components
const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "450px",
  },
}));

const ForgotPassword = () => {
  const navigate = useNavigate();

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // useMutation for handling the password reset request
  const mutation = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post(
        "http://localhost:3003/api/auth/forgot-password",
        data
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Password reset link sent to your email!");
      navigate("/sign-in");
    },
    onError: (error) => {
      toast.error("Error sending password reset link.");
      console.error(error);
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <div>
      <CssBaseline enableColorScheme />
      <Stack
        direction="column"
        justifyContent="space-between"
        sx={{ padding: 4 }}
      >
        <Card variant="outlined">
          <Typography variant="h4" textAlign="center" pb={3} color="darkblue">
            Forgot Password
          </Typography>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <FormControl fullWidth>
              <FormLabel htmlFor="email">Enter your email address</FormLabel>
              <TextField
                id="email"
                type="email"
                placeholder="your@email.com"
                required
                error={Boolean(errors?.email)}
                helperText={errors?.email?.message}
                {...register("email", {
                  required: "Email is required",
                  pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                })}
              />
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={mutation.isLoading}
            >
              {mutation.isLoading ? "Sending..." : "Send Password Reset Link"}
            </Button>
          </Box>
        </Card>
      </Stack>
    </div>
  );
};

export default ForgotPassword;
