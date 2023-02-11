import Navbar from "../components/Navbar";
import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import Loading from "../components/Loading";

const App = ({ Component, pageProps: { session, loading, ...pageProps } }) => {
  return (
    <SessionProvider session={session}>
      <ThemeProvider enableSystem={true} attribute="class">
        <Navbar />
        {loading ? <Loading /> : <Component {...pageProps} />}
      </ThemeProvider>
    </SessionProvider>
  );
};

export default App;
