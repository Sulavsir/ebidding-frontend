import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import Alert from "@mui/material/Alert";

const schema = yup
  .object({
    name: yup.string().required(),
    price: yup.number().required(),
  })
  .required();

export default function ProductForm() {
  const { productId } = useParams();
  console.log({ productId });
  const navigate = useNavigate();

  const { data: product } = useQuery({
    queryKey: ["products", { productId }],
    queryFn: async () => {
      const res = await axios.get(`/api/products/${productId}`);
      return res.data.data;
    },
    enabled: Boolean(productId),
  });

  const mutation = useMutation({
    mutationFn: async (data) => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("price", data.price);
      formData.append("image", data.image[0]);
      formData.append("featured", data.featured === "yes" ? true : false);

      if (productId) {
        const res = await axios.patch(`/api/products/${productId}`, formData);
        return res.data;
      }

      const res = await axios.post("/api/products", formData);
      return res.data;
    },
    onSuccess: (data) => {
      navigate("/dashboard/products");
      toast.success(data.message);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  if (product) {
    setValue("name", product.name);
    setValue("price", product.price);
    setValue("featured", product.featured ? "yes" : "no");
  }

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  const action = productId ? "Edit" : "Add";

  return (
    <Stack
      sx={{ width: "80%", mx: "auto" }}
      direction="column"
      justifyContent="space-between"
    >
      <Card sx={{ p: 10 }} variant="outlined">
        <Typography
          component="h1"
          variant="h4"
          sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
        >
          {action} Product
        </Typography>
        {mutation.error && (
          <Alert sx={{ my: 2 }} severity="error">
            {mutation.error.response.data.message}
          </Alert>
        )}
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
            <FormLabel htmlFor="name">Image</FormLabel>
            <input type="file" {...register("image")} />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="name">Name</FormLabel>
            <TextField
              id="name"
              type="name"
              name="name"
              placeholder="Your Product name"
              autoComplete="name"
              autoFocus
              fullWidth
              variant="outlined"
              error={Boolean(errors?.name?.message)}
              helperText={errors?.name?.message}
              sx={{ ariaLabel: "name" }}
              {...register("name")}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="price">price</FormLabel>
            <TextField
              id="price"
              type="number"
              name="price"
              placeholder="Price in $"
              autoComplete="price"
              autoFocus
              fullWidth
              variant="outlined"
              error={Boolean(errors?.price?.message)}
              helperText={errors?.price?.message}
              sx={{ ariaLabel: "price" }}
              {...register("price")}
            />
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="featured">Gets Featured</FormLabel>
            <Select
              id="featured"
              name="featured"
              fullWidth
              variant="outlined"
              defaultValue="no"
              {...register("featured")}
              error={Boolean(errors?.featured?.message)}
            >
              <MenuItem value="yes">Yes</MenuItem>
              <MenuItem value="no">No</MenuItem>
            </Select>
            <Typography variant="body2" color="error">
              {errors?.featured?.message}
            </Typography>
          </FormControl>

          <Button type="submit" fullWidth variant="contained">
            {action} Product
          </Button>
        </Box>
      </Card>
    </Stack>
  );
}
