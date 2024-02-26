export type Board = {
  id: string;
  order: number;
  name: string;
  columns: Column[];
  dateOfCreation: string;
  dateOfModification: string;
  totalNumberOfTasks?: number;
};

export type Column = {
  id: string;
  name: string;
  order: number;
  tasks: Task[];
  dateOfCreation: string;
  dateOfModification: string;
};

export type Task = {
  userAttached: string;
  title: string;
  description: string;
  status: string;
  id: string;
  columnId: string;
  order: number;
  dateOfCreation: string;
  dateOfModification: string;
  parents: {
    id: string;
    isCompleted: boolean;
    status: string;
    title: string;
  }[];
};
