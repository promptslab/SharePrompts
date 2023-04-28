import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function useView() {
  const router = useRouter();
  const { id } = router.query as { id: string };
  const [view, setView] = useState();
  useEffect(() => {
    if (id) {
      fetch(`/api/conversations/${id}/view`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]); // to make sure hook is only called once on mount

  const getView = async () => {
    if (id) {
      const res = await fetch(`/api/conversations/${id}/view`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setView(data.rows[0].views)
    }
  }

  useEffect(() => {
    getView()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  return view;

} // not when reactStrictMode is true, this is fired twice, but it only happens in dev, not prod
