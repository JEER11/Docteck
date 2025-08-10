import React from "react";
// Initialize i18n (side-effect import)
import "./i18n";
import { createRoot} from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "App";
import StripeProvider from "components/StripeProvider";

// Docteck Dashboard React Context Provider
import { VisionUIControllerProvider } from "context";
import AppProviders from "context/AppProviders";

// Docteck Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiButton from "components/VuiButton";

// Docteck Dashboard React example components
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import PageLayout from "examples/LayoutContainers/PageLayout";

// Authentication layout components
import Footer from "layouts/authentication/components/Footer";

// Docteck Dashboard React theme functions
import colors from "assets/theme/base/colors";

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);


root.render(
  <BrowserRouter>
    <VisionUIControllerProvider>
      <AppProviders>
        <StripeProvider>
          <App />
        </StripeProvider>
      </AppProviders>
    </VisionUIControllerProvider>
  </BrowserRouter>
)

