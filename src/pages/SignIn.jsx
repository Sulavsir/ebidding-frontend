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
import * as yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
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
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
}));

// Validation Schema
const schema = yup.object({
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

export default function SignIn() {
  const navigate = useNavigate();

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // useMutation for sign-in
  const mutation = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post(
        "http://localhost:3003/api/auth/sign-in",
        data
      );

      return response.data;
    },
    onSuccess: (data) => {
      console.log("Sign-In Successful:", data);
      toast.success("User Signed in Successfully !");
      navigate("/dashboard"); // Adjust the route as needed
    },
    onError: (error) => {
      toast.error("Invalid fields");

      console.error(
        "Error during sign-in:",
        error.response?.data?.message || error.message
      );
    },
  });

  const onSubmit = (data) => {
    console.log("Form Data:", data);
    mutation.mutate(data);
  };

  return (
    <div>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <Typography variant="h4" textAlign="center" pb={3} color="darkblue">
            Welcome To 𝔅𝔦𝔡𝔑𝔢𝔱
          </Typography>
          <Typography
            color="blue"
            component="h1"
            variant="h4"
            sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
          >
            Sign In here!
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              gap: 2,
            }}
          >
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                id="email"
                type="email"
                placeholder="your@email.com"
                required
                fullWidth
                error={Boolean(errors?.email)}
                helperText={errors?.email?.message}
                {...register("email")}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                name="password"
                type="password"
                placeholder="••••••"
                required
                fullWidth
                error={Boolean(errors?.password)}
                helperText={errors?.password?.message}
                {...register("password")}
              />
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={mutation.isLoading}
            >
              {mutation.isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography sx={{ textAlign: "center" }}>
              Don't have an account?{" "}
              <Button
                variant="text"
                onClick={() => navigate("/sign-up")}
                sx={{ textTransform: "none", padding: 0 }}
              >
                Sign up
              </Button>
            </Typography>

            {/* Forgot Password Link */}
            <Typography sx={{ textAlign: "center" }}>
              <Button
                variant="text"
                onClick={() => navigate("/forgot-password")} // Change the path as needed
                sx={{ textTransform: "none", padding: 0 }}
              >
                Forgot Password?
              </Button>
            </Typography>
          </Box>
        </Card>
      </SignInContainer>
    </div>
  );
}
