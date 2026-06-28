import ServiceDetailPage from "@/components/ServiceDetailPage";
import { serviceDetails } from "@/content/service-details";

const service = serviceDetails.putty;

export const metadata = {
  title: `${service.title} | Barakat Estate`,
  description: service.description,
};

export default function Page() {
  return <ServiceDetailPage service={service} />;
}
