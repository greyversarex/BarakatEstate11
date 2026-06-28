import type { Metadata } from "next";

import ServiceDetailPage from "@/components/ServiceDetailPage";
import { serviceDetails } from "@/content/service-details";

const service = serviceDetails.cleaning;

export const metadata: Metadata = {
  title: `${service.title} | Barakat Estate`,
  description: service.description,
};

export default function Page() {
  return <ServiceDetailPage service={service} />;
}
