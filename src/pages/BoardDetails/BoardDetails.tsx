import type { MouseEvent } from "react";
import { useState } from "react";
import { Grid, Toolbar, Box, Paper, Typography, Link as MuiLink, IconButton, Button } from "@mui/material";
import { Link, Outlet, useParams } from "react-router-dom";
import { skipToken } from "@reduxjs/toolkit/query/react";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { grey } from "@mui/material/colors";
import EditIcon from "@mui/icons-material/Edit";
import {
  Draggable,
  DragDropContext,
  DroppableProvided,
  DraggableProvided,
  OnDragEndResponder,
  DraggableStateSnapshot,
  DroppableStateSnapshot,
} from "react-beautiful-dnd";

import { openConfirmationDialog } from "src/features/confirmationDialog/confirmationDialogSlice";
import { StrictModeDroppable } from "src/components/StrictModeDroppable/StrictModeDroppable";
import { openSingleInputForm } from "src/features/singleInputForm/singleInputFormSlice";
import { useMoveTaskMutation, useGetBoardDetailsQuery } from "src/api/boardApi";
import { openCreateTaskForm } from "src/features/taskForm/taskFormSlice";
import { selectThemeMode } from "src/features/themeMode/themeModeSlice";
import { ActionMenu } from "src/components/ActionMenu/ActionMenu";
import { TaskItem } from "src/components/TaskItem/TaskItem";
import { useAppDispatch, useAppSelector } from "src/store";
import { showAlert } from "src/features/alert/alertSlice";
import { Loading } from "src/components/Loading/Loading";
import { Error } from "src/components/Error/Error";

const COLUMN_WIDTH = 250;

