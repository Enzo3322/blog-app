import { useEffect, useState } from "react";
import { Inter } from "next/font/google";
import { useLocalStorage } from "@/utils/useLocalStorage";
import { useRouter } from "next/router";
import { useMutation } from "react-query";
import { createPost } from "@/services/posts";
import Spinner from "@/components/Spinner";

const inter = Inter({ subsets: ["latin"] });
const darkThemeClasses = "bg-gray-900 text-white";
const whiteThemeClasses = "bg-white text-black";

export default function Create() {
  const router = useRouter();
  const [darkTheme, setIsDarkTheme] = useLocalStorage("theme", "true");

  const [isDarkTheme, setIsDarkThemeState] = useState(false);

  const { mutate, isLoading, error } = useMutation("createPost", createPost);

  useEffect(() => {
    const isDarkTheme = darkTheme === "true";

    setIsDarkThemeState(isDarkTheme);
  }, [darkTheme]);

  const handleSetTheme = () => {
    if (darkTheme === "true") return setIsDarkTheme("false");
    setIsDarkTheme("true");
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const postTitle = e?.target?.[0].value;
    const postContent = e?.target?.[1].value;

    console.log({ e, postTitle, postContent });

    mutate({ content: postContent, title: postTitle });
  };

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
          Posts
        </button>
        {children}
      </main>
    );
  };

  return (
    <Template>
      <div className="grid  grid-cols-2 gap-10">
        <a href={`/posts/create`}>
          <div
            className={`border p-5 rounded-md hover:transition-all w-[300px] hover:border-gray-400 ${
              isDarkTheme ? "bg-slate-700" : "bg-slate-200"
            }`}
          >
            <p className="text-lg">Criar</p>
            <span className="text-sm">Crie um novo post</span>
          </div>
        </a>

        <a href={`/posts/delete`}>
          <div
            className={`border p-5 rounded-md hover:transition-all w-[300px] hover:border-gray-400 ${
              isDarkTheme ? "bg-slate-700" : "bg-slate-200"
            }`}
          >
            <p className="text-lg">Excluir</p>
            <span className="text-sm">Remova posts</span>
          </div>
        </a>
      </div>
    </Template>
  );
}
