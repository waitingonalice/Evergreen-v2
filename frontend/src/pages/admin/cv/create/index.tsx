/* eslint-disable import/no-cycle */
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AdminLayout, Grid } from "@/components";
import { clientRoutes } from "@/constants";
import { Certification } from "./components/Certification";
import { Experience } from "./components/Experience";
import { Projects } from "./components/Projects";
import { Skills } from "./components/Skills";
import { FormProps } from "./type";

interface CVProps {
  isEdit?: boolean;
}
function CreateCV({ isEdit = false }: CVProps) {
  const [form, setForm] = useState<FormProps>({
    languages: [],
    techstack: [],
    experiences: [],
    certifications: [],
    projects: [],
  } as FormProps);
  const router = useRouter();

  const handleBackClick = () => {
    router.push(clientRoutes.admin.cv.index);
  };

  const handleOnChange = <T,>(key: keyof FormProps, val: T) => {
    setForm((prev) => ({ ...prev, [key]: val }));
  };

  useEffect(() => {
    if (isEdit) {
      // const { id } = router.query;
      // fetch data from api
    }
  }, [isEdit, router.query]);

  return (
    <AdminLayout onBackClick={handleBackClick}>
      <AdminLayout.Content className="gap-y-8">
        <Grid title="Skills">
          <Skills data={form} onChange={handleOnChange} />
        </Grid>
        <Grid title="Experience">
          <Experience data={form} onChange={handleOnChange} />
        </Grid>
        <Grid title="Certification">
          <Certification data={form} onChange={handleOnChange} />
        </Grid>
        <Grid title="Projects">
          <Projects data={form} onChange={handleOnChange} />
        </Grid>
      </AdminLayout.Content>
    </AdminLayout>
  );
}

export { CreateCV };
