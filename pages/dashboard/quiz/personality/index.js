import PersonalityQuiz from "../../../../components/quiz/PersonalityQuiz";
import { getSession } from "next-auth/react";

export default function PersonalityQuizPage() {
  return <PersonalityQuiz />;
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) return { redirect: { destination: "/login", permanent: false } };
  return { props: {} };
}
