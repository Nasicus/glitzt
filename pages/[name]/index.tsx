import { useRouter } from "next/router";
import { FC } from "react";
import Layout from "../../components/layout";
import { LitzComponent } from "../../components/litzComponent";

const MainLitzPage: FC = () => {
  const router = useRouter();
  const { name } = router.query;

  return (
    <Layout>
      <LitzComponent name={Array.isArray(name) ? name[0] : name} />
    </Layout>
  );
};

export default MainLitzPage;
