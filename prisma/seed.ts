import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding...`);
  // console.log(`Creating user...`);
  // const user = await prisma.user.create({
  //   data: {
  //     name: "Randal Rowland",
  //     email: "r.rowland93@gmail.com",
  //     sets: {
  //       create: [
  //         {
  //           exercise: "bench",
  //           weight: 185,
  //           reps: 6,
  //         },
  //         {
  //           exercise: "bench",
  //           weight: 185,
  //           reps: 5,
  //         },
  //         {
  //           exercise: "squat",
  //           weight: 225,
  //           reps: 6,
  //         },
  //         {
  //           exercise: "squat",
  //           weight: 225,
  //           reps: 5,
  //         },
  //         {
  //           exercise: "ohp",
  //           weight: 115,
  //           reps: 6,
  //         },
  //         {
  //           exercise: "deadlift",
  //           weight: 335,
  //           reps: 6,
  //         },
  //       ],
  //     },
  //   },
  // });
  // console.log(`User created: ${user.id}`);

  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
