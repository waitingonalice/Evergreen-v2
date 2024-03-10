import { GetServerSideProps } from "next";
import { clientRoutes } from "@/constants";

export const getServerSideProps: GetServerSideProps = async () => ({
  props: {},
  redirect: {
    destination: clientRoutes.codeEditor.index,
  },
});

const Root = () => <></>;

export default Root;
