// prop-types is a library for typechecking of props
// @mui material components
import Card from "@mui/material/Card";
import Jelly1 from "assets/images/Jelly1.jpg";
// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import PropTypes from "prop-types";
import { FiEdit2, FiPlus } from "react-icons/fi";
import React, { useState } from "react";

import ReactDOM from "react-dom";

function MasterCard({ insuranceName, memberName, memberId, monthlyBill, onAdd, onEdit, onDelete }) {
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [form, setForm] = useState({
    insuranceName: "",
    memberName: "",
    memberId: "",
    monthlyBill: ""
  });

  const handleAddClick = (e) => {
    e.stopPropagation();
    setForm({ insuranceName: "", memberName: "", memberId: "", monthlyBill: "" });
    setOpenAdd(true);
  };
  const handleEditClick = (e) => {
    e.stopPropagation();
    setForm({ insuranceName, memberName, memberId, monthlyBill });
    setOpenEdit(true);
  };
  const handleClose = (e) => {
    if (e) e.stopPropagation();
    setOpenAdd(false);
    setOpenEdit(false);
  };
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (onAdd) onAdd(form);
    handleClose(e);
  };
  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (onEdit) onEdit(form);
    handleClose(e);
  };
  const handleDelete = (e) => {
    e.preventDefault();
    if (onDelete) onDelete(form);
    handleClose(e);
  };

  // Helper to render modal in portal
  const renderModal = (content) => {
    return ReactDOM.createPortal(
      content,
      document.body
    );
  };

  // List of 100+ insurance company names
  const INSURANCE_OPTIONS = [
    "Aetna", "Blue Cross Blue Shield", "Cigna", "UnitedHealthcare", "Humana", "Kaiser Permanente", "Centene", "Molina Healthcare", "Anthem", "WellCare",
    "Health Net", "Oscar Health", "Ambetter", "Medica", "Bright Health", "CareSource", "EmblemHealth", "Highmark", "Premera Blue Cross", "Regence Blue Shield",
    "Tufts Health Plan", "Harvard Pilgrim", "Geisinger", "UPMC Health Plan", "Independence Blue Cross", "Priority Health", "HealthPartners", "Excellus BCBS", "Blue Shield of California", "Florida Blue",
    "Blue Cross Blue Shield of Michigan", "Blue Cross Blue Shield of Texas", "Blue Cross Blue Shield of Illinois", "Blue Cross Blue Shield of Massachusetts", "Blue Cross Blue Shield of North Carolina",
    "Blue Cross Blue Shield of Tennessee", "Blue Cross Blue Shield of Arizona", "Blue Cross Blue Shield of Alabama", "Blue Cross Blue Shield of Louisiana", "Blue Cross Blue Shield of Minnesota",
    "Blue Cross Blue Shield of Kansas", "Blue Cross Blue Shield of Oklahoma", "Blue Cross Blue Shield of Nebraska", "Blue Cross Blue Shield of Vermont", "Blue Cross Blue Shield of Montana",
    "Blue Cross Blue Shield of South Carolina", "Blue Cross Blue Shield of Georgia", "Blue Cross Blue Shield of Arkansas", "Blue Cross Blue Shield of Mississippi", "Blue Cross Blue Shield of New Mexico",
    "Blue Cross Blue Shield of Rhode Island", "Blue Cross Blue Shield of Wyoming", "Blue Cross Blue Shield of Delaware", "Blue Cross Blue Shield of Idaho", "Blue Cross Blue Shield of Iowa",
    "Blue Cross Blue Shield of Kansas City", "Blue Cross Blue Shield of Western New York", "Blue Cross Blue Shield of Northeastern New York", "Blue Cross Blue Shield of Hawaii", "Blue Cross Blue Shield of Alaska",
    "Blue Cross Blue Shield of Oregon", "Blue Cross Blue Shield of Utah", "Blue Cross Blue Shield of Nevada", "Blue Cross Blue Shield of Colorado", "Blue Cross Blue Shield of Pennsylvania",
    "Blue Cross Blue Shield of Maryland", "Blue Cross Blue Shield of Virginia", "Blue Cross Blue Shield of West Virginia", "Blue Cross Blue Shield of Kentucky", "Blue Cross Blue Shield of Indiana",
    "Blue Cross Blue Shield of Ohio", "Blue Cross Blue Shield of New Jersey", "Blue Cross Blue Shield of Connecticut", "Blue Cross Blue Shield of New Hampshire", "Blue Cross Blue Shield of Maine",
    "Blue Cross Blue Shield of Vermont", "Blue Cross Blue Shield of South Dakota", "Blue Cross Blue Shield of North Dakota", "Blue Cross Blue Shield of Montana", "Blue Cross Blue Shield of Oklahoma",
    "Blue Cross Blue Shield of Puerto Rico", "Blue Cross Blue Shield of Virgin Islands", "Blue Cross Blue Shield of Guam", "Blue Cross Blue Shield of Northern Mariana Islands", "Blue Cross Blue Shield of American Samoa",
    "MetLife", "Guardian", "Principal", "Lincoln Financial", "Mutual of Omaha", "Transamerica", "Prudential", "John Hancock", "MassMutual", "New York Life",
    "Nationwide", "Allstate", "State Farm", "Farmers Insurance", "Liberty Mutual", "Progressive", "Travelers", "Chubb", "The Hartford", "Zurich",
    "Assurant", "CNO Financial", "Ameritas", "Colonial Life", "Unum", "Sun Life", "Voya Financial", "Aflac", "Delta Dental", "United Concordia"
  ];

  return (
    <>
      <Card sx={{
        position: "relative",
        background: `url('${Jelly1}')`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        // Remove the dark overlay pseudo-element
      }}>
        {/* Overlay for transparency */}
        <VuiBox
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(24, 44, 90, 0.45)",
            borderRadius: "inherit",
            zIndex: 1,
            pointerEvents: "none",
          }}
        />
        <VuiBox p={2} pt={0} sx={{ position: "relative", zIndex: 2 }}>
          <VuiBox
            color="white"
            lineHeight={0}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            width="100%"
            sx={{ width: "100%" }}
          >
            <VuiTypography color="white" variant="lg" fontWeight="bold" mr="auto">
              {insuranceName || "Insurance Card"}
            </VuiTypography>
            <VuiBox display="flex" alignItems="center" gap={1}>
              <VuiBox
                component="button"
                onClick={handleAddClick}
                sx={{
                  background: "rgba(255,255,255,0.12)",
                  border: "none",
                  borderRadius: "50%",
                  width: 32,
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  marginRight: 1,
                  padding: 0,
                }}
                aria-label="Add Insurance"
                type="button"
              >
                <FiPlus size={18} color="#fff" />
              </VuiBox>
              <VuiBox
                component="button"
                onClick={handleEditClick}
                sx={{
                  background: "rgba(255,255,255,0.12)",
                  border: "none",
                  borderRadius: "50%",
                  width: 32,
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  padding: 0,
                }}
                aria-label="Edit Insurance"
                type="button"
              >
                <FiEdit2 size={16} color="#fff" />
              </VuiBox>
            </VuiBox>
          </VuiBox>
          <VuiTypography
            variant="h4"
            color="white"
            mt="auto"
            fontWeight="medium"
            sx={({ breakpoints }) => ({
              mt: 5,
              pb: 1,
              [breakpoints.only("sm")]: {
                fontSize: "22px",
              },
            })}
            style={{ textAlign: "left" }}
          >
            {memberName}
          </VuiTypography>
          <VuiBox display="flex" justifyContent="space-between" alignItems="center" mt={1}>
            <VuiBox>
              <VuiTypography variant="xxs" color="white" fontWeight="medium" opacity={0.8}>
                MEMBER ID
              </VuiTypography>
              <VuiTypography
                variant="h6"
                color="white"
                fontWeight="medium"
                textTransform="capitalize"
              >
                {memberId}
              </VuiTypography>
            </VuiBox>
            <VuiBox textAlign="right">
              <VuiTypography variant="xxs" color="white" fontWeight="medium" opacity={0.8}>
                MONTHLY BILL
              </VuiTypography>
              <VuiTypography variant="h6" color="white" fontWeight="medium">
                {monthlyBill ? `$${monthlyBill}/mo` : "-"}
              </VuiTypography>
            </VuiBox>
          </VuiBox>
        </VuiBox>
      </Card>
      {/* Popups for Add and Edit, now rendered in portal */}
      {openAdd && renderModal(
        <VuiBox
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 99999,
          }}
          onClick={handleClose}
        >
          <form onSubmit={handleAddSubmit} onClick={e => e.stopPropagation()}>
            <VuiBox sx={{ background: "#222b", color: "#fff", p: 8, borderRadius: 4, minWidth: 600, maxWidth: 800, boxShadow: 16, border: "2px solid #fff", position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <button onClick={handleClose} type="button" style={{ position: "absolute", top: 18, right: 18, background: "transparent", border: "none", color: "#fff", fontSize: 28, cursor: "pointer" }} aria-label="Close">×</button>
              <VuiTypography variant="h5" color="white" mb={3} style={{ textAlign: "center" }}>Add Insurance</VuiTypography>
              <input
                name="insuranceName"
                list="insurance-options"
                placeholder="Insurance Name"
                value={form.insuranceName}
                onChange={handleFormChange}
                style={{ width: "100%", marginBottom: 18, padding: 12, borderRadius: 8, border: "1px solid #fff", background: "rgba(51,51,51,0.8)", color: "#fff", fontSize: 18 }}
                required
              />
              <datalist id="insurance-options">
                {INSURANCE_OPTIONS.map((name, idx) => (
                  <option key={idx} value={name} />
                ))}
              </datalist>
              <input name="memberName" placeholder="Member Name" value={form.memberName} onChange={handleFormChange} style={{ width: "100%", marginBottom: 18, padding: 12, borderRadius: 8, border: "1px solid #fff", background: "rgba(51,51,51,0.8)", color: "#fff", fontSize: 18 }} />
              <input name="memberId" placeholder="Member ID" value={form.memberId} onChange={handleFormChange} style={{ width: "100%", marginBottom: 18, padding: 12, borderRadius: 8, border: "1px solid #fff", background: "rgba(51,51,51,0.8)", color: "#fff", fontSize: 18 }} />
              <input name="monthlyBill" placeholder="Monthly Bill ($)" value={form.monthlyBill} onChange={handleFormChange} style={{ width: "100%", marginBottom: 24, padding: 12, borderRadius: 8, border: "1px solid #fff", background: "rgba(51,51,51,0.8)", color: "#fff", fontSize: 18 }} />
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, width: "100%" }}>
                <button type="button" onClick={handleClose} style={{ background: "#444", color: "#fff", border: "none", borderRadius: 8, padding: "10px 28px", cursor: "pointer", fontSize: 16 }}>Cancel</button>
                <button type="submit" style={{ background: "#1976d2", color: "#fff", border: "none", borderRadius: 8, padding: "10px 28px", cursor: "pointer", fontSize: 16 }}>Add</button>
              </div>
            </VuiBox>
          </form>
        </VuiBox>
      )}
      {openEdit && renderModal(
        <VuiBox
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 99999,
          }}
          onClick={handleClose}
        >
          <form onSubmit={handleEditSubmit} onClick={e => e.stopPropagation()}>
            <VuiBox sx={{ background: "#222b", color: "#fff", p: 8, borderRadius: 4, minWidth: 600, maxWidth: 800, boxShadow: 16, border: "2px solid #fff", position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <button onClick={handleClose} type="button" style={{ position: "absolute", top: 18, right: 18, background: "transparent", border: "none", color: "#fff", fontSize: 28, cursor: "pointer" }} aria-label="Close">×</button>
              <VuiTypography variant="h5" color="white" mb={3} style={{ textAlign: "center" }}>Edit Insurance</VuiTypography>
              <input
                name="insuranceName"
                list="insurance-options"
                placeholder="Insurance Name"
                value={form.insuranceName}
                onChange={handleFormChange}
                style={{ width: "100%", marginBottom: 18, padding: 12, borderRadius: 8, border: "1px solid #fff", background: "rgba(51,51,51,0.8)", color: "#fff", fontSize: 18 }}
                required
              />
              <datalist id="insurance-options">
                {INSURANCE_OPTIONS.map((name, idx) => (
                  <option key={idx} value={name} />
                ))}
              </datalist>
              <input name="memberName" placeholder="Member Name" value={form.memberName} onChange={handleFormChange} style={{ width: "100%", marginBottom: 18, padding: 12, borderRadius: 8, border: "1px solid #fff", background: "rgba(51,51,51,0.8)", color: "#fff", fontSize: 18 }} />
              <input name="memberId" placeholder="Member ID" value={form.memberId} onChange={handleFormChange} style={{ width: "100%", marginBottom: 18, padding: 12, borderRadius: 8, border: "1px solid #fff", background: "rgba(51,51,51,0.8)", color: "#fff", fontSize: 18 }} />
              <input name="monthlyBill" placeholder="Monthly Bill ($)" value={form.monthlyBill} onChange={handleFormChange} style={{ width: "100%", marginBottom: 24, padding: 12, borderRadius: 8, border: "1px solid #fff", background: "rgba(51,51,51,0.8)", color: "#fff", fontSize: 18 }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", marginTop: 8 }}>
                <button type="button" onClick={handleDelete} style={{ background: "#d32f2f", color: "#fff", border: "none", borderRadius: 8, padding: "10px 28px", cursor: "pointer", fontSize: 16 }}>Delete</button>
                <div style={{ display: "flex", gap: 12 }}>
                  <button type="button" onClick={handleClose} style={{ background: "#444", color: "#fff", border: "none", borderRadius: 8, padding: "10px 28px", cursor: "pointer", fontSize: 16 }}>Cancel</button>
                  <button type="submit" style={{ background: "#1976d2", color: "#fff", border: "none", borderRadius: 8, padding: "10px 28px", cursor: "pointer", fontSize: 16 }}>Save</button>
                </div>
              </div>
            </VuiBox>
          </form>
        </VuiBox>
      )}
    </>
  );
}

