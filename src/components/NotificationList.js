
import React, { useState, useRef } from "react";
import NotificationItem from "examples/Items/NotificationItem";
import { useNotifications } from "context/NotificationContext";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import Badge from "@mui/material/Badge";


const NotificationList = ({ anchorEl, onClose, open, placement }) => {
  const { notifications } = useNotifications();
  // If anchorEl is provided, render as a popover only (for DashboardNavbar)
  if (typeof anchorEl !== 'undefined') {
    return (
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={onClose}
        anchorOrigin={placement || { vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { minWidth: 320, maxWidth: 400, p: 1, background: '#181c2a', color: '#fff' }
        }}
      >
        {notifications.length === 0 ? (
          <div style={{ padding: 16, textAlign: 'center', color: '#bfc6e0' }}>No notifications</div>
        ) : (
          notifications.map((n) => (
            <NotificationItem
              key={n.id}
              color={n.color}
              image={n.image}
              title={n.title}
              date={n.date}
            />
          ))
        )}
      </Popover>
    );
  }
  // Otherwise, render the icon and popover (for DefaultNavbar)
  const [localAnchorEl, setLocalAnchorEl] = useState(null);
  const iconRef = useRef();
  const handleOpen = (event) => setLocalAnchorEl(event.currentTarget);
  const handleClose = () => setLocalAnchorEl(null);
  const localOpen = Boolean(localAnchorEl);
  return (
    <>
      <IconButton
        ref={iconRef}
        color="inherit"
        onClick={handleOpen}
        size="large"
        sx={{ ml: 1 }}
      >
        <Badge badgeContent={notifications.length} color="error">
          <span className="material-icons" style={{ fontSize: 24 }}>notifications</span>
        </Badge>
      </IconButton>
      <Popover
        open={localOpen}
        anchorEl={localAnchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { minWidth: 320, maxWidth: 400, p: 1, background: '#181c2a', color: '#fff' }
        }}
      >
        {notifications.length === 0 ? (
          <div style={{ padding: 16, textAlign: 'center', color: '#bfc6e0' }}>No notifications</div>
        ) : (
          notifications.map((n) => (
            <NotificationItem
              key={n.id}
              color={n.color}
              image={n.image}
              title={n.title}
              date={n.date}
            />
          ))
        )}
      </Popover>
    </>
  );
};

export default NotificationList;
