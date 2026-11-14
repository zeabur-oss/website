/** A Chinese title in the phrases its commas make, so a line breaks between them, not inside. */
export const phrases = (title: string) => title.split(/(?<=，)/)
