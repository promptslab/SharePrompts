export interface ConversationProps {
  id: string;
  model?: string;
  title?: string;
  avatar?: string;
  source: "gpt" | "bard" 
  content: {
    title?: string;
    avatarUrl: string;
    model?: string;
    source: string;
    items: {
      from: "human" | "gpt";
      value: string;
    }[];
  };
  comments: CommentProps[];
  views: number;
}

export interface ConversationMeta {
  id: string;
  title: string;
  avatar: string;
  source: "gpt" | "bard";
  creator: {
    name: string;
    image: string;
  };
  saves: number;
  comments: number;
  views: number;
  createdAt: Date;
}

export interface Session {
  user: {
    email?: string | null;
    id?: string | null;
    name?: string | null;
  };
}

export interface CommentProps {
  id: string;
  content: string;
  position: number;
  user: {
    name: string;
    username: string;
    image: string;
  };
  createdAt: Date;
}
