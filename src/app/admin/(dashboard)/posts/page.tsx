import { getPosts } from "@/actions/posts";
import { PostsList } from "@/components/admin/PostsManager";
import type { Post } from "@/types";

export default async function AdminPostsPage() {
  const posts = (await getPosts()) as Post[];

  return <PostsList posts={posts} />;
}
