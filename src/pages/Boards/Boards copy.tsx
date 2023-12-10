import { Box, Button, Grid, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import { useGetAllBoardsQuery } from "src/api/boardApi";

import { useAppDispatch } from "src/store";
import { BoardItem } from "src/components/BoardItem/BoardItem";
import { Loading } from "src/components/Loading/Loading";
import { Error } from "src/components/Error/Error";
import { openCreateNewBoardForm } from "src/features/boardForm/boardFormSlice";

export const Boards = () => {
  const { data: boards, isLoading, isError } = useGetAllBoardsQuery();
  const dispatch = useAppDispatch();

  const handleOpenCreateBoardForm = () => {
    dispatch(openCreateNewBoardForm());
  };

  if (isLoading) return <Loading />;

  if (isError) return <Error />;

  return (
    <Grid container spacing={2}>
      {boards?.map((board) => (
        <Grid key={board.id} item xs={12} md={6} lg={3}>
          <BoardItem
            id={board.id}
            name={board.name}
            totalNumberOfTasks={board.totalNumberOfTasks}
            dateOfCreation={board.dateOfCreation}
          />
        </Grid>
      ))}

      <Grid item xs={12} md={6} lg={3}>
        <Button
          disableRipple
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleOpenCreateBoardForm}
          sx={{
            width: "100%",
            height: "300px",
            borderRadius: "30px",
          }}
        >
          Create Board
        </Button>
      </Grid>
    </Grid>
  );
};
