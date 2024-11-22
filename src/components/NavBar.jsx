import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import GavelIcon from "@mui/icons-material/GavelRounded";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthProvider";

const settings = [
  { page: "Dashboard", route: "/dashboard/products" },
  { page: "Profile", route: "/profile" },
];

function NavBar() {
  const { authUser, setAuthUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await axios.post("/api/auth/logout");
      return res.data;
    },
    onSuccess: (data) => {
      navigate("/");
      toast.success(data.message);
      setAuthUser(null);
      localStorage.removeItem("authUser");
    },
  });

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static" sx={{ mb: 2 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <GavelIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            onClick={() => navigate("/")}
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "HighlightText",
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            𝔅𝔦𝔡𝔑𝔢𝔱
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {/* Add menu items here if needed */}
            </Menu>
          </Box>
          <GavelIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "white",
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            𝔅𝔦𝔡𝔑𝔢𝔱
          </Typography>

          {/* Navigation buttons */}
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            <Button
              onClick={() => navigate("/products")}
              sx={{
                my: 2,
                color: "white",
                display: "block",
                transition: "transform 0.3s ease-in-out",
                "&:hover": { transform: "scale(1.2)" },
              }}
            >
              Products
            </Button>
            <Button
              onClick={() => navigate("/active-bids")}
              sx={{
                my: 2,
                color: "white",
                display: "block",
                transition: "transform 0.3s ease-in-out",
                "&:hover": { transform: "scale(1.2)" },
              }}
            >
              Active Bids
            </Button>
            {authUser && (
              <Button
                onClick={() => navigate("/orders")}
                sx={{
                  my: 2,
                  color: "white",
                  display: "block",
                  transition: "transform 0.3s ease-in-out",
                  "&:hover": { transform: "scale(1.2)" },
                }}
              >
                Orders
              </Button>
            )}
          </Box>

          {/* User profile and sign-in button */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {authUser ? (
              <>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar
                      alt={authUser.name}
                      src="/static/images/avatar/2.jpg"
                    />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => {
                    if (
                      setting.page === "Dashboard" &&
                      !authUser.roles.includes("Admin")
                    ) {
                      return null; // Hide "Dashboard" for non-admin users
                    }
                    return (
                      <MenuItem
                        key={setting.page}
                        onClick={() => {
                          navigate(setting.route);
                          handleCloseUserMenu();
                        }}
                      >
                        <Typography sx={{ textAlign: "center" }}>
                          {setting.page}
                        </Typography>
                      </MenuItem>
                    );
                  })}
                  <MenuItem onClick={handleCloseUserMenu}>
                    <Typography
                      sx={{ textAlign: "center" }}
                      onClick={() => mutation.mutate()}
                    >
                      Log Out
                    </Typography>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                onClick={() => navigate("/sign-in")}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                Sign In
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default NavBar;