// Setting default values for the props of MasterCard
MasterCard.defaultProps = {
  insuranceName: "Insurance Card",
  memberName: "Member Name",
  memberId: "ID123456",
  monthlyBill: "0.00",
  onAdd: () => {},
  onEdit: () => {},
  onDelete: () => {},
};

// Typechecking props for the MasterCard
MasterCard.propTypes = {
  insuranceName: PropTypes.string,
  memberName: PropTypes.string,
  memberId: PropTypes.string,
  monthlyBill: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onAdd: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

function MasterCardStack({ cards, setCards, onAdd, onEdit, onDelete }) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Handler to add a new card and show it under the current one
  const handleAdd = (form) => {
    const newCards = [...cards, form];
    setCards(newCards);
    setActiveIndex(newCards.length - 1); // Show the new card on top
    if (onAdd) onAdd(form);
  };

  // Handler to edit the active card
  const handleEdit = (form) => {
    const newCards = cards.map((c, i) => (i === activeIndex ? { ...c, ...form } : c));
    setCards(newCards);
    if (onEdit) onEdit(form);
  };

  // Handler to delete the active card
  const handleDelete = (form) => {
    const newCards = cards.filter((_, i) => i !== activeIndex);
    setCards(newCards);
    setActiveIndex((prev) => Math.max(0, prev - 1));
    if (onDelete) onDelete(form);
  };

  // Show all cards stacked, each peeking out a bit more
  const CARD_OFFSET = 36;
  return (
    <div style={{ position: "relative", width: "100%", minHeight: 220 + CARD_OFFSET * (cards.length - 1) }}>
      {cards.map((card, idx) => {
        const isActive = idx === activeIndex;
        return (
          <div
            key={idx}
            style={{
              position: "absolute",
              top: CARD_OFFSET * idx,
              left: 0,
              width: "100%",
              zIndex: idx,
              filter: isActive ? undefined : "blur(0.5px) brightness(0.93)",
              opacity: isActive ? 1 : 0.85,
              cursor: isActive ? "default" : "pointer",
              transition: "top 0.3s, opacity 0.3s, filter 0.3s",
              pointerEvents: isActive ? "auto" : "auto",
            }}
            onClick={() => { if (!isActive) setActiveIndex(idx); }}
          >
            <MasterCard
              {...card}
              onAdd={handleAdd}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        );
      })}
    </div>
  );
}

// Export MasterCardStack for use in billing page
export { MasterCardStack };

export default MasterCard;
