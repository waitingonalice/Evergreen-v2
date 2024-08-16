import { Request, Response } from "express";
import { ValueError, tryCatch } from "../../utils/errorHandler";
import { ErrorCodeEnum } from "../../constants/enums";
import { FilesModel, SelfHostGroupModel, SelfHostedModel } from "../../models";
import {
  AddNewServiceInputType,
  GroupedSelfHostedServiceResponseType,
  SelfHostedServiceResponseType,
} from "./types";
import { nanoid } from "nanoid";
import { addNewServiceSchema } from "./validation";

const handleAddNewGroup = tryCatch(async (req: Request, res: Response) => {
  const { accountId } = res.locals;
  const { name } = req.body;
  if (!name) {
    throw new ValueError("Name is required", ErrorCodeEnum.BAD_REQUEST);
  }
  const group = new SelfHostGroupModel({ name, accountId });
  const data = await group.addNewGroup().catch((err) => {
    throw new ValueError(err.message, ErrorCodeEnum.UNIQUE_CONSTRAINT);
  });

  return res.status(200).json({
    result: {
      id: data?.id,
      name,
    },
  });
});

const handleDeleteGroup = tryCatch(async (req: Request, res: Response) => {
  const { accountId } = res.locals;
  const { id } = req.params;
  const groupId = Number(id);
  const selfHostedModel = new SelfHostedModel({
    accountId,
    group_id: groupId,
  });
  const services = await selfHostedModel.listServicesPerGroup();
  if (services && services.length > 0) {
    const removeGroupConstraint = services.map((service) => {
      return new SelfHostedModel({
        id: service.id,
        name: service.name,
        url: service.url,
        group_id: null,
      }).updateSelfHost();
    });
    await Promise.all(removeGroupConstraint);
  }
  const groupModel = new SelfHostGroupModel({ id: groupId, accountId });
  const data = await groupModel.deleteGroup();
  if (!data) throw new ValueError("Group not found", ErrorCodeEnum.NOT_FOUND);
  return res.status(200).json({ result: "ok" });
});

const handleUpdateGroup = tryCatch(async (req: Request, res: Response) => {
  const { accountId } = res.locals;
  const { id, name } = req.body;
  const group = new SelfHostGroupModel({ id, name, accountId });
  const data = await group.updateGroupName();
  if (!data) throw new ValueError("Group not found", ErrorCodeEnum.NOT_FOUND);
  return res.status(200).json({
    result: {
      id,
      name,
    },
  });
});

/** List all groups and self-hosted services together */
const handleListSelfHost = tryCatch(async (_: Request, res: Response) => {
  const { accountId } = res.locals;
  const selfHostedModel = new SelfHostedModel({ accountId });
  const data = await selfHostedModel.listSelfHostServices();
  const groupMap = new Map<number, GroupedSelfHostedServiceResponseType>();
  const services: SelfHostedServiceResponseType[] = [];
  for (const row of data) {
    const {
      gr_id,
      gr_name,
      id,
      name,
      url,
      created_at,
      filename,
      filetype,
      filesize,
      filesrc,
    } = row;
    const file = {
      name: filename,
      type: filetype,
      size: filesize,
      src: filesrc,
    };
    if (!gr_id) {
      if (id)
        services.push({
          id,
          name,
          url,
          created_at,
          file,
        });
      continue;
    }
    if (!groupMap.has(gr_id)) {
      if (id) {
        groupMap.set(gr_id, {
          name: gr_name,
          id: gr_id,
          services: [{ id, name, url, created_at, file }],
        });
      } else {
        groupMap.set(gr_id, { name: gr_name, id: gr_id, services: [] });
      }
      continue;
    } else if (id) {
      const cachedGroup = groupMap.get(gr_id);
      cachedGroup?.services.push({ id, name, url, created_at, file });
    }
  }
  const groups = Array.from(groupMap.values());
  return res.status(200).json({
    result: {
      groups,
      services,
    },
  });
});

const handleAddNewSelfHost = tryCatch(async (req: Request, res: Response) => {
  const id = nanoid();
  const { accountId } = res.locals;
  const { name, url, groupId, file } = req.body as AddNewServiceInputType;

  const validate = addNewServiceSchema.safeParse({ name, url, groupId, file });
  if (!validate.success)
    throw new ValueError(validate.error.message, ErrorCodeEnum.BAD_REQUEST);

  const filesModel = file && new FilesModel({ ...file, self_hosted_id: id });
  const selfHostedModel = new SelfHostedModel({
    id,
    name,
    url,
    group_id: groupId,
    accountId,
    filesModel,
  });

  const data = await selfHostedModel.addNewSelfHost().catch((err) => {
    throw new ValueError(err.message, ErrorCodeEnum.BAD_REQUEST);
  });

  if (!data)
    throw new ValueError(
      "Unable to add new self-hosted service",
      ErrorCodeEnum.BAD_REQUEST,
    );

  return res.status(200).json({
    result: {
      id,
      name,
      url,
      groupId,
    },
  });
});

const handleDeleteSelfHost = tryCatch(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id)
    throw new ValueError("Service ID is required", ErrorCodeEnum.BAD_REQUEST);
  const selfHostedModel = new SelfHostedModel({ id });
  const data = await selfHostedModel.deleteSelfHost();
  if (!data) throw new ValueError("Service not found", ErrorCodeEnum.NOT_FOUND);
  return res.status(200).json({ result: "ok" });
});

const handleUpdateSelfHost = tryCatch(async (req: Request, res: Response) => {
  const { id, name, url, groupId, file } = req.body;
  const validate = addNewServiceSchema.safeParse({
    id,
    name,
    url,
    groupId,
    file,
  });

  if (!validate.success)
    throw new ValueError(validate.error.message, ErrorCodeEnum.BAD_REQUEST);

  const selfHostedModel = new SelfHostedModel({
    id,
    name,
    url,
    group_id: groupId,
  });
  const data = await selfHostedModel.updateSelfHost().catch((err) => {
    throw new ValueError(err.message, ErrorCodeEnum.BAD_REQUEST);
  });

  return res.status(200).json({
    result: data,
  });
});

export {
  handleAddNewSelfHost,
  handleListSelfHost,
  handleDeleteSelfHost,
  handleUpdateSelfHost,
  handleAddNewGroup,
  handleDeleteGroup,
  handleUpdateGroup,
};