export const BoardDetails = () => {
  const params = useParams();
  const dispatch = useAppDispatch();
  const { mode } = useAppSelector(selectThemeMode);
  const [moveTaskMutation] = useMoveTaskMutation();
  const { data: boardDetails, isLoading, isError } = useGetBoardDetailsQuery(params.boardId ?? skipToken);
  const [actionMenu, setActionMenu] = useState<{
    anchorEl: HTMLElement | null;
    buttonId: string | null;
  }>({
    anchorEl: null,
    buttonId: null,
  });

  const handleOpenMoreMenu = (event: MouseEvent<HTMLButtonElement>) => {
    setActionMenu({
      anchorEl: event.currentTarget,
      buttonId: event.currentTarget.id,
    });
  };

  const handleCloseMoreMenu = () => {
    setActionMenu({
      anchorEl: null,
      buttonId: null,
    });
  };

  const handleOnDragEnd: OnDragEndResponder = (result) => {
    if (!result.destination) return;

    moveTaskMutation({
      taskId: result.draggableId,
      order: result.destination.index + 1,
      columnTargetId: result.destination.droppableId,
    })
      .unwrap()
      .catch(() => {
        dispatch(
          showAlert({
            severity: "error",
            message: "Something went wrong. Please try again.",
          })
        );
      });
  };

  const handleAddNewTask =
    ({ columnId, boardId }: { columnId: string; boardId: string }) =>
    () => {
      handleCloseMoreMenu();
      dispatch(openCreateTaskForm({ columnId, boardId }));
    };

  const handleAddColumn = () => {
    if (!boardDetails?.id) return;

    dispatch(
      openSingleInputForm({
        type: "add-column",
        entityId: boardDetails.id,
      })
    );
  };

  const handleRenameColumn =
    ({ columnId, columnName }: { columnId: string; columnName: string }) =>
    () => {
      handleCloseMoreMenu();
      dispatch(
        openSingleInputForm({
          type: "rename-column",
          entityId: columnId,
          oldName: columnName,
        })
      );
    };

  const handleDeleteColumn = (columnId: string, columnName: string) => () => {
    handleCloseMoreMenu();
    dispatch(
      openConfirmationDialog({
        title: "Delete column?",
        content: `Are you sure you want to delete the "${columnName}" column and all tasks associated with it? This action cannot be undone.`,
        confirmationButtonLabel: "Delete",
        confirmationKey: "deleteColumn",
        deleteItemId: columnId,
      })
    );
  };

  if (isLoading) return <Loading />;

  if (isError) return <Error />;

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <StrictModeDroppable droppableId="Categories" type="droppableItem">
        {(provided) => {
          return (
            <Grid
              container
              ref={provided.innerRef}
              sx={{
                minWidth: "100%",
                width: "fit-content",
                height: "100%",
              }}
              gap={2}
              wrap="nowrap"
            >
              {boardDetails?.columns.map((column, index) => {
                const tasks = column.tasks.filter((task) => task.parents.length === 0);
                const moreMenuButtonId = "more-menu-btn-" + column.id;
                const moreMenuId = "more-menu-" + column.id;
                const actionMenuOpen = actionMenu.buttonId === moreMenuButtonId;
                const numberOfTasks = !!column.tasks.length && `(${column.tasks.length})`;

                return (
                  <Draggable draggableId={column.id} key={column.id} index={index}>
                    {(parentProvider) => {
                      return (
                        <Grid
                          ref={parentProvider.innerRef}
                          {...parentProvider.draggableProps}
                          key={column.id}
                          item
                          width={COLUMN_WIDTH}
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            px: 1,
                            paddingBottom: 1,
                          }}
                          component={Paper}
                          elevation={1}
                        >
                          <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
                            <Typography component="h3" align="center" noWrap>
                              {column.name} {numberOfTasks}
                            </Typography>

                            <IconButton
                              id={moreMenuButtonId}
                              aria-controls={actionMenuOpen ? moreMenuId : undefined}
                              aria-haspopup="true"
                              aria-expanded={actionMenuOpen ? "true" : undefined}
                              onClick={handleOpenMoreMenu}
                            >
                              <MoreVertIcon />
                            </IconButton>

                            <ActionMenu
                              open={actionMenuOpen}
                              id={moreMenuId}
                              aria-labelledby={moreMenuButtonId}
                              anchorEl={actionMenu.anchorEl}
                              onClose={handleCloseMoreMenu}
                              menuItems={[
                                {
                                  icon: <AddIcon />,
                                  label: "Add task",
                                  onClick: handleAddNewTask({
                                    columnId: column.id,
                                    boardId: boardDetails.id,
                                  }),
                                },
                                {
                                  icon: <EditIcon />,
                                  label: "Rename column",
                                  onClick: handleRenameColumn({
                                    columnId: column.id,
                                    columnName: column.name,
                                  }),
                                },
                                {
                                  icon: <DeleteIcon />,
                                  label: "Delete column",
                                  onClick: handleDeleteColumn(column.id, column.name),
                                },
                              ]}
                            />
                          </Toolbar>

                          <StrictModeDroppable droppableId={column.id}>
                            {(dropProvided: DroppableProvided, dropSnapshot: DroppableStateSnapshot) => {
                              const bgcolor = mode === "dark" ? grey[800] : grey.A100;

                              return (
                                <Box
                                  ref={dropProvided.innerRef}
                                  {...dropProvided.droppableProps}
                                  component="ul"
                                  sx={{
                                    height: "100%",
                                    bgcolor: dropSnapshot.isDraggingOver ? bgcolor : undefined,
                                    borderRadius: "4px",
                                    flex: 1,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "16px",
                                    margin: 0,
                                    padding: 0.5,
                                    listStyleType: "none",
                                    overflow: "auto",
                                    scrollbarWidth: "none",
                                    "-ms-overflow-style": "none",
                                    "&::-webkit-scrollbar": {
                                      display: "none",
                                    },
                                  }}
                                >
                                  {tasks.map((task, index) => {
                                    return (
                                      <Draggable key={task.id} draggableId={task.id} index={index}>
                                        {(dragProvided: DraggableProvided, dragSnapshot: DraggableStateSnapshot) => {
                                          return (
                                            <MuiLink
                                              ref={dragProvided.innerRef}
                                              {...dragProvided.draggableProps}
                                              {...dragProvided.dragHandleProps}
                                              component={Link}
                                              underline={dragSnapshot.combineTargetFor ? "always" : "none"}
                                              to={`/dashboard/boards/${params.boardId}/column/${column.id}/task/${task.id}`}
                                            >
                                              <TaskItem
                                                title={task.title}
                                                userAttached={task.userAttached}
                                                isDragging={dragSnapshot.isDragging}
                                                dateOfCreation={task.dateOfCreation}
                                              />
                                            </MuiLink>
                                          );
                                        }}
                                      </Draggable>
                                    );
                                  })}
                                  {dropProvided.placeholder}
                                </Box>
                              );
                            }}
                          </StrictModeDroppable>
                        </Grid>
                      );
                    }}
                  </Draggable>
                );
              })}

              <Grid
                item
                disableRipple
                component={Button}
                variant="outlined"
                onClick={handleAddColumn}
                sx={{
                  minWidth: COLUMN_WIDTH,
                  display: "flex",
                  flexDirection: "column",
                  px: 1,
                }}
              >
                Add column
              </Grid>
              <Outlet />
            </Grid>
          );
        }}
      </StrictModeDroppable>
    </DragDropContext>
  );
};
