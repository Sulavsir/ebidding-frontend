import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";

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

const SignUpContainer = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
}));

// Validation Schema
const schema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters long")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Please confirm your password"),
  roles: yup.string().required("Role selection is required"),
  personalInterests: yup
    .array()
    .of(yup.string().required("Interest cannot be empty"))
    .min(1, "Please add at least one interest"),
  profileImage: yup
    .mixed()
    .required("Profile image is required")
    .test("fileType", "Unsupported file format", (value) => {
      return value && ["image/jpeg", "image/png"].includes(value[0]?.type);
    }),
});

export default function SignUp() {
  const navigate = useNavigate();

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      roles: "",
      personalInterests: [""],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "personalInterests",
  });

  // useMutation for sign-up
  const mutation = useMutation({
    mutationFn: async (data) => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("confirmPassword", data.confirmPassword);
      data.personalInterests.forEach((interest) =>
        formData.append("personalInterests[]", interest)
      );
      formData.append("roles", data.roles);
      formData.append("profileImage", data.profileImage[0]);

      const response = await axios.post(
        "http://localhost:3003/api/auth/sign-up",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      return response.data;
    },
    onSuccess: (data) => {
      toast.success("User Signed up Successfully");
      console.log("Sign-Up Successful:", data);
      navigate("/sign-in");
    },
    onError: (error) => {
      console.error(
        "Error during sign-up:",
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
      <SignUpContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <Typography>𝔅𝔦𝔡𝔑𝔢𝔱</Typography>
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
          >
            Sign Up
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
              <FormLabel htmlFor="name">Full Name</FormLabel>
              <TextField
                id="name"
                type="text"
                placeholder="John Doe"
                required
                fullWidth
                error={Boolean(errors?.name)}
                helperText={errors?.name?.message}
                {...register("name")}
              />
            </FormControl>
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
            <FormControl>
              <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
              <TextField
                name="confirmPassword"
                type="password"
                placeholder="••••••"
                required
                fullWidth
                error={Boolean(errors?.confirmPassword)}
                helperText={errors?.confirmPassword?.message}
                {...register("confirmPassword")}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Role</FormLabel>
              <RadioGroup
                row
                value={watch("roles")}
                onChange={(e) => setValue("roles", e.target.value)}
              >
                <FormControlLabel
                  value="Sales"
                  control={<Radio />}
                  label="Sales"
                />
                <FormControlLabel
                  value="Customer"
                  control={<Radio />}
                  label="Customer"
                />
              </RadioGroup>
              {errors?.roles && (
                <Typography color="error">{errors.roles.message}</Typography>
              )}
            </FormControl>
            <FormControl>
              <FormLabel>Personal Interests</FormLabel>
              {fields.map((field, index) => (
                <Box
                  key={field.id}
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <TextField
                    placeholder="Enter interest"
                    {...register(`personalInterests.${index}`)}
                    error={Boolean(errors?.personalInterests?.[index])}
                    helperText={errors?.personalInterests?.[index]?.message}
                  />
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => remove(index)}
                  >
                    Remove
                  </Button>
                </Box>
              ))}
              <Button variant="outlined" onClick={() => append("")}>
                Add Interest
              </Button>
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="profileImage">Profile Image</FormLabel>
              <input
                type="file"
                id="profileImage"
                accept="image/*"
                required
                {...register("profileImage")}
              />
              {errors?.profileImage && (
                <Typography color="error">
                  {errors.profileImage.message}
                </Typography>
              )}
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={mutation.isLoading}
            >
              {mutation.isLoading ? "Signing up..." : "Sign up"}
            </Button>
          </Box>
          <Divider>or</Divider>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography sx={{ textAlign: "center" }}>
              Already have an account?{" "}
              <Button
                variant="text"
                onClick={() => navigate("/sign-in")}
                sx={{ textTransform: "none", padding: 0 }}
              >
                Sign in
              </Button>
            </Typography>
          </Box>
        </Card>
      </SignUpContainer>
    </div>
  );
}
