import React, { useCallback, useEffect, useState } from 'react'
import { Lock, Unlock } from 'lucide-react';
import { fetcher, nFormatter } from "@/lib/utils";
import useSWR, { mutate } from "swr";
import { LoadingCircle } from "@/components/shared/icons";
import { useSignInModal } from "@/components/layout/sign-in-modal";
import { useSession } from "next-auth/react";
import { Bookmark } from "lucide-react";
import { useRef } from "react";
import useIntersectionObserver from "@/lib/hooks/use-intersection-observer";
import { toast } from "react-hot-toast";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/shared/tooltip";
import * as Switch from '@radix-ui/react-switch';

export default function AccessControlButton({ id }: { id: string }) {
  
    const buttonRef = useRef<any>();
    const entry = useIntersectionObserver(buttonRef, {});
    const isVisible = !!entry?.isIntersecting;

    const [submitting, setSubmitting] = useState(false);

    const [accessControl, setAccessControl] = useState({private: false});
  
    // const { data: accessControl, isValidating } = useSWR<{ private: boolean }>(
    //   isVisible ? `/api/conversations/${id}/accesscontrol` : null,
    //   fetcher
    // );

    const { data: ttlRedis } = useSWR<{
      ttl: number;
    }>(`/api/conversations/${id}/ttl`, fetcher);
  
    const [ttl, setTtl] = useState(ttlRedis?.ttl || 0);
  
    useEffect(() => {
      if (ttl <= 0) {
        return;
      }
      const timerId = setInterval(() => {
        setTtl((prevTtl: any) => prevTtl - 1);
      }, 1000);
  
      return () => {
        clearInterval(timerId);
      };
    }, [ttl]);

    const [domLoaded, setDomLoaded] = useState(false);

    const getAccessControl = useCallback(async function(){
      const res = await fetch(`/api/conversations/${id}/accesscontrol`);
      const data = await res.json();
      if(res.status !== 200) return;
      setAccessControl(data);
    }, [id])

    useEffect(() => {
      setDomLoaded(true);
      id && getAccessControl();
    }, [id, getAccessControl]);

    async function changeAccessControl (checked: boolean){
        if(submitting) return
        setSubmitting(true);
        try{
            const res= await fetch(`/api/conversations/${id}/accesscontrol`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({isPrivate: checked, id})
            })
            if(res.status === 404){
                toast(() => (
                    <div className="flex items-center flex-col justify-center space-y-1">
                        <p>Time exceeded cannot change the access</p>
                    </div>
                ));
                return;
            }
            await getAccessControl();
            setSubmitting(false);
            toast(() => (
                <div className="flex items-center flex-col justify-center space-y-1">
                    <p>{accessControl?.private ? 'Prompt made Public': 'Prompt made Private'}</p>
                </div>
            ));
        }
        catch(e){
        }
    }
    return (
      <>
        { domLoaded &&
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger
              ref={buttonRef}
              disabled={submitting}
              className={`${
                submitting ? "cursor-not-allowed" : ""
              } p-2 cursor-default flex flex-col space-y-1 items-center rounded-md hover:bg-gray-100 active:bg-gray-200 transition-all`}
            >
              <form>
                <div className='flex items-center gap-2 lg:flex-col'>
                  <div className=''>{accessControl?.private ? 'Private' : 'Public'}</div>
                  <div className='flex items-center gap-2'>
                    <Switch.Root className="SwitchRoot" onCheckedChange={changeAccessControl} checked={accessControl?.private} >
                      <Switch.Thumb className="SwitchThumb"  />
                    </Switch.Root>
                  </div>
                  <div className="text-center text-sm"> 
                    {(submitting) && <LoadingCircle />}
                    {ttl}s
                  </div>
                </div>
              </form>
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-primary">Make this conversation {accessControl?.private ? 'Private' : 'Public'}. If public It will be shown in home page else not</div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      }
      </>
    );
}
// () => {
//     setSubmitting(true);
//     fetch(`/api/conversations/${id}/save`, {
//       method: data?.saved ? "DELETE" : "POST",
//     }).then(() => {
//       mutate(`/api/conversations/${id}/save`).then(() =>
//         mutate(`/api/conversations/${id}/saves`).then(() => {
//           setSubmitting(false);
//           {
//             data?.saved
//               ? toast.success("Successfully unsaved conversation!")
//               : toast(() => (
//                   <div className="flex items-center flex-col justify-center space-y-1">
//                     <p>Successfully saved conversation!</p>
//                     <Link
//                       href="/dashboard"
//                       className="font-medium underline underline-offset-4 text-black"
//                     >
//                       View all your saved conversations.
//                     </Link>
//                   </div>
//                 ));
//           }
//         })
//       );
//     });
// }
