import { Button, Grid } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import { openSingleInputForm } from "src/features/singleInputForm/singleInputFormSlice";
import { BoardItem } from "src/components/BoardItem/BoardItem";
import { Loading } from "src/components/Loading/Loading";
import { useGetAllBoardsQuery } from "src/api/boardApi";
import { Error } from "src/components/Error/Error";
import { useAppDispatch } from "src/store";

export const Boards = () => {
  const dispatch = useAppDispatch();
  const { data: boards, isLoading, isError } = useGetAllBoardsQuery();

  const handleOpenCreateBoardForm = () => {
    dispatch(
      openSingleInputForm({
        type: "create-board",
      })
    );
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
