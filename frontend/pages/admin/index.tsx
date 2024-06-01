import { GetServerSideProps } from "next";
import { clientRoutes } from "@/constants";

export const getServerSideProps: GetServerSideProps = async () => ({
  props: {},
  redirect: {
    destination: clientRoutes.admin.dashboard,
  },
});

export default function AdminRoot() {
  return <></>;
}
