import { ForgotPasswordForm } from "@/components/auth"

export const metadata = {
  title: "Reset Password - DevReview Portal",
  description: "Reset your DevReview portal password via email OTP verification",
}

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />
}
