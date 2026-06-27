import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function clean() {
  console.log('Cleaning mock data from database...');

  // Delete mock testimonials
  const deletedTestimonials = await prisma.testimonial.deleteMany({
    where: {
      name: {
        in: ['Sarah Mitchell', 'James Richardson', 'Emily Chen', 'Michael Torres', 'Lisa Park']
      }
    }
  });
  console.log(`Deleted ${deletedTestimonials.count} mock testimonials.`);

  // Delete mock charities
  const deletedCharities = await prisma.charity.deleteMany({
    where: {
      name: {
        in: ['First Tee', 'Youth on Course', 'Environmental Golf Fund']
      }
    }
  });
  console.log(`Deleted ${deletedCharities.count} mock charities.`);

  console.log('Cleanup complete.');
}

clean()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
