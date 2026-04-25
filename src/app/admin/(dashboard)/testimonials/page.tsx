import { getAllTestimonialsAdmin } from "@/actions/testimonials";
import { TestimonialsManager } from "@/components/admin/TestimonialsManager";

export default async function AdminTestimonialsPage() {
  const testimonials = await getAllTestimonialsAdmin();
  return <TestimonialsManager testimonials={testimonials} />;
}
