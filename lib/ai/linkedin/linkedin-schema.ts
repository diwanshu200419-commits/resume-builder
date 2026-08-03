import { z } from "zod";

export const linkedinOptimizationSchema = z.object({
  profileScore: z.object({
    total: z.number().min(0).max(100),
    headline: z.number().min(0).max(20),
    about: z.number().min(0).max(20),
    keywords: z.number().min(0).max(20),
    experience: z.number().min(0).max(15),
    skills: z.number().min(0).max(10),
    completeness: z.number().min(0).max(10),
    discoverability: z.number().min(0).max(5),
    scoreExplanation: z.string(),
  }),

  roleAnalysis: z.object({
    targetRole: z.string(),
    industry: z.string(),
    experienceLevel: z.string(),
    isFresherMode: z.boolean(),
    isCareerSwitchMode: z.boolean(),
    careerTransitionBridge: z.string().optional().nullable(),
  }),

  headlineAnalysis: z.object({
    currentHeadline: z.string().optional().nullable(),
    currentHeadlineScore: z.number().min(0).max(100).optional().nullable(),
    identifiedWeaknesses: z.array(z.string()),
    improvedHeadline: z.string(),
    whyBetterExplanation: z.string(),
  }),

  headlines: z.array(
    z.object({
      type: z.enum([
        "Recruiter Search",
        "Value-Driven",
        "Technical / Domain",
        "Clean Professional",
        "Aspirational / Growth",
      ]),
      text: z.string().max(220),
      reason: z.string(),
    })
  ).min(3),

  aboutVersions: z.object({
    recruiterOptimized: z.string(),
    humanPersonal: z.string(),
    conciseProfessional: z.string(),
  }),

  experienceBullets: z.array(
    z.object({
      originalText: z.string(),
      optimizedBullet: z.string(),
      improvementReason: z.string(),
      addedVerifiedMetric: z.boolean(),
    })
  ),

  keywords: z.object({
    matchedVerifiedSkills: z.array(z.string()),
    partiallyRepresented: z.array(z.string()),
    recommendedToDevelop: z.array(z.string()),
  }),

  skillsStrategy: z.object({
    top5MustPin: z.array(z.string()),
    coreSkills: z.array(z.string()),
    toolsAndPlatforms: z.array(z.string()),
    domainKnowledge: z.array(z.string()),
    recommendedSkillsToLearn: z.array(z.string()),
  }),

  recruiterSearchKeywords: z.object({
    primaryRoleKeywords: z.array(z.string()),
    secondaryKeywords: z.array(z.string()),
    placementGuidance: z.string(),
  }),

  profileAssets: z.object({
    bannerTextIdea: z.string(),
    featuredSectionRecommendations: z.array(z.string()),
    recruiterRealityCheckRoast: z.string(),
  }),

  actionPlan: z.array(
    z.object({
      stepNumber: z.number(),
      title: z.string(),
      impact: z.enum(["HIGH", "MEDIUM", "LOW"]),
      instruction: z.string(),
    })
  ).min(3),
});

export type LinkedinOptimizationResult = z.infer<typeof linkedinOptimizationSchema>;
