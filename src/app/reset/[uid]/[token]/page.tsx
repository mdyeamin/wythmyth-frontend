import ResetPasswordForm from "../../../components/ui/reset-password-form";

export default async function Page({
  params,
}: {
  params: Promise<{ uid: string; token: string }>;
}) {
  const { uid, token } = await params;
  return <ResetPasswordForm uid={uid} token={token} />;
}
