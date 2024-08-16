import React, { useState } from "react";
import { CopyIcon, MoveDiagonal2, Trash2 } from "lucide-react";
import { EllipsisHorizontalIcon } from "@heroicons/react/16/solid";
import {
  Button,
  Dropdown,
  DropdownMenuItem,
  cn,
} from "@waitingonalice/design-system";
import { FileType } from "@/types/fileRecords";
import { Image } from "../img";

interface OverlayProps {
  show: boolean;
  onEnlargeImage: () => void;
  src: string;
  onDelete: () => void;
}

function Ellipsis() {
  return (
    <div className="bg-white rounded-md w-7 h-7 m-2 flex items-center justify-center">
      <EllipsisHorizontalIcon className="w-4 h-auto" />
    </div>
  );
}

function Overlay({ show, onEnlargeImage, onDelete, src }: OverlayProps) {
  const [showMenu, setShowMenu] = useState(false);
  const handleShowMenu = () => {
    setShowMenu((prev) => !prev);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(src);
  };
  return (
    <div
      className={cn(
        "rounded-lg absolute w-full h-full bg-slate-800",
        show ? "visible opacity-70" : "invisible opacity-0",
        "transition-all duration-300",
      )}
    >
      <div className="w-full flex justify-end">
        <Dropdown
          open={showMenu}
          onOpenChange={handleShowMenu}
          trigger={<Ellipsis />}
        >
          <DropdownMenuItem onClick={handleCopy} className="flex gap-2">
            <CopyIcon className="w-4" />
            Copy
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onDelete} className="flex gap-2">
            <Trash2 className="w-4 text-error-main" /> Remove
          </DropdownMenuItem>
        </Dropdown>
      </div>
      <Button
        onClick={onEnlargeImage}
        variant="primaryLink"
        className="text-white hover:text-white mx-auto mb-auto mt-2"
      >
        <MoveDiagonal2 className="w-5" />
      </Button>
    </div>
  );
}

interface MediaGridProps {
  file: FileType;
  className?: string;
  onDelete: () => void;
}
function MediaGrid({ file, onDelete, className }: MediaGridProps) {
  const [hover, setHover] = useState(false);
  const handleMouseEnter = () => {
    setHover(true);
  };

  const handleMouseLeave = () => {
    setHover(false);
  };

  const handleEnlargeImage = () => {
    window.open(file.src, "_blank");
  };

  if (!file.src) return null;

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn("relative", "w-32 h-32", className)}
    >
      <Overlay
        show={hover}
        onEnlargeImage={handleEnlargeImage}
        onDelete={onDelete}
        src={file.src}
      />
      <Image
        src={file.src}
        width={128}
        height={128}
        alt={file.name}
        loading="lazy"
        className={cn("rounded-lg object-cover", "w-32 h-32", className)}
      />
    </div>
  );
}

export { MediaGrid };
