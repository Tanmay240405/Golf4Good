import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const charitiesData = [
  {
    name: 'First Tee',
    description: 'First Tee is a youth development organization that introduces the game of golf and its inherent values to young people. Through after-school and in-school programs, we help shape the character of kids and teens by introducing them to values like integrity, respect, and perseverance.',
    logo: 'https://images.unsplash.com/photo-1535137838244-463178ee89a7?auto=format&fit=crop&q=80&w=200&h=200',
    coverImage: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?auto=format&fit=crop&q=80&w=1200&h=600',
    website: 'https://firsttee.org',
    upcomingEvents: JSON.stringify([
      { title: 'Youth Golf Clinic', date: '2026-07-15', location: 'Pebble Beach' },
      { title: 'Annual Charity Gala', date: '2026-08-22', location: 'San Francisco' }
    ]),
    donationTotal: 12500.0,
  },
  {
    name: 'Youth on Course',
    description: 'Youth on Course provides youth ages 6-18 with access to life-changing opportunities through golf. Members get access to play round of golf at hundreds of participating courses across North America for $5 or less, removing the financial barrier to the game.',
    logo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200',
    coverImage: 'https://images.unsplash.com/photo-1535137838244-463178ee89a7?auto=format&fit=crop&q=80&w=1200&h=600',
    website: 'https://youthoncourse.org',
    upcomingEvents: JSON.stringify([
      { title: 'Summer Championship', date: '2026-07-30', location: 'St Andrews' },
      { title: '$5 Play Day', date: '2026-09-05', location: 'National' }
    ]),
    donationTotal: 8400.0,
  },
  {
    name: 'Environmental Golf Fund',
    description: 'Dedicated to promoting environmental sustainability and ecological conservation on golf courses worldwide. We fund research and initiatives that improve water conservation, enhance wildlife habitats, and reduce chemical usage in turf management.',
    logo: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=200&h=200',
    coverImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=1200&h=600',
    website: 'https://e-golf-fund.org',
    upcomingEvents: JSON.stringify([
      { title: 'Eco-Golf Summit', date: '2026-10-10', location: 'Denver' }
    ]),
    donationTotal: 3100.0,
  }
];

const testimonialsData = [
  {
    name: 'Sarah Mitchell',
    role: 'Amateur Golfer, New York',
    content: "Golf4Good completely changed how I think about my weekend rounds. I'm not just playing for myself anymore — I'm playing for my local food bank. The monthly competitions keep me motivated, and the community is incredible.",
    rating: 5,
    avatar: 'SM',
  },
  {
    name: 'James Richardson',
    role: 'Club Captain, Austin Golf Club',
    content: "We enrolled our entire club on the Enterprise plan. The team dashboard and custom tournaments have transformed our member engagement. Plus, we've raised over $15,000 for local charities in just six months.",
    rating: 5,
    avatar: 'JR',
  },
  {
    name: 'Emily Chen',
    role: 'Pro Golfer & Charity Advocate',
    content: "As someone who's always looked for ways to combine golf with giving back, this platform is a dream. The analytics are top-notch, and the charitable impact tracking gives real transparency.",
    rating: 5,
    avatar: 'EC',
  },
  {
    name: 'Michael Torres',
    role: 'Weekend Golfer, San Diego',
    content: "I love that I can choose which charities receive my contributions. The Pro plan analytics helped me drop my handicap by 3 strokes, and I feel good knowing every round makes a difference.",
    rating: 5,
    avatar: 'MT',
  },
  {
    name: 'Lisa Park',
    role: 'Corporate Events Manager',
    content: "We used Golf4Good for our annual corporate charity tournament. The white-label options and custom reporting made it seamless. Our employees loved the competitive aspect and charitable tie-in.",
    rating: 5,
    avatar: 'LP',
  },
];

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
