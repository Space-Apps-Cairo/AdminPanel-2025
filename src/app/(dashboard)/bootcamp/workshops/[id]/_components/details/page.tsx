// Workshop Details Tab Component
"use client";

import {
  Card,
  CardTitle,
  CardContent,
  CardHeader,
} from "../../../../../../../components/ui/card";

import { format } from "date-fns";
import { Badge } from "../../../../../../../components/ui/badge";
import GreenBagde from "../../../../../../../components/badges/greenBadge";
import RedBadge from "../../../../../../../components/badges/redBadge";

// Helper function to convert HTML to array of strings for display
const htmlToDescriptionArray = (htmlString: string): string[] => {
  if (!htmlString || typeof htmlString !== 'string') return [];
  
  // Extract text content from <li> tags
  const liRegex = /<li[^>]*>(.*?)<\/li>/g;
  const matches = [];
  let match;
  
  while ((match = liRegex.exec(htmlString)) !== null) {
    // Remove HTML entities and decode them
    const text = match[1]
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .trim();
    matches.push(text);
  }
  
  return matches;
};

export default function WorkshopDetailsTab({ workshop }: { workshop: any }) {
  console.log(workshop);
  if (!workshop) return <div>No workshop data available</div>;
  
  const workshopStatus =
    new Date(workshop.end_date) > new Date() ? "Active" : "Completed";
  
  // Convert HTML description to array for display
  const descriptionPoints = htmlToDescriptionArray(workshop.description);
  
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">Name</h3>
              <p>{workshop.title}</p>
            </div>
            <div className="">
              <h3 className="font-semibold">Description</h3>
              {descriptionPoints.length > 0 ? (
                <ul className="list-disc list-inside space-y-1 mt-2">
                  {descriptionPoints.map((point, index) => (
                    <li key={index} className="text-sm ">
                      {point}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No description available</p>
              )}
            </div>
            <div>
              <h3 className="font-semibold">Start Date</h3>
              <p>{format(new Date(workshop.start_date), "PPP")}</p>
            </div>
            <div>
              <h3 className="font-semibold">End Date</h3>
              <p>{format(new Date(workshop.end_date), "PPP")}</p>
            </div>
            <div>
              <h3 className="font-semibold">Created At</h3>
              <p>{format(new Date(workshop.created_at), "PPP")}</p>
            </div>
            <div>
              <h3 className="font-semibold">Status</h3>
              {workshopStatus == "Active" ? (
                <GreenBagde text={workshopStatus} />
              ) : (
                <RedBadge text={workshopStatus} />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Priority Overview Cards */}
    </div>
  );
}
