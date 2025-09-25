// "use client";

// import Loading from "@/components/loading/loading";
// import DataTable from "@/components/table/data-table";
// import { useState } from "react";
// import {
//   useGetMembersQuery,
//   useDeleteMemberMutation,
//   useAddMemberMutation,
// } from "@/service/Api/hackthon/member";
// import { Member } from "@/types/hackthon/member";
// import {
//   ActionConfig,
//   ColumnVisibilityConfig,
//   SearchConfig,
//   StatusConfig,
// } from "@/types/table";
// import React from "react";
// import { getMemberFields, memberColumns } from "./_components/columns";
// import { toast } from "sonner";
// import CrudForm from "@/components/crud-form";
// import { memberSchema } from "@/validations/hackthon/member";
// import { add } from "date-fns";
// import { getMentorshipFields } from "../../form-options/mentorship/columns";

// export default function MembersPage() {
//   const {
//     data: membersData,
//     isLoading: isLoadingMembers,
//     error: membersError,
//   } = useGetMembersQuery();
//    const handleAddMember = async (
//    membersData
 
// ) => {
//   try {
//     const result = await addMember(formData).unwrap();

//     if (result.data) {
//       setMembers((prev) => [...prev, result.data]);

//       toast({
//         title: "Member added",
//         description: "The member was added successfully",
//       });
//     }

//     setIsOpen(false);
//   } catch (error) {
//     console.error("Error adding member:", error);

//     toast({
//       title: "Error",
//       description: "Something went wrong while adding member",
//       variant: "destructive",
//     });
//   }
// };
//   // Delete mutation for bulk operations
//   const [deleteMember] = useDeleteMemberMutation();
//   const [isOpen, setIsOpen] = useState(false);
//   const searchConfig: SearchConfig = {
//     enabled: true,
//     placeholder: "Filter by name, email, phone",
//     searchKeys: ["uuid", "email", "national"],
//   };

//   const statusConfig: StatusConfig = {
//     enabled: false,
//   };

//   const actionConfig: ActionConfig = {
//     enabled: true,
//     showAdd: true, // allow admin to add members
//     showDelete: true,
//     addButtonText: "Add Member",
//     showExport: true
//   };
//   const columnVisibilityConfig: ColumnVisibilityConfig = {
//     enableColumnVisibility: true,
//     // invisibleColumns:["age","is_new","participation_type",""]
//   };
//   if (isLoadingMembers) return <Loading />;

//   if (membersError) {
//     return (
//       <div className="container mx-auto py-6">
//         <div className="text-red-500">Error loading members</div>
//       </div>
//     );
//   }

//   return (
//      <React.Fragment>
//       {isOpen && (
//         <CrudForm
//           fields={getMemberFields()}
//           isOpen={isOpen}
//           setIsOpen={setIsOpen}
//           operation={"add"}
//           asDialog={true}
//           validationSchema={ memberSchema}
        
//           onSubmit={useAddMemberMutation}
//         />
//       )}  






//     <div className=" py-6 px-7">
//       <h1 className="text-2xl font-bold mb-6">Hackathon Members</h1>

//       <DataTable<Member>
//          data={membersData ?? []}
//         columns={memberColumns}
//         searchConfig={searchConfig}
//         statusConfig={statusConfig}
//         actionConfig={actionConfig}
//         columnVisibilityConfig={columnVisibilityConfig}
//         bulkDeleteMutation={(ids: number[]) =>
//           Promise.all(ids.map((id) => deleteMember(id).unwrap()))
//             .then(() => toast.success("Members deleted successfully!"))
//             .catch(() => toast.error("Failed to delete selected members."))
//         }
//       />
//     </div>
//     </React.Fragment>
//   );
// }
"use client";

import Loading from "@/components/loading/loading";
import DataTable from "@/components/table/data-table";
import { useState } from "react";
import {
  useGetMembersQuery,
  useDeleteMemberMutation,
  useAddMemberMutation,
} from "@/service/Api/hackathon/member";
import { Member } from "@/types/hackthon/member";
import {
  ActionConfig,
  ColumnVisibilityConfig,
  SearchConfig,
  StatusConfig,
} from "@/types/table";
import React from "react";
import { getMemberFields, memberColumns } from "./_components/columns";
import { toast } from "sonner";
import CrudForm from "@/components/crud-form";
import { memberSchema } from "@/validations/hackthon/member";

export default function MembersPage() {
  const {
    data: membersData,
    isLoading: isLoadingMembers,
    error: membersError,
  } = useGetMembersQuery();

  // mutations
  const [addMember] = useAddMemberMutation();
  const [deleteMember] = useDeleteMemberMutation();

  // modal state
  const [isOpen, setIsOpen] = useState(false);

  const searchConfig: SearchConfig = {
    enabled: true,
    placeholder: "Filter by name, email, phone",
    searchKeys: ["uuid", "email", "national"],
  };

  const statusConfig: StatusConfig = {
    enabled: false,
  };

  const actionConfig: ActionConfig = {
    enabled: true,
    showAdd: true,
    showDelete: true,
    addButtonText: "Add Member",
    showExport: true,
  };

  const columnVisibilityConfig: ColumnVisibilityConfig = {
    enableColumnVisibility: true,
  };

 
  const handleAddMember = async (formData: Partial<Member>) => {
    try {
      const result = await addMember(formData).unwrap();

      toast.success("Member added successfully!");
      setIsOpen(false);
    } catch (error) {
      console.error("Error adding member:", error);
      toast.error("Something went wrong while adding member");
    }
  };

  if (isLoadingMembers) return <Loading />;

  if (membersError) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-red-500">Error loading members</div>
      </div>
    );
  }

  return (
    <React.Fragment>
      {isOpen && (
        <CrudForm
          fields={getMemberFields()}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          operation="add"
          asDialog
          validationSchema={memberSchema}
         
          onSubmit={handleAddMember}
        />
      )}

      <div className="py-6 px-7">
        <h1 className="text-2xl font-bold mb-6">Hackathon Members</h1>

        <DataTable<Member>
          data={membersData ?? []}
          columns={memberColumns}
          searchConfig={searchConfig}
          statusConfig={statusConfig}
          actionConfig={actionConfig}
          columnVisibilityConfig={columnVisibilityConfig}
          bulkDeleteMutation={(ids: number[]) =>
            Promise.all(ids.map((id) => deleteMember(id).unwrap()))
              .then(() => toast.success("Members deleted successfully!"))
              .catch(() => toast.error("Failed to delete selected members."))
          }
        />
      </div>
    </React.Fragment>
  );
}
