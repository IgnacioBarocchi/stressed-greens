/**
 * This file may contain code that uses generative AI for code assistance, unit testing and/or entire functions.
 * The generative model(s) used may be a combination of GitHub Copilot, OpenAI ChatGPT or others.
 */

import { assertInvariant } from "@/lib/utils"

// Domain model schema
export const DEFAULT_IMAGE_URL = "https://placehold.co/400x400"

export interface VegetablePreset {
  name: string
  lifespanWholeDays: number
  lifespanCutDays: number
  icon: string
  imageUrl: string
}

export interface VegetableItem {
  id: string
  name: string
  quantity: number | null
  unit: string | null
  fridgeDate: string // ISO date string
  lifespanWholeDays: number
  lifespanCutDays: number
  wasCut: boolean
  isMock?: boolean
  imageUrl?: string
}

// Preset vegetable database
export const VEGETABLE_PRESETS: VegetablePreset[] = [
  { name: "Bell Pepper", lifespanWholeDays: 14, lifespanCutDays: 5, icon: "pepper", imageUrl: '/vegetables-source/bell-pepper.png' },
  { name: "Spinach", lifespanWholeDays: 5, lifespanCutDays: 3, icon: "leaf", imageUrl: '/vegetables-source/spinach.png' },
  { name: "Carrot", lifespanWholeDays: 30, lifespanCutDays: 7, icon: "carrot", imageUrl: '/vegetables-source/carrot.png' },
  { name: "Zucchini", lifespanWholeDays: 5, lifespanCutDays: 3, icon: "squash", imageUrl: '/vegetables-source/zucchini.png' },
  { name: "Broccoli", lifespanWholeDays: 7, lifespanCutDays: 4, icon: "broccoli", imageUrl: '/vegetables-source/broccoli.png' },
  { name: "Cucumber", lifespanWholeDays: 5, lifespanCutDays: 2, icon: "cucumber", imageUrl: '/vegetables-source/cucumber.png' },
  { name: "Tomato", lifespanWholeDays: 10, lifespanCutDays: 3, icon: "tomato", imageUrl: '/vegetables-source/tomato.png' },
  { name: "Kale", lifespanWholeDays: 7, lifespanCutDays: 3, icon: "leaf", imageUrl: '/vegetables-source/kale.png' },
  { name: "Celery", lifespanWholeDays: 14, lifespanCutDays: 5, icon: "celery", imageUrl: '/vegetables-source/celery.png' },
  { name: "Mushroom", lifespanWholeDays: 5, lifespanCutDays: 2, icon: "mushroom", imageUrl: '/vegetables-source/mushroom.png' },
  { name: "Onion", lifespanWholeDays: 45, lifespanCutDays: 7, icon: "onion", imageUrl: '/vegetables-source/onion.png' },
  { name: "Garlic", lifespanWholeDays: 90, lifespanCutDays: 10, icon: "garlic", imageUrl: '/vegetables-source/garlic.png' },
  { name: "Cauliflower", lifespanWholeDays: 10, lifespanCutDays: 4, icon: "broccoli", imageUrl: '/vegetables-source/cauliflower.png' },
  { name: "Lettuce", lifespanWholeDays: 7, lifespanCutDays: 2, icon: "leaf", imageUrl: '/vegetables-source/lettuce.png' },
  { name: "Asparagus", lifespanWholeDays: 4, lifespanCutDays: 2, icon: "asparagus", imageUrl: '/vegetables-source/asparagus.png' },
  { name: "Green Bean", lifespanWholeDays: 7, lifespanCutDays: 3, icon: "bean", imageUrl: '/vegetables-source/green-bean.png' },
  { name: "Eggplant", lifespanWholeDays: 6, lifespanCutDays: 3, icon: "eggplant", imageUrl: '/vegetables-source/eggplant.png' },
  { name: "Radish", lifespanWholeDays: 14, lifespanCutDays: 5, icon: "radish", imageUrl: '/vegetables-source/radish.png' },
  { name: "Sweet Potato", lifespanWholeDays: 60, lifespanCutDays: 7, icon: "potato", imageUrl: '/vegetables-source/sweet-potato.png' },
  { name: "Cabbage", lifespanWholeDays: 21, lifespanCutDays: 7, icon: "cabbage", imageUrl: '/vegetables-source/cabbage.png' },

  { name: "Arugula", lifespanWholeDays: 5, lifespanCutDays: 2, icon: "leaf", imageUrl: '/vegetables-source/arugula.png' },
  { name: "Parsley", lifespanWholeDays: 7, lifespanCutDays: 3, icon: "herb", imageUrl: '/vegetables-source/parsley.png' },
  { name: "Cilantro", lifespanWholeDays: 7, lifespanCutDays: 3, icon: "herb", imageUrl: '/vegetables-source/cilantro.png' },
  { name: "Leek", lifespanWholeDays: 14, lifespanCutDays: 5, icon: "leek", imageUrl: '/vegetables-source/leek.png' },
  { name: "Brussels Sprouts", lifespanWholeDays: 10, lifespanCutDays: 4, icon: "sprout", imageUrl: '/vegetables-source/brussels-sprouts.png' },
  { name: "Beetroot", lifespanWholeDays: 30, lifespanCutDays: 7, icon: "beet", imageUrl: '/vegetables-source/beetroot.png' },
  { name: "Turnip", lifespanWholeDays: 21, lifespanCutDays: 7, icon: "turnip", imageUrl: '/vegetables-source/turnip.png' },
  { name: "Fennel", lifespanWholeDays: 7, lifespanCutDays: 3, icon: "fennel", imageUrl: '/vegetables-source/fennel.png' },
  { name: "Snow Pea", lifespanWholeDays: 7, lifespanCutDays: 3, icon: "pea", imageUrl: '/vegetables-source/snow-pea.png' },
  { name: "Chili Pepper", lifespanWholeDays: 14, lifespanCutDays: 5, icon: "chili", imageUrl: '/vegetables-source/chili-pepper.png' }
]

