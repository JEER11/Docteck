// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Icon from "@mui/material/Icon";

// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiButton from "components/VuiButton";

function Transaction({ color, icon, name, description, value, showConnector = false, isLast = false }) {
  return (
    <VuiBox key={name} component="li" py={1.25} pr={2} mb={1}>
      <VuiBox display="flex" justifyContent="space-between" alignItems="center">
        <VuiBox display="flex" alignItems="center">
          <VuiBox mr={2} position="relative">
            <VuiButton
              variant="outlined"
              color={color}
              sx={{ fontWeight: "bold", width: "35px", height: "35px" }}
              size="small"
              iconOnly
              circular
            >
              <Icon sx={{ fontWeight: "bold" }}>{icon}</Icon>
            </VuiButton>
            {showConnector && !isLast && (
              <VuiBox
                sx={{
                  position: 'absolute',
                  left: '50%',
                  top: 36,
                  bottom: -10,
                  transform: 'translateX(-50%)',
                  width: '2px',
                  background: 'linear-gradient(180deg, rgba(106,106,252,0.35) 0%, rgba(111,124,247,0.08) 100%)',
                  borderRadius: 1,
                  pointerEvents: 'none',
                }}
              />
            )}
          </VuiBox>
          <VuiBox display="flex" flexDirection="column">
            <VuiTypography variant="button" color="white" fontWeight="medium" gutterBottom>
              {name}
            </VuiTypography>
            <VuiTypography variant="caption" color="text">
              {description}
            </VuiTypography>
          </VuiBox>
        </VuiBox>
        <VuiTypography
          variant="button"
          color={color}
          fontWeight="medium"
          sx={({ breakpoints }) => ({
            [breakpoints.down("lg")]: {
              minWidth: "75px",
              ml: "12px",
            },
          })}
        >
          {value}
        </VuiTypography>
      </VuiBox>
    </VuiBox>
  );
}

// Typechecking props of the Transaction
Transaction.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "light",
    "dark",
    "text",
  ]).isRequired,
  icon: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  showConnector: PropTypes.bool,
  isLast: PropTypes.bool,
};

export default Transaction;
