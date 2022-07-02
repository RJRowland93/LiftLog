const HOST_URL = "http://localhost:3000";

export async function fetchSetCreate({ exercise, weight, reps }) {
  const result = await fetch(`${HOST_URL}/api/sets`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      exercise,
      weight,
      reps,
    }),
  });

  return await result.json();
}

export async function fetchSetUpdate({ setId, exercise, weight, reps }) {
  const result = await fetch(`${HOST_URL}/api/sets`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ setId, exercise, weight, reps }),
  });

  return await result.json();
}

export async function fetchSetDelete({ setId }) {
  const result = await fetch(`${HOST_URL}/api/sets`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ setId }),
  });

  return await result.json();
}
