import Link from "next/link";
import Image from "next/image";
import prisma from "@/lib/prisma";
import Layout from "@/components/layout";
import ConvoCard from "@/components/explore/convo-card";
import { ConversationMeta } from "@/lib/types";
import { getConvos } from "@/lib/api";
import { useCallback, useEffect, useRef, useState } from "react";
import Discord from "@/components/shared/icons/discord";
import useDebounce from "@/lib/hooks/use-debounce";
import { Search } from "lucide-react";
import Pagination from "@/components/explore/pagination";
import { NextRouter, useRouter } from "next/router";
import { LoadingCircle } from "@/components/shared/icons";

export const setSearch = (router: NextRouter, search: string) => {
  router.replace(
    {
      query: {
        ...(search && {
          search
        }),
      },
    },
    undefined,
    { shallow: true }
  );
};

export default function Home({
  totalConvos,
  topConvos,
}: {
  totalConvos: number;
  topConvos: ConversationMeta[];
}) {

  const router = useRouter();
  const currentPage: number =
    router.query.page && typeof router.query.page === "string"
      ? parseInt(router.query.page)
      : 1;
  const searchValue: string = router.query.search as string || ""

  const [inpValue, setInpValue] = useState(searchValue);
  const [filterSourceValue, setFilterSourceValue] = useState('all');
  const [convo, setConvo] = useState<ConversationMeta[] | []>(topConvos);
  const [totalConversation, setTotalConversation] = useState(totalConvos);
  const [searching, setSearching] = useState(false);

  const searchQuery = useDebounce(inpValue, 500);
  const isFirst = useRef(0);

  const getSearchedConvo = useCallback(async () => {
    setSearching(true);
    const res = await fetch(`/api/search?search=${searchValue}&source=${filterSourceValue}&page=${currentPage}`);
    const data = await res.json();
    setSearching(false);
    setConvo(data || [])

    const countRes = await fetch(`/api/search/count?search=${searchValue}&source=${filterSourceValue}`);
    const countData = await countRes.json();
    setTotalConversation(countData?.at(0).count)
  }, [searchValue, filterSourceValue, currentPage])

  useEffect(() => {
    getSearchedConvo();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getSearchedConvo]);

  useEffect(() => {

    if(searchQuery === "" && isFirst.current === 0){
      isFirst.current += 1;
      return;
    }
    setSearch(router, searchQuery)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery])

  const [domLoaded, setDomLoaded] = useState(false);
  useEffect(() => {setDomLoaded(true)}, [])

  return (
    <>
    {
      domLoaded && 
        <Layout>
          <div className="flex flex-col items-center py-28 pb-5 bg-gray-50">
            <Link
              href="https://discord.gg/m88xfYMbK6"
              target="_blank"
              rel="noreferrer"
              className="mx-auto flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full bg-blue-100 px-7 py-2 mb-5 transition-all hover:bg-blue-200"
            >
              <Discord className="h-5 w-5 text-[#7289da]" />
              <p className="text-sm font-semibold text-[#7289da]">
                PromptsLab Discord
              </p>
            </Link>
            <div className="flex flex-col items-center space-y-8 text-center mx-5 sm:mx-auto">
              <h1 className="gradient-color font-display tracking-tight font-bold text-4xl transition-colors sm:text-7xl">
                SharePrompts
              </h1>
              <p className="max-w-lg text-gray-600 transition-colors sm:text-lg">
                Share your Prompts with one click.
                <br />
                <span className="font-bold text-blue">
                  {Intl.NumberFormat("en-us").format(totalConvos)}
                </span>{" "}
                Prompts shared so far.
              </p>
              <div className="flex flex-col sm:flex-row">
                <div className="flex justify-center items-center mb-3 sm:mr-3 sm:mb-0 rounded-lg bg-accent text-white shadow-md">
                  <a
                    className="hidden md:flex space-x-3 justify-center items-center px-5 py-3 font-medium md:hover:bg-indigo-600 transition-all rounded-l-lg"
                    href="/extension"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      alt="Chrome logo"
                      src="/chrome.svg"
                      width={20}
                      height={20}
                    />
                    <p>Install extension</p>
                  </a>
                </div>
              </div>
            </div>
            <div className="py-4 px-2 sm:max-w-screen-lg w-full my-2">
              <h2 className="text-3xl sm:text-4xl text-center font-semibold font-display">
                Browse Prompts
              </h2>
              <div className="flex items-center justify-center relative">
                <div className="border-0 flex items-center px-4 py-2 mt-4 mx-auto outline-none gap-2 bg-secondary-2 hover:bg-secondary-1 h-[50px] rounded-full lg:w-[550px] w-9/12">
                  <Search />
                  <input className="h-full outline-none flex-1 bg-transparent" value={inpValue} onChange={(e) => {setInpValue(e.target.value)}}  />
                  <select className="outline-none bg-transparent border-0" id="search-filter" value={filterSourceValue} onChange={(e) => {setFilterSourceValue(e.target.value)}}>
                    <option value="all">All</option>
                    <option value="gpt">ChatGPT</option>
                    <option value="bard">Bard</option>
                  </select>
                  {
                    searching && 
                    <div className=" absolute top-full left-0 flex items-center justify-center gap-2">
                      <LoadingCircle />
                      <span>Loading</span>
                    </div>
                  }
                </div>
              </div>
              <ul className="mt-8 grid gap-2">
                {convo.map((convo) => (
                  <ConvoCard key={convo.id} data={convo} />
                ))}
              </ul>
            </div>
            <Pagination count={totalConversation} />
          </div>
          <div className="h-[100px] bg-gray-50 flex flex-col items-center justify-center w-full">
            <a
              className="text-blue hover:bg-accent hover:text-white p-2 rounded-md"
              rel="noopener noreferrer"
              target="_blank"
              href=" https://github.com/promptslab/SharePrompts"
            >
              <div className="flex items-center gap-2"><span>View source on </span><Image src='/github.svg' alt="github logo" width={20} height={20} /><span>GitHub</span></div>
            </a>
          </div>
        </Layout>

    }
    </>
  );
}

export async function getStaticProps() {
  const totalConvos = await prisma.conversation.count();
  const topConvos = await getConvos({ orderBy: "views", take: 10 });
 
  return {
    props: {
      totalConvos,
      topConvos,
    },
    revalidate: 10,
  };
}
