import EditTask from "@/components/UI/TaskSection/EditTask";
import React from "react";

const page = async ({ params }) => {
  const { id } = await params;
  return (
    <div>
      <EditTask id={id} />
    </div>
  );
};

export default page;
