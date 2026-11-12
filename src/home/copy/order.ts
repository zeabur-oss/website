// What each reader's page shows, and in which order. The same in every language.
import type { Audience, PartId, ProofId } from "./index.ts"

/** The three statements at the top of each reader's page. */
export const proofOrder: Record<Audience, ProofId[]> = {
  team: ["state", "rbac", "review"],
  provider: ["roles", "lockin", "license"],
  homelab: ["license", "gitops", "local"],
}

/** The parts of each reader's page, in order. */
export const partOrder: Record<Audience, PartId[]> = {
  team: ["walk", "review", "perm", "lockin", "zeatend", "local", "license"],
  provider: ["zeatend", "perm", "review", "lockin", "walk", "license"],
  homelab: ["local", "lockin", "license", "walk", "zeatend"],
}
