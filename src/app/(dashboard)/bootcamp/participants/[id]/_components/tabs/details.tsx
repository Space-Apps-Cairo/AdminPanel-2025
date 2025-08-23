import Image from "next/image";
import { Mail, Phone, Cake, IdCard } from "lucide-react";
import InfoCard from "@/app/(dashboard)/bootcamp/participants/[id]/_components/InfoCard"; 
import DocumentCard from "@/app/(dashboard)/bootcamp/participants/[id]/_components/DocumentCard"; 
import { Badge } from "../../../../../../../components/ui/badge";
import { Label } from "../../../../../../../components/ui/label";

interface DetailsTabProps {
  participantDetails: any; 
  formatDate: (date: string) => string;
}

export default function DetailsTab({ participantDetails, formatDate }: DetailsTabProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Participant Details</h1>

        {/* Personal Information Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="col-span-1">
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32 mb-4 rounded-full overflow-hidden aspect-square">
                <Image
                  src={"/images/ali.png"}
                  alt="Profile photo"
                  fill
                  className="object-cover w-full rounded-full h-full"
                />
              </div>
              <h2 className="text-xl font-semibold">
                {participantDetails?.name_en}
              </h2>
              <p className="text-gray-600">{participantDetails?.name_ar}</p>
            </div>
          </div>

          <div className="col-span-2 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoCard label="Email" value={participantDetails?.email} icon={<Mail className="w-5 h-5" />} />
              <InfoCard label="Phone" value={participantDetails?.phone_number} icon={<Phone className="w-5 h-5" />} />
              <InfoCard label="Birth Date" value={formatDate(participantDetails?.birth_date)} icon={<Cake className="w-5 h-5" />} />
              <InfoCard label="National ID" value={participantDetails?.national_id} icon={<IdCard className="w-5 h-5" />} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoCard label="Nationality" value={participantDetails?.nationality} />
              <InfoCard label="Governorate" value={participantDetails?.governorate} />
            </div>
          </div>
        </div>

        {/* ID Documents Section */}
        <Section title="Identification Documents">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DocumentCard title="National ID Front" url={"/images/front.jpg"} />
            <DocumentCard title="National ID Back" url={"/images/back.jpg"} />
          </div>
        </Section>

        {/* Educational Information Section */}
        <Section title="Educational Background">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <InfoCard label="Institute" value={participantDetails?.educational_institute} />
            <InfoCard label="Graduation Year" value={participantDetails?.graduation_year} />
            <InfoCard label="Educational Level" value={participantDetails?.educational_level_id} />
            <InfoCard label="Field of Study" value={participantDetails?.field_of_study_id} />
          </div>
        </Section>

        {/* Participation Details Section */}
        <Section title="Participation Information">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <InfoCard label="Current Occupation" value={participantDetails?.current_occupation} />
            <InfoCard label="Participation Status" value={participantDetails?.participation_status} />
            <InfoCard label="Participated Years" value={participantDetails?.participated_years} />
            <InfoCard label="Has Team" value={participantDetails?.is_have_team === "individual" ? "No" : "Yes"} />
            <InfoCard label="Attending Workshop" value={participantDetails?.attend_workshop ? "Yes" : "No"} />
            <InfoCard label="Year" value={participantDetails?.year} />
          </div>
        </Section>

        {/* Skills Section */}
        <Section title="Skills">
          <div className="flex flex-wrap gap-2">
            {participantDetails?.skills.map((skill: any) => (
              <Badge key={skill.id} className="px-3 py-1 text-sm">
                {skill.name}
              </Badge>
            ))}
          </div>
        </Section>

        {/* Additional Information Section */}
        <Section title="Additional Information">
          <div className="space-y-4">
            <div>
              <Label>Why this workshop?</Label>
              <p className="text-sm text-gray-700 mt-1">{participantDetails?.why_this_workshop}</p>
            </div>
            <div>
              <Label>Comments</Label>
              <p className="text-sm text-gray-700 mt-1">{participantDetails?.comment}</p>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3 pb-2 border-b">{title}</h3>
      {children}
    </div>
  );
}
