import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";

export type JourneyListItem = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  createdAt: Date;
  activeAttempt: {
    id: string;
    attemptNumber: number;
    status: string;
    startDate: Date;
  } | null;
};

export type TrailTask = {
  id: string;
  title: string;
  description: string | null;
  externalLink: string | null;
  order: number;
};

export type TrailTopic = {
  id: string;
  title: string;
  order: number;
  tasks: TrailTask[];
};

export type JourneyDetail = JourneyListItem & {
  topics: TrailTopic[];
};

function mapJourneyWithAttempt(
  journey: {
    id: string;
    title: string;
    description: string | null;
    category: string | null;
    createdAt: Date;
    attempts: {
      id: string;
      attemptNumber: number;
      status: string;
      startDate: Date;
    }[];
  }
): JourneyListItem {
  const activeAttempt = journey.attempts[0] ?? null;

  return {
    id: journey.id,
    title: journey.title,
    description: journey.description,
    category: journey.category,
    createdAt: journey.createdAt,
    activeAttempt,
  };
}

function mapJourneyDetail(
  journey: {
    id: string;
    title: string;
    description: string | null;
    category: string | null;
    createdAt: Date;
    attempts: {
      id: string;
      attemptNumber: number;
      status: string;
      startDate: Date;
    }[];
    topics: TrailTopic[];
  }
): JourneyDetail {
  return {
    ...mapJourneyWithAttempt(journey),
    topics: journey.topics,
  };
}

const journeyInclude = {
  attempts: {
    where: { status: "active" },
    orderBy: { attemptNumber: "desc" as const },
    take: 1,
    select: {
      id: true,
      attemptNumber: true,
      status: true,
      startDate: true,
    },
  },
};

export async function getJourneysForUser(
  userId: string
): Promise<JourneyListItem[]> {
  const journeys = await prisma.journey.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      description: true,
      category: true,
      createdAt: true,
      ...journeyInclude,
    },
  });

  return journeys.map(mapJourneyWithAttempt);
}

export async function getJourneyForUser(
  journeyId: string,
  userId: string
): Promise<JourneyDetail | null> {
  const journey = await prisma.journey.findFirst({
    where: { id: journeyId, userId },
    select: {
      id: true,
      title: true,
      description: true,
      category: true,
      createdAt: true,
      ...journeyInclude,
      topics: {
        orderBy: { order: "asc" },
        select: {
          id: true,
          title: true,
          order: true,
          tasks: {
            orderBy: { order: "asc" },
            select: {
              id: true,
              title: true,
              description: true,
              externalLink: true,
              order: true,
            },
          },
        },
      },
    },
  });

  if (!journey) {
    return null;
  }

  return mapJourneyDetail(journey);
}

export async function requireAuthenticatedUser() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  return session.user;
}
