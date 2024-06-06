import {
  DraggableAttributes,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface ChildrenProps {
  attributes: DraggableAttributes;
  listeners?: SyntheticListenerMap;
  isDragging: boolean;
}

interface InteractivityProps {
  id: string | number;
  children:
    | React.ReactNode
    | ((childrenProps: ChildrenProps) => React.ReactNode);
}
function Draggable({ id, children }: InteractivityProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id,
    });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: `translate3d(${transform?.x}px, ${transform?.y}px, 0)`,
        cursor: isDragging ? "grabbing" : "grab",
        outline: "none",
        zIndex: isDragging ? 1 : 0,
      }}
      {...attributes}
      {...listeners}
    >
      {typeof children === "function"
        ? children({ attributes, listeners, isDragging })
        : children}
    </div>
  );
}

interface DraggableProps extends Omit<InteractivityProps, "children"> {
  overColor?: number[];
  children: React.ReactNode;
}
function Droppable({
  id,
  children,
  overColor = [0, 0, 0, 0.1],
}: DraggableProps) {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });
  const backgroundColor = overColor.map((color) => color.toString()).join(", ");

  return (
    <div
      ref={setNodeRef}
      style={{
        backgroundColor: isOver ? `rgba(${backgroundColor})` : "transparent",
      }}
    >
      {children}
    </div>
  );
}

interface SortableProps extends InteractivityProps {
  transitionProps?: {
    duration: number;
    easing: number[];
  };
  className?: string;
  attachListener?: boolean;
}
function Sortable({
  id,
  children,
  transitionProps,
  className,
  attachListener,
}: SortableProps) {
  const transitionValue = transitionProps?.easing
    .map((val) => val.toString())
    .join(", ");

  const {
    attributes,
    listeners,
    setNodeRef,
    transition,
    transform,
    isDragging,
  } = useSortable({
    id,
    ...(transitionProps && {
      transition: {
        duration: transitionProps.duration,
        easing: `cubic-bezier(${transitionValue})`,
      },
    }),
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    ...(attachListener && { cursor: isDragging ? "grabbing" : "grab" }),
    zIndex: isDragging ? 1 : 0,
    outline: "none",
  };
  return (
    <div
      style={style}
      ref={setNodeRef}
      {...(attachListener ? listeners : {})}
      {...(attachListener ? attributes : {})}
      className={className}
    >
      {typeof children === "function"
        ? children({ attributes, listeners, isDragging })
        : children}
    </div>
  );
}

/**
 * @description Custom hook to delay the rendering of the draggable overlay
 */
const useDragSensors = () => {
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10, // Enable sort function when dragging 10px
    },
  });
  const keyboardSensor = useSensor(KeyboardSensor);
  const touchSensor = useSensor(TouchSensor);
  const sensors = useSensors(mouseSensor, keyboardSensor, touchSensor);
  return sensors;
};

export { Draggable, Droppable, Sortable, useDragSensors };
