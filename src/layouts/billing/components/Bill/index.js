// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Icon from "@mui/material/Icon";

// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiButton from "components/VuiButton";
import linearGradient from "assets/theme/functions/linearGradient";
import colors from "assets/theme/base/colors";

function Bill({ name, company, email, vat, prescription, noGutter, onEdit, onDelete }) {
  const { gradients } = colors;
  const { bill } = gradients;

  return (
    <VuiBox
      component="li"
      display="flex"
      justifyContent="space-between"
      alignItems="flex-start"
      sx={{ background: linearGradient(bill.main, bill.state, bill.deg) }}
      borderRadius="lg"
      p="24px"
      mb={noGutter ? "0px" : "24px"}
      mt="20px"
    >
      <VuiBox width="100%" display="flex" flexDirection="column">
        <VuiBox
          display="flex"
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          flexDirection={{ xs: "column", sm: "row" }}
          mb="5px"
        >
          <VuiTypography
            variant="button"
            color="white"
            fontWeight="medium"
            textTransform="capitalize"
          >
            {name}
          </VuiTypography>

          <VuiBox
            display="flex"
            alignItems="center"
            mt={{ xs: 2, sm: 0 }}
            ml={{ xs: -1.5, sm: 0 }}
            sx={({ breakpoints }) => ({
              [breakpoints.only("sm")]: {
                flexDirection: "column",
              },
            })}
          >
            <VuiBox mr={1}>
              <VuiButton variant="text" color="error" onClick={onDelete}>
                <Icon sx={{ mr: "4px" }}>delete</Icon>&nbsp;DELETE
              </VuiButton>
            </VuiBox>
            <VuiButton variant="text" color="text" onClick={onEdit}>
              <Icon sx={{ mr: "4px" }}>edit</Icon>&nbsp;EDIT
            </VuiButton>
          </VuiBox>
        </VuiBox>
        <VuiBox mb={1} lineHeight={0}>
          <VuiTypography variant="caption" color="text">
            Address:&nbsp;&nbsp;&nbsp;
            <VuiTypography
              variant="caption"
              color="text"
              fontWeight="regular"
              textTransform="capitalize"
            >
              {company}
            </VuiTypography>
          </VuiTypography>
        </VuiBox>
        <VuiBox mb={1} lineHeight={0}>
          <VuiTypography variant="caption" color="text">
            Email:&nbsp;&nbsp;&nbsp;
            <VuiTypography variant="caption" fontWeight="regular" color="text">
              {email}
            </VuiTypography>
          </VuiTypography>
        </VuiBox>
        <VuiBox mb={1} lineHeight={0}>
          <VuiTypography variant="caption" color="text">
            Phone:&nbsp;&nbsp;&nbsp;
            <VuiTypography variant="caption" fontWeight="regular" color="text">
              {vat}
            </VuiTypography>
          </VuiTypography>
        </VuiBox>
        {prescription && (
          <VuiTypography variant="caption" color="text">
            Prescription to pick up:&nbsp;&nbsp;&nbsp;
            <VuiTypography variant="caption" fontWeight="regular" color="text">
              {prescription}
            </VuiTypography>
          </VuiTypography>
        )}
      </VuiBox>
    </VuiBox>
  );
}

// Setting default values for the props of Bill
Bill.defaultProps = {
  noGutter: false,
  prescription: '',
};

// Typechecking props for the Bill
Bill.propTypes = {
  name: PropTypes.string.isRequired,
  company: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  vat: PropTypes.string.isRequired,
  prescription: PropTypes.string,
  noGutter: PropTypes.bool,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

export default Bill;
