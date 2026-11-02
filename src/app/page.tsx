import Link from "next/link";
import { bubbleSort } from "@/algorithms/sorting/bubble-sort";
import { runAlgorithm } from "@/algorithms/run";
import { ENTRIES } from "@/content/catalog";
import { CURRICULUM_ITEMS, DUPLICATES } from "@/content/curriculum";
import { DOMAINS } from "@/content/domains";
import { TracePlayer } from "@/engine/player";
import { ContinueLearning } from "@/ui/ContinueLearning";
import { DifficultyBadge } from "@/ui/badges";
import { ArrayView } from "@/ui/renderers/ArrayView";

/** A real mid-execution state, computed by the engine at build time. */
function HeroFigure() {
  const { trace } = runAlgorithm(bubbleSort, [6, 2, 9, 4, 7, 1, 8, 3]);
  const player = new TracePlayer(trace);
  // Stop on the first swap after the first value has settled, so the picture shows both cues.
  const firstMark = trace.events.findIndex((e) => e.type === "array.mark");
  const swapAfter = trace.events.findIndex((e, i) => i > firstMark && e.type === "array.swap");
  const state = player.stateAt(swapAfter + 1);
  const A = state.structures.A;
  return (
    <figure className="hero__figure" style={{ margin: 0 }}>
      {A?.kind === "array" && <ArrayView name="A" structure={A} focus={state.focus} />}
      <figcaption className="field__help" style={{ marginTop: 8 }}>
        Bubble sort, step {state.position} of {player.length}: {state.note}
      </figcaption>
    </figure>
  );
}

export default function HomePage() {
  const unique = CURRICULUM_ITEMS.filter((i) => !DUPLICATES[i.number]).length;
  return (
    <div className="container">
      <section className="hero">
        <div>
          <p className="eyebrow">Learn · Visualize · Implement · Experiment · Innovate</p>
          <h1>Every algorithm, understandable.</h1>
          <p className="hero__tagline">
            ALGORITHMA explains algorithms at five depths, from intuition to proof, and lets you
            step through real executions, forwards and backwards, on inputs you choose.
          </p>
          <div className="hero__actions">
            <Link className="btn btn--primary" href="/algorithms/bubble-sort">
              Start with Bubble Sort
            </Link>
            <Link className="btn" href="/explore">
              Explore the encyclopedia
            </Link>
          </div>
        </div>
        <HeroFigure />
      </section>

      <div className="stats-row" aria-label="Catalogue status">
        <div className="stat">
          <span className="stat__value">{ENTRIES.length}</span>
          <span className="stat__label">interactive entries</span>
        </div>
        <div className="stat">
          <span className="stat__value">{unique}</span>
          <span className="stat__label">algorithms on the roadmap</span>
        </div>
        <div className="stat">
          <span className="stat__value">{DOMAINS.length}</span>
          <span className="stat__label">subject domains</span>
        </div>
      </div>

      <section className="section">
        <div className="section__title">
          <h2>Your learning</h2>
        </div>
        <ContinueLearning />
      </section>

      <section className="section">
        <div className="section__title">
          <h2>Interactive now</h2>
          <Link href="/explore">See all →</Link>
        </div>
        <div className="grid">
          {ENTRIES.map((e) => (
            <Link key={e.slug} href={`/algorithms/${e.slug}`} className="card card--link">
              <h3>{e.name}</h3>
              <p>{e.summary}</p>
              <div className="card__meta">
                <DifficultyBadge difficulty={e.difficulty} />
                {e.visualizer && <span className="badge">Visualizer</span>}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section__title">
          <h2>How it works</h2>
        </div>
        <div className="grid">
          <div className="card">
            <h3>Real executions, not animations</h3>
            <p>
              Each algorithm runs on your input and records a structured trace of what it did. The
              visualizer replays that trace, so every frame is a state the algorithm actually
              reached.
            </p>
          </div>
          <div className="card">
            <h3>Checked, not just written</h3>
            <p>
              Outputs are verified by independent checkers, code samples run in the test suite, and
              drafts are labelled as drafts until an expert reviews them.
            </p>
          </div>
          <div className="card">
            <h3>Built to grow</h3>
            <p>
              A new algorithm only emits events against shared structures (arrays, graphs, queues,
              tables) and gets a visualizer for free. Try it in the Studio.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
