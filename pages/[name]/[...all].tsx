import { useRouter } from "next/router";
import { FC } from "react";
import { Layout } from "../../components/layout";
import { LitzComponent } from "../../components/litzComponent";

const AllLitzPage: FC = () => {
  const router = useRouter();

  return (
    <Layout>
      <LitzComponent {...getProps()} />
    </Layout>
  );

  function getProps() {
    const { name: originalName, all = [] } = router.query;
    const nameOrPrefix = Array.isArray(originalName)
      ? originalName[0]
      : originalName;

    if (all.length < 2 && all[0]?.includes(".")) {
      // example: /Patrick/73AF69E0-4F54-3568-FB8A-D6F3275233A9.gif
      return {
        name: nameOrPrefix,
        imageId: all[0],
      };
    } else {
      // examples:
      // /👩/Melanie
      // /d'/Melanie
      // /d'/Melanie/73AF69E0-4F54-3568-FB8A-D6F3275233A9.gif
      return {
        prefix: nameOrPrefix,
        name: all[0],
        imageId: all[1],
      };
    }
  }
};

export default AllLitzPage;
