import { useState, MouseEvent } from "react";
import { Link, Outlet, useParams } from "react-router-dom";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { Grid, Toolbar, Box, Paper, Typography, Link as MuiLink, IconButton, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";

import { useAppDispatch } from "src/store";
import { useMoveTaskMutation, useGetBoardDetailsQuery } from "src/api/boardApi";
import { openConfirmationDialog } from "src/features/confirmationDialog/confirmationDialogSlice";
import { openSingleInputForm } from "src/features/singleInputForm/singleInputFormSlice";
import { openCreateTaskForm } from "src/features/taskForm/taskFormSlice";
import { Error } from "src/components/Error/Error";
import { Loading } from "src/components/Loading/Loading";
import { TaskItem } from "src/components/TaskItem/TaskItem";
import { ActionMenu } from "src/components/ActionMenu/ActionMenu";
import {
  DragDropContext,
  DroppableProvided,
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
  DroppableStateSnapshot,
  OnDragEndResponder,
} from "react-beautiful-dnd";
import { StrictModeDroppable } from "src/StrictModeDroppable";

export const BoardDetails = () => {
  const [actionMenu, setActionMenu] = useState<{
    anchorEl: HTMLElement | null;
    buttonId: string | null;
  }>({
    anchorEl: null,
    buttonId: null,
  });
  const params = useParams();

  const [moveTaskMutation, moveTaskMutationDetails] = useMoveTaskMutation();
  const { data: boardDetails, isLoading, isError } = useGetBoardDetailsQuery(params.boardId ?? skipToken);
  const dispatch = useAppDispatch();

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
      columnTargetId: result.destination.droppableId,
      order: result.destination.index + 1,
    });
  };

  const handleAddNewTask =
    ({ columnId, columnName }: { columnId: string; columnName: string }) =>
    () => {
      handleCloseMoreMenu();
      dispatch(openCreateTaskForm({ columnId, columnName }));
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

  const handleDeleteColumn = (columnId: string) => () => {
    handleCloseMoreMenu();
    dispatch(
      openConfirmationDialog({
        title: "Delete column?",
        content: "Are you sure you want to delete this column and all related tasks? This action cannot be undone.",
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
                          minWidth="250px"
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
                            <Typography component="h3" align="center" gutterBottom>
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
                                    columnName: column.name,
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
                                  onClick: handleDeleteColumn(column.id),
                                },
                              ]}
                            />
                          </Toolbar>

                          <StrictModeDroppable droppableId={column.id}>
                            {(dropProvided: DroppableProvided, dropSnapshot: DroppableStateSnapshot) => {
                              return (
                                <Box
                                  ref={dropProvided.innerRef}
                                  {...dropProvided.droppableProps}
                                  component="ul"
                                  sx={{
                                    flex: 1,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "16px",
                                    margin: 0,
                                    padding: 0,
                                    listStyleType: "none",
                                    overflow: "auto",
                                    scrollbarWidth: "none",
                                    "-ms-overflow-style": "none",
                                    "&::-webkit-scrollbar": {
                                      display: "none",
                                    },
                                  }}
                                  style={{
                                    height: "100%",
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
                                                isDragging={dragSnapshot.isDragging}
                                                title={task.title}
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
                  minWidth: "250px",
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
