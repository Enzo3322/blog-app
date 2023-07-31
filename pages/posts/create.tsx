import { useEffect, useState } from "react";
import { Inter } from "next/font/google";
import { useLocalStorage } from "@/utils/useLocalStorage";
import { useRouter } from "next/router";
import { useMutation } from "react-query";
import { createPost } from "@/services/posts";
import Spinner from "@/components/Spinner";
import { toast } from "react-toastify";

const inter = Inter({ subsets: ["latin"] });
const darkThemeClasses = "bg-gray-900 text-white";
const whiteThemeClasses = "bg-white text-black";

export default function Create() {
  const router = useRouter();
  const [darkTheme, setIsDarkTheme] = useLocalStorage("theme", "true");

  const [isDarkTheme, setIsDarkThemeState] = useState(false);

  const { mutate, isLoading, error } = useMutation("createPost", createPost, {
    onSuccess: (data) => {
      toast.success(`Post: "${data.title}" criado com sucesso`, {
        position: "bottom-right",
        autoClose: 5000,
        closeOnClick: true,
        pauseOnHover: true,
      });
      router.push("/");
    },
    onError: () => {
      toast.error(`Não foi possivel criar o post`, {
        position: "bottom-right",
        autoClose: 5000,
        closeOnClick: true,
        pauseOnHover: true,
      });
    },
  });

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
          onClick={() => router.push("/posts")}
        >
          Menu
        </button>
        {children}
      </main>
    );
  };

  return (
    <Template>
      <div className="grid  grid-cols-1 gap-10">
        <h1 className="text-3xl">Criar post</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input
            className={`border rounded p-3 text-black ${
              isDarkTheme ? "bg-slate-700 text-white" : ""
            }`}
            name="title"
            type="text"
            placeholder="Titulo do post"
          />

          <textarea
            className={`border rounded p-3 text-black ${
              isDarkTheme ? "bg-slate-700 text-white" : ""
            }`}
            name="content"
            id=""
            cols={50}
            rows={10}
            maxLength={5000}
            placeholder="Conteudo do post em markdown"
          />

          <button
            className={`rounded-md p-2 max-h-[42px] text-white text-lg hover:brightness-105 bg-blue-600 ${inter.className}`}
            type="submit"
          >
            {isLoading ? <Spinner /> : "Criar"}
          </button>
        </form>
      </div>
    </Template>
  );
}