// Helper: calculate remaining days
export function getRemainingDays(item: VegetableItem): number {
  assertInvariant(item != null, "Expected VegetableItem")
  assertInvariant(typeof item.fridgeDate === "string", "Expected fridgeDate string")
  assertInvariant(
    item.lifespanWholeDays >= 0 && item.lifespanCutDays >= 0,
    "Expected non-negative lifespan"
  )
  const fridgeDate = new Date(item.fridgeDate)
  const today = new Date()
  const diffMs = today.getTime() - fridgeDate.getTime()
  const daysPassed = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const totalLifespan = item.wasCut ? item.lifespanCutDays : item.lifespanWholeDays
  return totalLifespan - daysPassed
}

// Helper: urgency level
export function getUrgencyLevel(item: VegetableItem): "fresh" | "warning" | "danger" {
  assertInvariant(item != null, "Expected VegetableItem")
  const remaining = getRemainingDays(item)
  const totalLifespan = item.wasCut ? item.lifespanCutDays : item.lifespanWholeDays
  const ratio = remaining / totalLifespan

  if (remaining <= 0 || ratio <= 0.2) return "danger"
  if (ratio <= 0.5) return "warning"
  return "fresh"
}

// Helper: build add-item payload (preset or custom); used by Add form submit
export function buildAddItemPayload(params: {
  name: string
  quantity: number | null
  unit: string | null
  fridgeDate: string
  wasCut: boolean
  preset?: VegetablePreset | null
}): Omit<VegetableItem, "id"> {
  assertInvariant(params != null, "Expected params object")
  assertInvariant(typeof params.name === "string", "Expected name string")
  assertInvariant(typeof params.fridgeDate === "string", "Expected fridgeDate string")
  const { name, quantity, unit, fridgeDate, wasCut, preset } = params
  return {
    name,
    quantity,
    unit,
    fridgeDate,
    lifespanWholeDays: preset?.lifespanWholeDays ?? 7,
    lifespanCutDays: preset?.lifespanCutDays ?? 3,
    wasCut,
    imageUrl: preset?.imageUrl ?? DEFAULT_IMAGE_URL,
  }
}

// Helper: generate unique ID
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

const URGENCY_ORDER: Record<"danger" | "warning" | "fresh", number> = {
  danger: 0,
  warning: 1,
  fresh: 2,
}

export function sortByPriority(a: VegetableItem, b: VegetableItem): number {
  assertInvariant(a != null, "Expected VegetableItem a")
  assertInvariant(b != null, "Expected VegetableItem b")
  const urgencyA = URGENCY_ORDER[getUrgencyLevel(a)]
  const urgencyB = URGENCY_ORDER[getUrgencyLevel(b)]
  if (urgencyA !== urgencyB) return urgencyA - urgencyB
  return getRemainingDays(a) - getRemainingDays(b)
}

// Mock vegan recipe data
export const MOCK_RECIPES = [
  {
    title: "Roasted Vegetable Buddha Bowl",
    description: "A nourishing bowl packed with roasted seasonal vegetables, quinoa, and tahini dressing.",
    url: "https://example.com/recipes/buddha-bowl",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop",
  },
  {
    title: "Stir-Fried Veggies with Tofu",
    description: "Quick weeknight stir-fry with crispy tofu and fresh garden vegetables in a savory sauce.",
    url: "https://example.com/recipes/stir-fry-tofu",
    image: "https://images.unsplash.com/photo-1543339308-d595c47c373e?w=600&h=400&fit=crop",
  },
  {
    title: "Creamy Vegetable Soup",
    description: "Silky smooth soup made with whatever veggies you have on hand. Perfect for clearing the fridge.",
    url: "https://example.com/recipes/veggie-soup",
    image: "https://images.unsplash.com/photo-1547592166-23ac45744aec?w=600&h=400&fit=crop",
  },
  {
    title: "Mediterranean Stuffed Peppers",
    description: "Bell peppers stuffed with couscous, herbs, and roasted vegetables. A colourful vegan feast.",
    url: "https://example.com/recipes/stuffed-peppers",
    image: "https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c?w=600&h=400&fit=crop",
  },
  {
    title: "Rainbow Veggie Tacos",
    description: "Corn tortillas loaded with spiced vegetables, avocado crema, and pickled onions.",
    url: "https://example.com/recipes/veggie-tacos",
    image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=600&h=400&fit=crop",
  },
  {
    title: "Green Goddess Salad",
    description: "A vibrant salad with massaged kale, cucumber, avocado, and a creamy herb dressing.",
    url: "https://example.com/recipes/green-goddess-salad",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&h=400&fit=crop",
  },
]
