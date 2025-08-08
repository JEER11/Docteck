// prop-types is a library for typechecking of props
import PropTypes from "prop-types";
import { IoDocumentText } from "react-icons/io5";
import "./modernScrollbar.css";

// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";

function Invoice({ date, medicine, price, info, noGutter, onInfoClick }) {
  return (
    <VuiBox
      component="li"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mb={noGutter ? "0px" : "32px"}
      className="modern-scrollbar"
    >
      <VuiBox lineHeight={1}>
        <VuiTypography display="block" variant="button" fontWeight="medium" color="white">
          {medicine}
        </VuiTypography>
        <VuiTypography variant="caption" fontWeight="regular" color="text">
          Pick-up Date: {date}
        </VuiTypography>
      </VuiBox>
      <VuiBox display="flex" alignItems="center">
        <VuiTypography variant="button" fontWeight="regular" color="text">
          {price}
        </VuiTypography>
        <VuiBox display="flex" alignItems="center" lineHeight={0} ml={3} sx={{ cursor: "pointer" }} onClick={() => onInfoClick && onInfoClick()}>
          <IoDocumentText color="#fff" size="15px" />
          <VuiTypography variant="button" fontWeight="medium" color="text">
            &nbsp;Info
          </VuiTypography>
        </VuiBox>
      </VuiBox>
    </VuiBox>
  );
}

// Setting default values for the props of Invoice
Invoice.defaultProps = {
  noGutter: false,
};

// Typechecking props for the Invoice
Invoice.propTypes = {
  date: PropTypes.string.isRequired,
  medicine: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  info: PropTypes.any,
  noGutter: PropTypes.bool,
  onInfoClick: PropTypes.func,
};

export default Invoice;
