import type { Prisma } from '@prisma/client'
import { autoFitTextInCanvasJson } from '@/lib/editor/auto-fit'
import {
  applyVariablesToCanvasJson,
  type EventVariableContext,
} from '@/lib/editor/variables'
import { formatDate } from '@/lib/utils'

type CanvasJson = { objects?: Record<string, unknown>[]; [key: string]: unknown }

/** Sertifikat / nishon / ism tag uchun shaxsiy canvas. */
export function buildMaterialForParticipant(
  masterCanvas: CanvasJson,
  ctx: EventVariableContext,
  options?: { maxTextWidth?: number }
): CanvasJson {
  const maxWidth = options?.maxTextWidth ?? 580
  const withVars = applyVariablesToCanvasJson(masterCanvas, ctx) as CanvasJson
  return autoFitTextInCanvasJson(withVars, {
    targetSubstrings: [ctx.participantName ?? '', '{{'],
    maxWidth,
  }) as CanvasJson
}

export function buildParticipantContext(
  event: {
    name: string
    organization: string | null
    location: string | null
    date: Date | null
  },
  participant: { fullName: string; organization?: string | null }
): EventVariableContext {
  return {
    eventName: event.name,
    organization: event.organization ?? participant.organization ?? '',
    location: event.location ?? '',
    date: event.date ? formatDate(event.date.toISOString()) : '',
    participantName: participant.fullName,
  }
}

export function canvasToInputJson(data: CanvasJson): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(data)) as Prisma.InputJsonValue
}

/** @deprecated use buildMaterialForParticipant */
export const buildCertificateForParticipant = buildMaterialForParticipant
