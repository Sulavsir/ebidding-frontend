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
import { useParams, useNavigate } from "react-router-dom";
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

const ResetPassword = () => {
  const { resetToken } = useParams(); // Get the reset token from the URL
  const navigate = useNavigate();

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  // Use Mutation for resetting the password
  const mutation = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post(
        `http://localhost:3003/api/auth/reset-password/${resetToken}`,
        { newPassword: data.password }
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Password has been successfully reset!");
      navigate("/sign-in"); // Redirect to the login page
    },
    onError: (error) => {
      toast.error("Error resetting password.");
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
            Reset Password
          </Typography>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <FormControl fullWidth>
              <FormLabel htmlFor="password">New Password</FormLabel>
              <TextField
                id="password"
                type="password"
                required
                error={Boolean(errors?.password)}
                helperText={errors?.password?.message}
                {...register("password", { required: "Password is required" })}
              />
            </FormControl>

            <FormControl fullWidth>
              <FormLabel htmlFor="confirmPassword">
                Confirm New Password
              </FormLabel>
              <TextField
                id="confirmPassword"
                type="password"
                required
                error={Boolean(errors?.confirmPassword)}
                helperText={errors?.confirmPassword?.message}
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === watch("password") || "Passwords do not match",
                })}
              />
            </FormControl>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={mutation.isLoading}
            >
              {mutation.isLoading ? "Resetting..." : "Reset Password"}
            </Button>
          </Box>
        </Card>
      </Stack>
    </div>
  );
};

export default ResetPassword;
