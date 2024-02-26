import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import type { TaskFormValues } from "src/models/forms";
import { taskFormValidationSchema } from "src/utils/validationSchemas";

export const useTaskForm = () => {
  return useForm<TaskFormValues>({
    resolver: zodResolver(taskFormValidationSchema),
    defaultValues: {
      title: "",
      column: "",
      assignee: "",
      description: "",
    },
  });
};
