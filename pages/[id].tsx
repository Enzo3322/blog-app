import { useState, useEffect } from "react";
import { getPostById } from "@/services/posts";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
import ReactMarkdown from "react-markdown";
import { useLocalStorage } from "@/utils/useLocalStorage";
import Spinner from "@/components/Spinner";

const darkThemeClasses = "bg-gray-900 text-white";
const whiteThemeClasses = "bg-white text-black";

export default function Post() {
  const [darkTheme, setIsDarkTheme] = useLocalStorage("theme", "true");
  const handleSetTheme = () => {
    if (darkTheme === "true") return setIsDarkTheme("false");
    setIsDarkTheme("true");
  };

  const [isDarkTheme, setIsDarkThemeState] = useState(false);

  useEffect(() => {
    const isDarkTheme = darkTheme === "true";

    setIsDarkThemeState(isDarkTheme);
  }, [darkTheme]);

  const router = useRouter();
  const { id } = router.query as Record<string, string>;

  const { data, error, isLoading } = useQuery(
    "getPost",
    () => getPostById({ id }),
    { enabled: !!id, retry: false }
  );

  const Template = ({ children }: any) => {
    return (
      <main
        className={`bg- flex min-h-screen flex-col items-center justify-between md:p-24 p-5 pt-24 ${
          isDarkTheme ? darkThemeClasses : whiteThemeClasses
        } ${inter.className}`}
      >
        <button
          className="p-2 rounded-md absolute top-5 right-5"
          onClick={handleSetTheme}
        >
          {isDarkTheme ? "Claro" : "Escuro"}
        </button>

        <button
          className="p-2 rounded-md absolute top-5 left-5"
          onClick={() => router.push("/")}
        >
          Voltar
        </button>
        {children}
      </main>
    );
  };

  if (isLoading) {
    return (
      <Template>
        <Spinner />
      </Template>
    );
  }

  if (error || !data) {
    return (
      <Template>
        <div>Falha ao buscar posts</div>
      </Template>
    );
  }

  return (
    <Template>
      <div className="markdown-container w-[100%] max-w-[700px]">
        <h1 className="text-3xl font-bold mb-5">{data.title}</h1>
        <ReactMarkdown>{data.content}</ReactMarkdown>
      </div>
    </Template>
  );
}
