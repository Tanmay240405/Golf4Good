import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const charitiesData = [];

const testimonialsData = [];

async function main() {
  console.log('Seeding charities...');

  // Clear existing charities
  await prisma.charity.deleteMany({});

  for (const charity of charitiesData) {
    const created = await prisma.charity.create({
      data: charity,
    });
    console.log(`Created charity: ${created.name}`);
  }

  console.log('Seeding testimonials...');
  // Clear existing testimonials
  await prisma.testimonial.deleteMany({});

  for (const testimonial of testimonialsData) {
    const created = await prisma.testimonial.create({
      data: testimonial,
    });
    console.log(`Created testimonial: ${created.name}`);
  }

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
