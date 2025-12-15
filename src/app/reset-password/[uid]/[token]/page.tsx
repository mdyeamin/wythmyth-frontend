import ResetPasswordForm from "../../../../app/components/ui/reset-password-form";

export default function Page({
  params,
}: {
  params: { uid: string; token: string };
}) {
  return <ResetPasswordForm uid={params.uid} token={params.token} />;
}
