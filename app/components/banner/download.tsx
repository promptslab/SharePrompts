import { useCallback, useState, useRef, useEffect } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer"
import GneratePdf from "../GeneratePdf"
import { Download, Loader } from "lucide-react"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/shared/tooltip";
import ReactToPrint from "react-to-print";
import { LoadingCircle } from "../shared/icons";

export default function DownloadButton({title, componentRef}: any){


  const [loading, setLoading] = useState(false);

  const handleOnBeforeGetContent = useCallback(() => {
    setLoading(true);
  }, [setLoading]);

  const onAfterPrint = () => {
    setLoading(false);
  }

  const reactToPrintContent = useCallback(() => {
    return componentRef.current;
  }, [componentRef]);

    const reactToPrintTrigger = useCallback(() => {
        return (
            <div role="button" className="p-2 flex flex-col space-y-1 items-center rounded-md w-12 hover:bg-gray-100 active:bg-gray-200 transition-all">
                {loading ? <LoadingCircle /> : <Download className="h-4 w-4 mx-auto text-gray-600" />}<p className="text-center text-gray-600 text-sm">.pdf</p>
            </div>
        )
    }, [loading]);
    return (
        <ReactToPrint
            content={reactToPrintContent}
            documentTitle={title}
            onBeforeGetContent={handleOnBeforeGetContent}
            onAfterPrint={onAfterPrint}
            removeAfterPrint
            trigger={reactToPrintTrigger}
        />
    )
}
