// @mui material components
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Icon from "@mui/material/Icon";

// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";

// Custom styles for the SidenavCard
import { card, cardContent, cardIconBox, cardIcon } from "examples/Sidenav/styles/sidenavCard";

// Vision UI Dashboard React context
import { useVisionUIController } from "context";

function SidenavCard({ color, ...rest }) {
  const [controller] = useVisionUIController();
  const { miniSidenav, sidenavColor } = controller;

  return (
    <Card sx={(theme) => ({
      ...card(theme, { miniSidenav }),
      background: 'rgba(33,150,243,0.15)', // more transparent blue background
      boxShadow: '0 4px 32px 0 rgba(33,150,243,0.10)', // optional: subtle blue shadow
    })}>
      <CardContent sx={(theme) => cardContent(theme, { sidenavColor })}>
        <VuiBox
          bgColor="white"
          width="2rem"
          height="2rem"
          borderRadius="md"
          shadow="md"
          mb={2}
          sx={cardIconBox}
        >
          <Icon fontSize="medium" sx={(theme) => cardIcon(theme, { color })}>
            support_agent
          </Icon>
        </VuiBox>
        <VuiBox lineHeight={1}>
          <VuiTypography variant="h6" color="white">
            Here to Help 
          </VuiTypography>
          <VuiBox mb={1.825} mt={-1}>
            <VuiTypography variant="caption" color="white" fontWeight="regular">

            </VuiTypography>
          </VuiBox>
        </VuiBox>
      </CardContent>
    </Card>
  );
}

export default SidenavCard;
