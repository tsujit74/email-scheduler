import EmailDetailPage from "../../../components/email/EmailDetailPage";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  return <EmailDetailPage emailId={id} />;
}