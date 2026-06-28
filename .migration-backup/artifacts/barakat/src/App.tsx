import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Suspense } from "react";

import Navigation from "@/components/Navigation";
import SiteFooter from "@/components/SiteFooter";
import AuraRuntime from "@/components/AuraRuntime";
import AuraPage from "@/components/AuraPage";
import SellerProfilePage from "@/components/SellerProfilePage";
import ServiceDetailPage from "@/components/ServiceDetailPage";
import { serviceDetails } from "@/content/service-details";

const queryClient = new QueryClient();

function Router() {
  return (
    <>
      <AuraRuntime />
      <Navigation />
      <Switch>
        <Route path="/" component={() => <AuraPage page="home" />} />
        <Route path="/listings" component={() => <AuraPage page="listings" />} />
        <Route path="/map" component={() => <AuraPage page="map" />} />
        <Route path="/services" component={() => <AuraPage page="services" />} />
        <Route path="/team" component={() => <AuraPage page="team" />} />
        <Route path="/about" component={() => <AuraPage page="about" />} />
        <Route path="/favorites" component={() => <AuraPage page="favorites" />} />
        <Route path="/property" component={() => <AuraPage page="property" />} />
        <Route path="/buy-property" component={() => <ServiceDetailPage service={serviceDetails["buy-property"]} />} />
        <Route path="/repair" component={() => <ServiceDetailPage service={serviceDetails.repair} />} />
        <Route path="/putty" component={() => <ServiceDetailPage service={serviceDetails.putty} />} />
        <Route path="/design" component={() => <ServiceDetailPage service={serviceDetails.design} />} />
        <Route path="/cleaning" component={() => <ServiceDetailPage service={serviceDetails.cleaning} />} />
        <Route path="/document-registration" component={() => <ServiceDetailPage service={serviceDetails["document-registration"]} />} />
        <Route path="/profile" component={() => (
          <Suspense fallback={<div>Загрузка профиля...</div>}>
            <SellerProfilePage />
          </Suspense>
        )} />
        <Route component={() => <AuraPage page="home" />} />
      </Switch>
      <SiteFooter />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <Router />
        <Toaster />
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;
