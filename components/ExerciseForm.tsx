import React from "react";
import {
  Autocomplete,
  NumberInput,
  NativeSelect,
  Button,
  Group,
} from "@mantine/core";
import { useForm } from "@mantine/form";

export const ExerciseForm: React.FC = () => {
  const form = useForm({
    initialValues: {
      exercise: "",
      unit: "lbs",
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
        console.log(values);
        try {
          const result = await fetch(`http://localhost:3000/api/sets`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
          });
          const data = await result.json();
          console.error(data);
          form.reset();
        } catch (error) {
          console.error(error);
        }
      })}
    >
      <Autocomplete
        required
        // label=""
        placeholder="Exercise"
        data={["Bench", "OHP", "Squat", "Deadlift"]}
        {...form.getInputProps("exercise")}
      />

      <NumberInput
        required
        placeholder="weight"
        // label="Weight"
        {...form.getInputProps("weight")}
      />
      <NativeSelect
        required
        data={["lbs", "kgs"]}
        placeholder="unit"
        // label="Select your favorite framework/library"
        // description="This is anonymous"
        {...form.getInputProps("unit")}
      />
      <NumberInput
        required
        placeholder="reps"
        // label="Reps"
        {...form.getInputProps("reps")}
      />

      <Group position="right" mt="md">
        <Button type="submit">Submit</Button>
      </Group>
    </form>
  );
};
