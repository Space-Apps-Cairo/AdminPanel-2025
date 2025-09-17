// Workshop Details Tab Component
"use client";

import { Card, CardTitle, CardContent, CardHeader } from "../../../../../../../components/ui/card";

import { format } from "date-fns";
import { Badge } from "../../../../../../../components/ui/badge";
import GreenBagde from "../../../../../../../components/badges/greenBadge";
import RedBadge from "../../../../../../../components/badges/redBadge";

export default function WorkshopDetailsTab({ workshop }: { workshop: any }) {
  console.log(workshop);
  if (!workshop) return <div>No workshop data available</div>;
  const workshopStatus =
    new Date(workshop.end_date) > new Date() ? "Active" : "Completed";
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Workshop Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">Name</h3>
              <p>{workshop.title}</p>
            </div>
            <div>
              <h3 className="font-semibold">Description</h3>
              <p>{workshop.description || "No description available"}</p>
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
