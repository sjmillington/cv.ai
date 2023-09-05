import DefaultLayout from "~/layouts/layout";
import Link from "next/link";

import { api } from "~/utils/api";

export default function Home() {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <DefaultLayout>
      <p>Index!</p>
    </DefaultLayout>
  );
}

