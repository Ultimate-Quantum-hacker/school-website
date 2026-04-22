import Link from "next/link";
import { schoolConfig } from "@/config/school";
import { Button } from "@/components/ui/FormElements";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <p className="text-8xl font-bold text-primary/20">404</p>
        </div>
        <h1 className="text-3xl font-bold text-text mb-3">
          Page Not Found
        </h1>
        <p className="text-muted mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let us help you find your way back.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/">
            <Button>Go to Homepage</Button>
          </Link>
          <Link href="/contact">
            <Button variant="outline">Contact Us</Button>
          </Link>
        </div>
        <p className="text-xs text-muted mt-8">{schoolConfig.name}</p>
      </div>
    </div>
  );
}
