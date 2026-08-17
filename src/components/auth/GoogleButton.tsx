import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function GoogleButton({ label = "Tiếp tục với Google" }: { label?: string }) {
  const navigate = useNavigate();
  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      className="w-full gap-2.5"
      onClick={() => navigate({ to: "/trang-chu" })}
    >
      <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
        <path
          fill="#4285F4"
          d="M23.5 12.3c0-.9-.1-1.5-.2-2.2H12v4.1h6.6c-.1 1.1-.9 2.8-2.5 3.9l-.02.15 3.6 2.8.25.03c2.3-2.1 3.6-5.2 3.6-8.8Z"
        />
        <path
          fill="#34A853"
          d="M12 24c3.3 0 6-1.1 8-3l-3.8-2.9c-1 .7-2.4 1.2-4.2 1.2a7.3 7.3 0 0 1-6.9-5l-.14.01-3.7 2.9-.05.14C3.2 21.3 7.3 24 12 24Z"
        />
        <path
          fill="#FBBC05"
          d="M5.1 14.3a7.2 7.2 0 0 1 0-4.6l-.01-.15-3.75-2.9-.12.06a12 12 0 0 0 0 10.6l3.88-3.01Z"
        />
        <path
          fill="#EA4335"
          d="M12 4.7c2.3 0 3.9 1 4.8 1.8l3.5-3.4C18 1.2 15.3 0 12 0 7.3 0 3.2 2.7 1.2 6.7l3.9 3a7.3 7.3 0 0 1 6.9-5Z"
        />
      </svg>
      {label}
    </Button>
  );
}
