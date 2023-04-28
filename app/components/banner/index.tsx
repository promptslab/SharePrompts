import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { fetcher } from "@/lib/utils";
import useSWR from "swr";
import { AnimatePresence, motion } from "framer-motion";
import CopyButton from "./copy-button";
import SaveButton from "@/components/banner/save-button";
import DeleteButton from "./delete-button";
import ViewCounter from "./view-counter";
import DownloadButton from "./download";
import AccessControlButton from "./access-control-button";

export default function Banner({ views, content, title, componentRef }: { views: number, content: any, title: any, componentRef: any }) {
  const router = useRouter();
  const { id } = router.query as { id: string };

  const { data: { ttl } = {} } = useSWR<{
    ttl: number;
  }>(`/api/conversations/${id}/ttl`, fetcher);

  return (
    <AnimatePresence>
      {ttl && (
        <motion.div
          className="z-10 fixed bottom-5 inset-x-0 mx-auto lg:left-5 lg:inset-y-0 lg:mx-0 lg:my-auto max-h-fit max-w-fit rounded-lg px-3 py-2 shadow-md flex justify-between space-x-2 items-center"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
        >
          <div className="flex lg:flex-col gap-2">
            <div className="bg-white text-primary rounded-lg">
              <CopyButton />
            </div>
            <div className="bg-white text-primary rounded-lg">
              <SaveButton id={id} />
            </div>
            {
              ttl > 0 &&
            <div className="bg-white text-primary rounded-lg">
              <DeleteButton />
            </div>
            }
            <div className="bg-white text-primary rounded-lg">
              <ViewCounter views={views} />
            </div>
            <div className="bg-white text-primary rounded-lg">
              <DownloadButton title={title} componentRef={componentRef} />
            </div>
            { ttl > 0 &&
              <div className="bg-white text-primary rounded-lg">
                <AccessControlButton id={id} />
              </div>
            }
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
