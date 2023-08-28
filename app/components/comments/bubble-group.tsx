import { CommentProps } from "@/lib/types";
import CommentBubble from "./bubble";
import MoreCommentsBubble from "./more-bubble";
import { AnimatePresence, motion } from "framer-motion";

export default function CommentBubbleGroup({
  position,
  comments,
}: {
  position: number;
  comments?: CommentProps[];
}) {
  return (
    <AnimatePresence>
      {comments && (
        <motion.div
          key={`position-${comments.length}`}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mx-2 min-w-[100px]"
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.05,
              },
            },
          }}
        >
          {comments.slice(0, 3).map((comment) => (
            <CommentBubble key={comment.id} comment={comment} />
          ))}
          <MoreCommentsBubble position={position} count={comments.length - 3} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
