import EditTeamMember from "@/components/UI/TeamMemberSection/EditTeamMember";
import React from "react";

const page = async ({ params }) => {
  const { id } = await params;

  return (
    <div>
      <EditTeamMember id={id} />
    </div>
  );
};

export default page;
