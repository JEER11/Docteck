// prop-types is a library for typechecking of props
import PropTypes from "prop-types";
import { IoDocumentText } from "react-icons/io5";
import "./modernScrollbar.css";

// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";

// Format date helpers from common inputs
function formatMonthDay(dateStr) {
  if (!dateStr) return "";
  try {
    // Handle ISO format: YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
      const [y, m, d] = dateStr.split("-").map(Number);
      const month = new Date(Date.UTC(y, m - 1, d)).toLocaleString(undefined, { month: "long" });
      const day = String(d).padStart(2, "0");
      return `${month}, ${day}`;
    }
    // Handle formats like "July, 01, 2025" or "July 01, 2025"
    const match = dateStr.match(/([A-Za-z]+)[,\s]+(\d{1,2})/);
    if (match) {
      const month = match[1];
      const day = match[2].padStart(2, "0");
      return `${month}, ${day}`;
    }
    // Fallback: try native Date parsing
    const parsed = new Date(dateStr);
    if (!isNaN(parsed.getTime())) {
      const month = parsed.toLocaleString(undefined, { month: "long" });
      const day = String(parsed.getDate()).padStart(2, "0");
      return `${month}, ${day}`;
    }
  } catch (e) {
    // ignore and fall through
  }
  return dateStr; // If unrecognized, return as-is
}

function formatMonthDayYear(dateStr) {
  if (!dateStr) return "";
  try {
    if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
      const [y, m, d] = dateStr.split("-").map(Number);
      const dt = new Date(Date.UTC(y, m - 1, d));
      const month = dt.toLocaleString(undefined, { month: "long" });
      const day = String(d).padStart(2, "0");
      return `${month}, ${day}, ${y}`;
    }
    const match = dateStr.match(/([A-Za-z]+)[,\s]+(\d{1,2})[,\s]+(\d{4})/);
    if (match) {
      const month = match[1];
      const day = match[2].padStart(2, "0");
      const year = match[3];
      return `${month}, ${day}, ${year}`;
    }
    const parsed = new Date(dateStr);
    if (!isNaN(parsed.getTime())) {
      const month = parsed.toLocaleString(undefined, { month: "long" });
      const day = String(parsed.getDate()).padStart(2, "0");
      const year = parsed.getFullYear();
      return `${month}, ${day}, ${year}`;
    }
  } catch (e) {}
  return dateStr;
}

function Invoice({ date, medicine, price, info, noGutter, onInfoClick, showYear = true }) {
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
          Pick-up: {showYear ? formatMonthDayYear(date) : formatMonthDay(date)}
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
  showYear: PropTypes.bool,
};

export default Invoice;
