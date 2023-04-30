import { useCallback, useState } from "react";
import { Download } from "lucide-react"
import ReactToPrint from "react-to-print";
import { LoadingCircle } from "../shared/icons";
import html2canvas from 'html2canvas';


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

  function downloadAsPng(){
    const title = componentRef.current.querySelector(".prompt-title").innerText;
    const h3 = document.createElement('h3');
    const div = document.createElement('div');
    h3.innerText = title;
    h3.classList.add('text-primary', 'text-center');
    div.classList.add('p-4')
    div.appendChild(h3);
    div.innerHTML += componentRef.current?.innerHTML;
    const elemToRemove = div.querySelector('.prompt-title-cnt') as HTMLElement;
    div.style.display = 'hidden';
    document.body.appendChild(div);
    if(elemToRemove)
      elemToRemove.style.display = 'none';
    html2canvas(div).then(function(canvas) {
      var link = document.createElement('a');
      link.href = canvas.toDataURL("image/png");
      link.download = `${title}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      div.style.display = 'none'
      document.body.removeChild(div);
    });
  }

    const reactToPrintTrigger = useCallback(() => {
        return (
            <div role="button" className="p-1 flex flex-col space-y-1 items-center rounded-md bg-secondary-1 w-[50px] h-[50px]">
                {loading ? <LoadingCircle /> : <Download className="h-4 w-4 mx-auto text-gray-600" />}<p className="text-center text-xs">.pdf</p>
            </div>
        )
    }, [loading]);
    return (
      <div className="p-2 bg-white rounded-md flex items-center gap-2">
        <ReactToPrint
            content={reactToPrintContent}
            documentTitle={title}
            onBeforeGetContent={handleOnBeforeGetContent}
            onAfterPrint={onAfterPrint}
            removeAfterPrint
            trigger={reactToPrintTrigger}
        />
        <div role="button" className="p-1 flex flex-col space-y-1 items-center rounded-md bg-secondary-1 w-[50px] h-[50px]" onClick={downloadAsPng}>
          <Download className="h-4 w-4 mx-auto text-gray-600" /><p className="text-center text-xs">.png</p>
        </div>
      </div>
    )
}
