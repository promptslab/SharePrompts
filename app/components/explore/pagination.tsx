import { ChevronRight, ChevronLeft } from "lucide-react";
import { useRouter, NextRouter } from "next/router";
import { PAGINATION_LIMIT } from "@/lib/constants";
import useScroll from "@/lib/hooks/use-scroll";
import { useDebounce } from "use-debounce";

export const setPage = (router: NextRouter, page: number) => {
  router.replace(
    {
      query: {
        ...router.query,
        page: page,
      },
    },
    undefined,
    { shallow: true }
  );
};

const Button = ({ value }: { value: number }) => {
  const router = useRouter();
  const currentPage: number =
    router.query.page && typeof router.query.page === "string"
      ? parseInt(router.query.page)
      : 1;
  return (
    <button
      className={`${
        value === currentPage ? "bg-secondary-2 text-white" : "text-white/80"
      } font-semibold rounded-md min-w-[1.5rem] p-1 hover:bg-secondary-1 hover:text-white transition-all`}
      onClick={() => setPage(router, value)}
    >
      {value}
    </button>
  );
};

const Divider = () => {
  return (
  <div className="flex items-center justify-center gap-1">
    <div className="w-1 h-1 rounded-full bg-white" />
    <div className="w-1 h-1 rounded-full bg-white" />
    <div className="w-1 h-1 rounded-full bg-white" />
  </div>)
};

export default function Pagination({ count }: { count: number }) {
  const router = useRouter();
  const { search } = router.query as { search?: string };

  const paginatedCount = Math.ceil(count / PAGINATION_LIMIT);
  const paginationArray = !isNaN(paginatedCount)
    ? Array.from(Array(paginatedCount).keys())
    : [];

  const currentPage: number =
    router.query.page && typeof router.query.page === "string"
      ? parseInt(router.query.page)
      : 1;

  const show = useScroll(1500);

  return (
    <div
      className={`${
        show ? "bottom-5" : "-bottom-20"
      } sticky bottom-5 mt-2 rounded-md bg-secondary-1d text-white/80 p-4 shadow-lg h-20 flex flex-col justify-center items-center space-y-2 transition-all`}
    >
      <div className="flex space-x-2 items-center">
        {currentPage > 1 && paginatedCount > 5 && (
          <button
            onClick={() => setPage(router, currentPage - 1)}
            className="flex items-center justify-center rounded-md min-w-[1.5rem] p-1 bg-primary hover:bg-accent transition-all"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
        {paginationArray.length > 6 ? (
          currentPage > 3 && currentPage < paginationArray.length - 2 ? (
            <>
              <Button value={1} />
              <Divider />
              <Button value={currentPage - 1} />
              <Button value={currentPage} />
              <Button value={currentPage + 1} />
              <Divider />
              <Button value={paginationArray.length - 1} />
            </>
          ) : currentPage <= 3 ? (
            <>
              <Button value={1} />
              <Button value={2} />
              <Button value={3} />
              <Divider />
              <Button value={paginationArray.length} />
            </>
          ) : (
            <>
              <Button value={1} />
              <Divider />
              <Button value={paginationArray.length - 2} />
              <Button value={paginationArray.length - 1} />
              <Button value={paginationArray.length} />
            </>
          )
        ) : (
          paginationArray.map((i) => <Button key={i + 1} value={i + 1} />)
        )}
        {currentPage < paginatedCount && paginatedCount > 5 && (
          <button
            onClick={() => setPage(router, currentPage + 1)}
            className="flex items-center justify-center rounded-md min-w-[1.5rem] p-1 bg-primary hover:bg-accent transition-all"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
      <p className="text-white/80 text-sm">
        Showing {(currentPage - 1) * PAGINATION_LIMIT + 1} -{" "}
        {Math.min(currentPage * PAGINATION_LIMIT, count)} of{" "}
        {Intl.NumberFormat("en-us").format(count)} conversations
      </p>
    </div>
  );
}
