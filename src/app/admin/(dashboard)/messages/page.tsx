import { getMessages } from "@/actions/admin";
import { MessagesManager } from "@/components/admin/MessagesManager";
import type { Message } from "@/types";

export default async function AdminMessagesPage() {
  const messages = (await getMessages()) as Message[];

  return <MessagesManager messages={messages} />;
}
