import React, { useState } from "react";
import {
  createStyles,
  Table,
  ScrollArea,
  ActionIcon,
  Autocomplete,
  NumberInput,
} from "@mantine/core";
import { Check, Edit, EditOff, Trash } from "tabler-icons-react";
import { useForm } from "@mantine/form";

import { formatTime } from "../lib/dayjs";
import { fetchSetDelete, fetchSetUpdate } from "../services/setsService";
import { getMaxRep } from "../utils/calculations";

function getKeys(id) {
  return ["exercise", "weight", "reps"].map((x) => `${x}-${id}`);
}

const useStyles = createStyles((theme) => ({
  header: {
    position: "sticky",
    top: 0,
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    transition: "box-shadow 150ms ease",

    "&::after": {
      content: '""',
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      borderBottom: `1px solid ${
        theme.colorScheme === "dark"
          ? theme.colors.dark[3]
          : theme.colors.gray[2]
      }`,
    },
  },

  scrolled: {
    boxShadow: theme.shadows.sm,
  },
}));

type EditableSet = {
  onSetUpdate: (any) => void;
  onSetDelete: (any) => void;
  id: number;
  createdAt: string;
  exercise: string;
  weight: number;
  reps: number;
  form: any;
};

const EditableSet: React.FC<EditableSet> = ({
  onSetUpdate,
  onSetDelete,
  id,
  createdAt,
  exercise,
  weight,
  reps,
  form,
}) => {
  const [isEditing, setEditing] = useState(false);

  const [ek, wk, rk] = getKeys(id);
  const { values } = form;

  async function handleUpdate() {
    try {
      const data = await fetchSetUpdate({
        setId: id,
        exercise: values[ek],
        weight: values[wk],
        reps: values[rk],
      });

      onSetUpdate(data);
      setEditing(false);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDelete() {
    try {
      await fetchSetDelete({ setId: id });

      onSetDelete(id);
      setEditing(false);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <tr key={createdAt}>
      <td>{formatTime(createdAt)}</td>
      {isEditing ? (
        <>
          <td>
            <Autocomplete
              required
              // label=""
              placeholder="Exercise"
              data={["Bench", "OHP", "Squat", "Deadlift"]}
              {...form.getInputProps(ek)}
            />
          </td>
          <td>
            <NumberInput
              required
              placeholder="weight"
              // label="Weight"
              {...form.getInputProps(wk)}
            />
          </td>
          <td>
            <NumberInput
              required
              placeholder="reps"
              // label="Reps"
              {...form.getInputProps(rk)}
            />
          </td>
          <td>{getMaxRep(values[rk], values[wk])}</td>
          <td>
            <ActionIcon onClick={() => setEditing(false)}>
              <EditOff />
            </ActionIcon>
            <ActionIcon onClick={handleUpdate}>
              <Check />
            </ActionIcon>
          </td>
        </>
      ) : (
        <>
          <td>{exercise}</td>
          <td>{weight}</td>
          <td>{reps}</td>
          <td>{getMaxRep(reps, weight)}</td>
          <td>
            <ActionIcon onClick={() => setEditing(true)}>
              <Edit />
            </ActionIcon>
            <ActionIcon onClick={handleDelete}>
              <Trash />
            </ActionIcon>
          </td>
        </>
      )}
    </tr>
  );
};

type Set = {
  id: number;
  createdAt: string;
  exercise: string;
  weight: number;
  reps: number;
};

type TableProps = {
  data: Set[];
  onSetUpdate: (any) => void;
  onSetDelete: (any) => void;
};

function getInitialValues(data) {
  return data.reduce((values, { id, exercise, weight, reps }) => {
    const [ek, wk, rk] = getKeys(id);
    values[ek] = exercise;
    values[wk] = weight;
    values[rk] = reps;

    return values;
  }, {});
}

export const ExerciseTable: React.FC<TableProps> = ({
  data,
  onSetUpdate,
  onSetDelete,
}) => {
  const { classes, cx } = useStyles();
  const [scrolled, setScrolled] = useState(false);
  const form = useForm({
    initialValues: getInitialValues(data),

    validate: {
      weight: (value) => (value > 0 ? null : "Weight must be greater than 0"),
      reps: (value) => (value > 0 ? null : "Reps must be greater than 0"),
    },
  });

  const rows = data.map(({ id, createdAt, exercise, weight, reps }) => (
    <EditableSet
      key={`${exercise}=${id}`}
      onSetUpdate={onSetUpdate}
      onSetDelete={onSetDelete}
      id={id}
      createdAt={createdAt}
      exercise={exercise}
      weight={weight}
      reps={reps}
      form={form}
    />
  ));

  return (
    <ScrollArea
      sx={{ height: 300 }}
      onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
    >
      <form>
        <Table sx={{ minWidth: 700 }}>
          <thead
            className={cx(classes.header, { [classes.scrolled]: scrolled })}
          >
            <tr>
              <th>Time</th>
              <th>Exercise</th>
              <th>Weight</th>
              <th>Reps</th>
              <th>1 RM</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </form>
    </ScrollArea>
  );
};
