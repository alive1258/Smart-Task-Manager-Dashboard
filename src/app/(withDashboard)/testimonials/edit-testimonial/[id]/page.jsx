import EditTestimonial from "@/components/Testimonials/EditTestimonial";

const TestimonialPage = async ({ params }) => {
  const { id } = await params;
  return (
    <>
      <EditTestimonial id={id} />
    </>
  );
};

export default TestimonialPage;
