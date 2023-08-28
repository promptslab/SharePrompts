import { GetStaticPropsContext } from "next";
import Image from "next/image";
import prisma from "@/lib/prisma";
import { ParsedUrlQuery } from "node:querystring";
import cn from "classnames";
import GPTAvatar from "@/components/shared/icons/GPTAvatar";
import styles from "@/styles/utils.module.css";
import Banner from "@/components/banner";
import Meta from "@/components/layout/meta";
import { CommentProps, ConversationProps } from "@/lib/types";
import useView from "@/lib/hooks/use-view";
import { Toaster } from "react-hot-toast";
import CommentBubbleGroup from "@/components/comments/bubble-group";
import { useCommentModal } from "@/components/comments/modal";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/utils";
import { getConvo } from "@/lib/api";
import { AnimatePresence, motion } from "framer-motion";
import { FADE_IN_ANIMATION_SETTINGS } from "@/lib/constants";
import Link from "next/link";
import { BASE_URL } from "@/lib/baseurl";
import bard_chat_logo from "../../public/bard_chat_logo.svg"
import BardChatAvatar from "@/components/shared/icons/BardChatAvatar";

interface ChatParams extends ParsedUrlQuery {
  id: string;
}
function formatTitle(title: string | undefined): string {
  if (!title || title === "New chat")
    return "Check out this prompt shared in SharePrompts";
  else return `${title} -  A prompt shared in SharePrompts`;
}

export default function ChatPage({
  id,
  title,
  avatar,
  source,
  content: { avatarUrl, items, model },
  comments: initialComments,
  views,
}: ConversationProps) {
  const view = useView();
  const { data: comments } = useSWR<CommentProps[]>(
    `/api/conversations/${id}/comments`,
    fetcher,
    {
      fallbackData: initialComments,
    }
  );

  const router = useRouter();
  const { comment, position } = router.query;
  const { CommentModal, setShowCommentModal } = useCommentModal();
  const componentToPrintRef = useRef(null);

  useEffect(() => {
    if (comment || position) {
      setShowCommentModal(true);
    } else {
      setShowCommentModal(false);
    }
  }, [comment, position, setShowCommentModal]);

  const currentPosition = useMemo(() => {
    if (position) {
      return parseInt(position as string);
    } else if (comment) {
      return comments?.find((c) => c.id === comment)?.position || 1;
    } else {
      return null;
    }
  }, [comment, comments, position]);

  if (!items[0]) return null;


  return (
    <>
      <Meta
        title={formatTitle(title)}
        description={`This is a conversation between a human and a GPT-3 chatbot. The human first asks: ${items[0]?.value}. The GPT-3 chatbot then responds: ${items[1]?.value}`}
        image={`${BASE_URL}/api/conversations/${id}/thumbnail`}
        imageAlt={`This is a preview image for a conversation betwen a human and a GPT-3 chatbot. The human first asks: ${items[0]?.value}. The GPT-3 chatbot then responds: ${items[1]?.value}`}
        canonical={`${BASE_URL}/share/${id}`}
      />
      <CommentModal />
      <Toaster />
      <Link href='/'>
        <div className="flex items-center justify-center m-2 gap-2">
          <Image
            alt="prompts share logo"
            src="/logo.png"
            width={50}
            height={50}
          />
          <h1 className="text-2xl">SharePrompts</h1>
        </div>
      </Link>
      <div ref={componentToPrintRef} className="flex flex-col items-center p-2 pb-20 lg:pb-2 min-h-screen w-11/12 lg:w-9/12 mx-auto">
        <div className="prompt-title-cnt text-white flex justify-center items-center gap-2 border-b border-t border-secondary-2 text-sm w-fit mx-auto mb-2 mt-4 p-2 rounded-md"><span className="prompt-title">{title?.replace(/\.$/gi, '')}</span></div>
        {model ? (
          <div className="bg-gray-100 dark:bg-[#434654] w-full text-center text-gray-500 dark:text-gray-300 p-3">
            {model}
          </div>
        ) : null}
        {items.map((item, idx) => (
          <div
            id={idx.toString()}
            key={item.value}
            className={cn(
              "relative bg-secondary-1 rounded-lg my-2 w-full",
              {
                " bg-secondary-2": item.from === "gpt",
              }
            )}
          >
            <AnimatePresence>
              {currentPosition && currentPosition !== idx + 1 && (
                <motion.div
                  {...FADE_IN_ANIMATION_SETTINGS}
                  className="absolute w-full h-full z-10 bg-gray-300 dark:bg-black/30 bg-opacity-50 backdrop-blur-[2px] pointer-events-none"
                />
              )}
            </AnimatePresence>
            <div className="relative mx-auto max-w-screen-xl flex flex-col items-end justify-between w-full px-4 py-10 sm:flex-row sm:items-center ">
              <div className="w-full max-w-screen-md flex flex-1 mx-auto gap-[1.5rem] leading-[1.75] whitespace-pre-wrap">
                {item.from === "human" ? (
                  <Image
                    className="mr-2 rounded-sm h-[28px]"
                    alt="Avatar of the person chatting"
                    width="28"
                    height="28"
                    src={avatar || avatarUrl || `https://avatar.vercel.sh/${id}`}
                  />
                ) : (
                  <>{source === "bard" ? <BardChatAvatar /> : <GPTAvatar model={model} />}</>
                )}
                <div className="flex flex-col">
                  {item.from === "human" ? (
                    <p className="pb-2 whitespace-prewrap">{item.value}</p>
                  ) : (
                    <div
                      className={styles.response}
                      dangerouslySetInnerHTML={{ __html: item.value }}
                    />
                  )}
                </div>
              </div>
              <CommentBubbleGroup
                position={idx + 1}
                comments={comments?.filter(
                  (comment) => comment.position === idx + 1
                )}
              />
            </div>
          </div>
        ))}
         <div className="h-[100px] bg-gray-50 flex flex-col items-center justify-center w-full">
          <a
            className="text-blue hover:bg-accent hover:text-white p-2 rounded-md"
            rel="noopener noreferrer"
            target="_blank"
            href=" https://github.com/promptslab/SharePrompts"
          >
            <div>View source on GitHub</div>
          </a>
        </div>
      </div>
      <Banner views={view || 0} content={items} title={formatTitle(title)} componentRef={componentToPrintRef} />
    </>
  );
}

export const getStaticPaths = async () => {
  const convos = await prisma.conversation.findMany({
    select: {
      id: true,
    },
    where: {
      views: {
        gte: 20,
      },
    },
  });
  return {
    paths: convos.map((convo: { id: string }) => ({
      params: {
        id: convo.id,
      },
    })),
    fallback: "blocking",
  };
};

export const getStaticProps = async (
  context: GetStaticPropsContext & { params: ChatParams }
) => {
  const { id } = context.params;

  const props = await getConvo(id);
  if (props) {
    return { props, revalidate: 10 };
  } else {
    return { notFound: true, revalidate: 1 };
  }
};
