import { Board } from "../../../api/boardApi";

export const boardDetailsMocks: Omit<Board, "id"> = {
  order: 1,
  name: "Board name",
  columns: [
    {
      id: "a",
      order: 1,
      name: "To Do",
      tasks: [],
    },
    {
      id: "b",
      order: 2,
      name: "Doing",
      tasks: [
        {
          id: "b1",
          order: 1,
          title: "Task C",
          description: "Task C description",
          subtasks: ["Subtask C.1", "Subtask C.2"],
        },
        {
          id: "b2",
          order: 2,
          title: "Task D",
          description: "Task D description",
          subtasks: [],
        },
        {
          id: "b3",
          order: 3,
          title: "Task E",
          description: "Task E description",
          subtasks: ["Subtask E.1"],
        },
        {
          id: "b4",
          order: 4,
          title: "Task F",
          description: "Task F description",
          subtasks: [],
        },
      ],
    },
    {
      id: "c",
      order: 3,
      name: "Done",
      tasks: [],
    },
  ],
};
