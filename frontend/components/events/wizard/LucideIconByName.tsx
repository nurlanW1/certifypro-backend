'use client'

import {
  Users,
  BookOpen,
  MessageSquare,
  Wrench,
  Building2,
  FlaskConical,
  GraduationCap,
  MoreHorizontal,
  MapPin,
  Award,
  CreditCard,
  Mail,
  FileText,
  Image,
  Share2,
  AtSign,
  Triangle,
  AlignLeft,
  Layout,
  Tag,
  Star,
  Calendar,
  Palette,
  Check,
  Upload,
  Trash2,
  Crown,
  Package,
  ClipboardList,
  Rocket,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const ICON_MAP: Record<string, LucideIcon> = {
  Users,
  BookOpen,
  MessageSquare,
  Wrench,
  Building2,
  FlaskConical,
  GraduationCap,
  MoreHorizontal,
  MapPin,
  Award,
  CreditCard,
  Mail,
  FileText,
  Image,
  Share2,
  AtSign,
  Triangle,
  AlignLeft,
  Layout,
  Tag,
  Star,
  Calendar,
  Palette,
  Check,
  Upload,
  Trash2,
  Crown,
  Package,
  ClipboardList,
  Rocket,
}

interface LucideIconByNameProps {
  name: string
  className?: string
}

export function LucideIconByName({ name, className }: LucideIconByNameProps) {
  const Icon = ICON_MAP[name]
  if (!Icon) return null
  return <Icon className={cn('h-5 w-5', className)} />
}
