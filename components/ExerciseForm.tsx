import React from "react";
import { Grid, Autocomplete, NumberInput, Button } from "@mantine/core";
import { useForm } from "@mantine/form";
import { fetchSetCreate } from "../services/setsService";

type Props = {
  onSetCreate: (any) => void;
};

export const ExerciseForm: React.FC<Props> = ({ onSetCreate }) => {
  const form = useForm({
    initialValues: {
      exercise: "",
      weight: 0,
      reps: 0,
    },

    validate: {
      weight: (value) => (value > 0 ? null : "Weight must be greater than 0"),
      reps: (value) => (value > 0 ? null : "Reps must be greater than 0"),
    },
  });

  return (
    <form
      onSubmit={form.onSubmit(async (values) => {
        try {
          const data = await fetchSetCreate(values);

          onSetCreate(data);
          form.reset();
        } catch (error) {
          console.error(error);
        }
      })}
    >
      <Grid grow gutter="md">
        <Grid.Col md={3}>
          <Autocomplete
            required
            // label=""
            placeholder="Exercise"
            data={["Bench", "OHP", "Squat", "Deadlift"]}
            {...form.getInputProps("exercise")}
          />
        </Grid.Col>

        <Grid.Col md={3}>
          <NumberInput
            required
            placeholder="weight"
            // label="Weight"
            {...form.getInputProps("weight")}
          />
        </Grid.Col>

        <Grid.Col md={3}>
          <NumberInput
            required
            placeholder="reps"
            // label="Reps"
            {...form.getInputProps("reps")}
          />
        </Grid.Col>

        <Grid.Col md={3}>
          <Button type="submit">Submit</Button>
        </Grid.Col>
      </Grid>
    </form>
  );
};
