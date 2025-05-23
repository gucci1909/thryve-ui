import { z } from 'zod';

const leadershipSubSectionSchema = z.record(z.string(), z.number());

const leadershipSchema = z.object({
  DecisionMakingDelegation: leadershipSubSectionSchema,
  EmotionalIntelligenceEmpathy: leadershipSubSectionSchema,
  VisionStrategy: leadershipSubSectionSchema,
  TeamDevelopmentCoaching: leadershipSubSectionSchema,
  AdaptabilityInfluence: leadershipSubSectionSchema
});

const roleInfoSchema = z.object({
  role: z.string(),
  teamSize: z.string(),
  industry: z.string(),
  challenges: z.array(z.string())
});

const psychographicSchema = z.object({
  learningStyle: z.array(z.string()),
  coachingTone: z.array(z.string())
});

export const leadershipReportSchema = z.object({
  meta: z.object({
    include: z.array(z.enum(['leadership', 'roleInfo', 'psychographic']))
  }),
  sections: z.object({
    leadership: leadershipSchema.optional(),
    roleInfo: roleInfoSchema.optional(),
    psychographic: psychographicSchema.optional()
  })
});
