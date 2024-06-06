import React, { useState } from "react";
import { Pencil, PlusIcon, Trash2, X } from "lucide-react";
import {
  Button,
  Dialog,
  Form,
  FormInput,
  Text,
  useForm,
} from "@waitingonalice/design-system";
import { Link } from "@/components";
import { useSection } from "../hooks/useSection";
import type { BaseCVComponentProps, FormProps, Projects } from "../type";
import { projectSchema } from "../utils";
import { SectionWrapper } from "./SectionWrapper";

interface ProjectDialogProps {
  onAdd: (data: Projects) => void;
  onClose: () => void;
  onEdit: (data: Projects) => void;
  data?: Projects | null;
  open: boolean;
}

type ProjectFields = Projects & { techstackField: string };

const init = {
  title: "",
  link: "",
  description: "",
  techstack: [],
  techstackField: "",
};
function ProjectDialog({
  open,
  data,
  onEdit,
  onAdd,
  onClose,
}: ProjectDialogProps) {
  const updateData = data && {
    ...data,
    techstackField: "",
  };

  const [field, setField] = useState<ProjectFields>(updateData ?? init);
  const [showTechInput, setShowTechInput] = useState(false);

  const form = useForm({
    zod: projectSchema,
    data: field,
  });

  const handleOnClose = () => {
    onClose();
    setField(init);
    setShowTechInput(false);
    form.clearErrors();
  };

  const handleAddProject = () => {
    const success = form.onSubmit();
    if (!success) return;
    onAdd(field);
    handleOnClose();
  };

  const handleEditProject = () => {
    const success = form.onSubmit();
    if (!success) return;
    onEdit(field);
    handleOnClose();
  };

  const handleAction = data ? handleEditProject : handleAddProject;

  const handleOnChange = (
    key: keyof Projects | "techstackField",
    val: string,
  ) => {
    form.validate(key, val);
    setField((prev) => ({ ...prev, [key]: val }));
  };

  const handleShowInput = () => {
    setShowTechInput((prev) => !prev);
  };

  const handleAddTechstack = () => {
    setField((prev) => ({
      ...prev,
      techstackField: "",
      techstack: [...prev.techstack, prev.techstackField],
    }));
    setShowTechInput(false);
  };

  const handleRemoveTechstack = (index: number) => {
    const updateTechstack = field.techstack.filter((_, i) => i !== index);
    setField((prev) => ({ ...prev, techstack: updateTechstack }));
  };

  return (
    <Dialog
      open={open}
      onClose={handleOnClose}
      title="Add Project"
      withOverlay
      rightFooterChildren={
        <>
          <Button variant="secondary" onClick={handleOnClose}>
            Cancel
          </Button>
          <Button onClick={handleAction}>{data ? "Edit" : "Add"}</Button>
        </>
      }
    >
      <div className="flex flex-col gap-y-4">
        <FormInput
          label="Project Name"
          onChange={(val) => handleOnChange("title", val)}
          value={field.title}
          size="small"
          placeholder="Project Name"
          showError={!!form.errors.title}
          errorMessage={form.errors.title}
        />
        <FormInput
          label="Link"
          onChange={(val) => handleOnChange("link", val)}
          value={field.link}
          size="small"
          placeholder="https://example.com"
          showError={!!form.errors.link}
          errorMessage={form.errors.link}
        />
        <FormInput
          label="Description"
          as="textarea"
          onChange={(val) => handleOnChange("description", val)}
          value={field.description}
          placeholder="Describe your project"
          showError={!!form.errors.description}
          errorMessage={form.errors.description}
        />
        <ul>
          {field.techstack.map((tech, index) => (
            <li
              key={tech}
              className="border-b-2 py-4 flex items-center gap-x-4"
            >
              <Button
                variant="primaryLink"
                onClick={() => handleRemoveTechstack(index)}
              >
                <X className="w-4 h-4" />
              </Button>
              <Text type="caption">{tech}</Text>
              {/* <AlignJustify className="w-4 h-4 ml-auto" /> */}
            </li>
          ))}
        </ul>
        {showTechInput ? (
          <Form onSubmit={handleAddTechstack} className="flex gap-x-4">
            <FormInput
              size="small"
              placeholder="Add technology stack"
              onChange={(val) => handleOnChange("techstackField", val)}
              value={field.techstackField}
            />
            <Button type="submit" size="small">
              <PlusIcon className="w-4 h-4" />
            </Button>
          </Form>
        ) : (
          <Button className="w-fit" onClick={handleShowInput} size="small">
            <PlusIcon className="w-4 h-4" /> Add Techstack
          </Button>
        )}
      </div>
    </Dialog>
  );
}

function Projects({
  data,
  onChange,
}: BaseCVComponentProps<FormProps["projects"]>) {
  const {
    data: projectData,
    showDialog,
    handleEdit,
    handleEditCommit,
    handleModal,
    handleRemove,
  } = useSection(data.projects);

  const handleAddProject = (project: Projects) => {
    onChange("projects", [...data.projects, project]);
  };

  const handleRemoveProject = (index: number) => {
    onChange("projects", handleRemove(index));
  };

  const handleCommitProjects = (project: Projects) => {
    onChange("projects", handleEditCommit(project));
  };
  return (
    <SectionWrapper buttonLabel="Add Project" onClick={handleModal}>
      {showDialog && (
        <ProjectDialog
          data={projectData?.data}
          onEdit={handleCommitProjects}
          onAdd={handleAddProject}
          onClose={handleModal}
          open={showDialog}
        />
      )}
      {data.projects.length > 0 && (
        <ul>
          {data.projects.map((project, index) => (
            <li key={project.link} className="mb-4 pb-4 border-b border-gray-2">
              <Link
                className="w-fit underline"
                variant="primaryLink"
                to={project.link}
                textSize="body-bold"
              >
                {project.title}
              </Link>

              <Text className="my-2" type="caption">
                {project.description}
              </Text>
              <div className="flex flex-wrap gap-x-2">
                {project.techstack.map((tech) => (
                  <div
                    key={tech}
                    className="border border-gray-3 rounded-md p-1"
                  >
                    <Text type="caption">{tech}</Text>
                  </div>
                ))}
              </div>
              <span className="flex gap-x-4 justify-end w-full">
                <Button onClick={() => handleEdit(index)} variant="primaryLink">
                  <Pencil className="w-4 h-4" />
                  <Text type="body">Edit</Text>
                </Button>
                <Button
                  onClick={() => handleRemoveProject(index)}
                  variant="errorLink"
                >
                  <Trash2 className="w-4 h-4" />
                  <Text type="body">Remove</Text>
                </Button>
              </span>
            </li>
          ))}
        </ul>
      )}
    </SectionWrapper>
  );
}

export { Projects };
