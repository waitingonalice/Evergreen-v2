import React, { useState } from "react";
import { AlignJustify, PlusIcon, X } from "lucide-react";
import {
  Button,
  Dialog,
  Form,
  FormInput,
  Text,
} from "@waitingonalice/design-system";
import { Link } from "@/components";
import { BaseCVComponentProps, FormProps } from "../type";
import { SectionWrapper } from "./SectionWrapper";

type ProjectType = FormProps["projects"][number];
interface ProjectDialogProps {
  onAdd: (data: ProjectType) => void;
  onClose: () => void;
  open: boolean;
}

const init = {
  title: "",
  link: "",
  description: "",
  techstack: [],
  techstackField: "",
};
function ProjectDialog({ open, onAdd, onClose }: ProjectDialogProps) {
  const [field, setField] = useState<ProjectType & { techstackField: string }>(
    init,
  );
  const [showTechInput, setShowTechInput] = useState(false);

  const handleOnClose = () => {
    onClose();
    setField(init);
    setShowTechInput(false);
  };

  const handleAddProject = () => {
    onAdd(field);
    handleOnClose();
  };

  const handleOnChange = (
    key: keyof ProjectType | "techstackField",
    val: string,
  ) => {
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
      rightFooterChildren={
        <>
          <Button variant="secondary" onClick={handleOnClose}>
            Cancel
          </Button>
          <Button onClick={handleAddProject}>Add</Button>
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
        />
        <FormInput
          label="Link"
          onChange={(val) => handleOnChange("link", val)}
          value={field.link}
          size="small"
          placeholder="https://example.com"
        />
        <FormInput
          label="Description"
          as="textarea"
          onChange={(val) => handleOnChange("description", val)}
          value={field.description}
          placeholder="Describe your project"
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
              <AlignJustify className="w-4 h-4 ml-auto" />
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
            Add Techstack
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
  const [showDialog, setShowDialog] = useState(false);

  const handleModal = () => {
    setShowDialog((prev) => !prev);
  };

  const handleAddProject = (project: ProjectType) => {
    onChange("projects", [...data.projects, project]);
  };

  const handleRemoveProject = (index: number) => {
    const update = [...data.projects];
    update.splice(index, 1);
    onChange("projects", update);
  };

  return (
    <SectionWrapper buttonLabel="Add Project" onClick={handleModal}>
      <ProjectDialog
        onAdd={handleAddProject}
        onClose={handleModal}
        open={showDialog}
      />
      {data.projects.length > 0 && (
        <ul>
          {data.projects.map((project, index) => (
            <li key={project.link} className="mb-4 pb-4 border-b border-gray-2">
              <Link
                className="w-fit underline"
                variant="primaryLink"
                to={project.link}
              >
                <Text type="body-bold">{project.title}</Text>
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
              <Button
                onClick={() => handleRemoveProject(index)}
                className="w-fit ml-auto"
                variant="errorLink"
              >
                <Text type="body">Remove</Text>
              </Button>
            </li>
          ))}
        </ul>
      )}
    </SectionWrapper>
  );
}

export { Projects };
