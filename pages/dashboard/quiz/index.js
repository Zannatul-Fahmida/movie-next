import QuizHub from "../../../components/quiz/QuizHub";
import { getSession } from "next-auth/react";

export default function QuizHubPage() {
  return <QuizHub />;
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
