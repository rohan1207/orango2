import BusinessOpportunityContent from "@/components/BusinessOpportunityContent";

export const metadata = {
  title: "Business Opportunity | Own & grow with OranGo",
  description:
    "Build a business with OranGo — from individual entrepreneurs starting small to groups scaling multi-site projects. Host, operate, or partner strategically.",
  keywords: [
    "OranGo business opportunity",
    "orange juice vending franchise India",
    "juice machine partnership",
    "OranGo franchise",
  ],
  alternates: { canonical: "https://orango.co.in/business-opportunity" },
  openGraph: {
    title: "OranGo Business Opportunity",
    description:
      "Opportunities to own and grow with OranGo — from single sites to larger-scale projects.",
    url: "https://orango.co.in/business-opportunity",
    type: "website",
  },
};

export default function BusinessOpportunityPage() {
  return <BusinessOpportunityContent />;
}
