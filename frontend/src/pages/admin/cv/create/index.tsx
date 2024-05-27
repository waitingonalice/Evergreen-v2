/* eslint-disable import/no-cycle */
import React, { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { nanoid } from "nanoid";
import { useRouter } from "next/router";
import {
  Spinner,
  ToastContextBaseProps,
  useToast,
} from "@waitingonalice/design-system/";
import { AdminLayout, Grid } from "@/components";
import { TopbarProps } from "@/components/layout/main/admin/Topbar";
import { clientRoutes } from "@/constants";
import { ValueError } from "@/utils/error";
import { Certification } from "./components/Certification";
import { Experience } from "./components/Experience";
import { Projects } from "./components/Projects";
import { Skills } from "./components/Skills";
import { useCreateResume } from "./loaders/cv";
import { FormProps } from "./type";
import { validateForm } from "./utils";

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
  const { renderToast } = useToast();
  const [createCv, createCVOptions] = useCreateResume();

  const handleBackClick = () => {
    router.push(clientRoutes.admin.cv.index);
  };

  const handleOnChange = <T,>(key: keyof FormProps, val: T) => {
    setForm((prev) => ({ ...prev, [key]: val }));
  };

  const handleCreateCV = async () => {
    const toastProps: ToastContextBaseProps = {
      title: "",
      variant: "success",
      key: nanoid(),
      show: true,
      position: "bottom-right",
    };
    try {
      validateForm(form);
      const response = await createCv(form);
      if (response.result) {
        renderToast({
          ...toastProps,
          title: "CV created successfully",
          position: "top-right",
          description: (
            <>
              You can view the generated CV in the records page. Click&nbsp;
              <a
                className="text-primary-main hover:text-primary-light underline underline-offset-2"
                href={`${clientRoutes.admin.records}?id=${response.result}`}
              >
                here
              </a>
              &nbsp;to be redirected.
            </>
          ),
        });
      }
    } catch (err) {
      if (err instanceof ValueError) {
        console.error(err.message);
        renderToast({
          ...toastProps,
          variant: "error",
          title: err.message,
        });
      }
      if (err instanceof AxiosError) {
        console.error(err.message);
        renderToast({
          ...toastProps,
          variant: "error",
          title: err.response?.data.detail.msg,
        });
      }
    }
  };

  useEffect(() => {
    if (isEdit) {
      // const { id } = router.query;
      // fetch data from api
    }
  }, [isEdit, router.query]);

  const buttonProps: TopbarProps["ctxButtons"] = [
    {
      onClick: handleCreateCV,
      children: createCVOptions.isLoading ? <Spinner /> : "Create",
      disabled: createCVOptions.isLoading,
    },
  ];

  return (
    <AdminLayout onBackClick={handleBackClick} ctxButtons={buttonProps}>
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
