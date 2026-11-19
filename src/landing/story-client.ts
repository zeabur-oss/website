// In each story, the chapter that crosses the reading line sets the stage's scene. A stage goes
// live (its first scene plays) once most of it is on screen. Percent root margins resolve against
// the viewport width, so the reading line is set in pixels from its height.
let observers: IntersectionObserver[] = []
let height = 0

function stories() {
  observers.forEach((o) => o.disconnect())
  observers = []
  height = innerHeight
  const rootMargin = `${-Math.round(height * 0.55)}px 0px ${-Math.round(height * 0.43)}px 0px`
  for (const story of document.querySelectorAll<HTMLElement>("[data-story]")) {
    const stage = story.querySelector<HTMLElement>(".story-stage")
    if (!stage) continue
    const chapters = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            stage.dataset.step = (entry.target as HTMLElement).dataset.chapter
          }
        }
      },
      { rootMargin },
    )
    for (const chapter of story.querySelectorAll("[data-chapter]")) chapters.observe(chapter)
    observers.push(chapters)
    if (stage.classList.contains("is-live")) continue
    const live = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          stage.classList.add("is-live")
          live.disconnect()
        }
      },
      { threshold: 0.4 },
    )
    live.observe(stage)
    observers.push(live)
  }
}

document.documentElement.classList.add("story-ready")
document.addEventListener("astro:before-swap", (event) => {
  event.newDocument.documentElement.classList.add("story-ready")
})
document.addEventListener("astro:page-load", stories)
addEventListener("resize", () => {
  if (innerHeight !== height) stories()
})
