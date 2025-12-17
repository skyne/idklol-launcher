import { Button } from '@/app/components/ui/button'
import eraPreview from '@/app/assets/era-preview.png'
import { Page, setPage } from '@/app/states/router'

export const HomePage = () => {
  return (
    <div className="relative flex h-full bg-background text-foreground">
      {/* Shared painterly background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,253,250,1),_transparent_62%),radial-gradient(circle_at_bottom,_rgba(254,215,170,0.35),_transparent_58%)] dark:bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.95),_transparent_62%),radial-gradient(circle_at_bottom,_rgba(127,29,29,0.55),_transparent_58%)]" />
        <div className="absolute inset-0 mix-blend-soft-light opacity-70 [background-image:linear-gradient(118deg,rgba(254,215,170,0.55),transparent_36%,rgba(254,243,199,0.6)_72%,transparent)]" />
      </div>

      {/* Main content */}
      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-row px-6 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-12 gap-6 lg:gap-10">
        {/* World / key art panel */}
        <div className="hidden flex-1 flex-col justify-between rounded-2xl border border-border/40 bg-white/90 p-5 shadow-[0_18px_55px_rgba(248,113,22,0.25)] backdrop-blur-md sm:flex">
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-b from-orange-50 via-amber-50/90 to-rose-50/90 dark:from-slate-950/90 dark:via-slate-900/70 dark:to-red-950/85">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(248,181,129,0.4),transparent_55%),radial-gradient(circle_at_80%_0,rgba(248,113,22,0.3),transparent_55%),radial-gradient(circle_at_50%_100%,rgba(244,114,182,0.26),transparent_55%)] mix-blend-soft-light" />
            <img
              src={eraPreview}
              alt="Era of Legends world overview"
              className="relative block h-64 w-full object-cover object-center sm:h-72 md:h-80 lg:h-full"
            />
          </div>

          <div className="mt-4 space-y-2 text-slate-900 dark:text-slate-100">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-500/80 dark:text-amber-300/80">
              Era Online • Launcher
            </p>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Fires rise on the frontier
            </h1>
            <p className="max-w-md text-sm text-slate-600/95 dark:text-slate-200/85">
              Review patch notes, check server status, and rally your warband before
              you drop into the battlefields of the Shattered Realms.
            </p>
          </div>
        </div>

        {/* Launcher panel */}
        <div className="flex w-full max-w-md flex-col justify-between rounded-2xl border border-border/70 bg-card/90 px-5 py-6 shadow-[0_18px_48px_rgba(248,113,22,0.35)] backdrop-blur-xl sm:px-7 sm:py-7 lg:px-8 lg:py-8">
          {/* Top: player/session info */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-orange-500/85 dark:text-amber-300/85">
                  Era account
                </p>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-50">
                  Commander of Embergate
                </p>
                <p className="text-[11px] text-slate-500/95 dark:text-slate-400/90">
                  Region: EU • Guild: Ashen Vanguard
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPage(Page.LOGIN)}
                className="text-[11px] font-medium text-slate-500 underline-offset-4 hover:text-orange-600 hover:underline dark:text-slate-400 dark:hover:text-amber-300"
              >
                Switch account
              </button>
            </div>

            {/* Server status */}
            <div className="mt-2 flex items-center justify-between rounded-xl border border-emerald-200/80 bg-emerald-50/80 px-3 py-2.5 text-xs text-emerald-800 shadow-xs dark:border-emerald-500/50 dark:bg-emerald-950/40 dark:text-emerald-100">
              <div>
                <p className="font-semibold leading-tight">Realm status: Stable</p>
                <p className="text-[11px] leading-tight opacity-90">
                  All shards are online. Expect minor skirmishes near Emberhold.
                </p>
              </div>
              <div className="flex flex-col items-end gap-0.5 text-[11px]">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600/10 px-2 py-[2px] text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-100">
                  <span className="h-[7px] w-[7px] rounded-full bg-emerald-400 shadow-[0_0_0_3px_rgba(34,197,94,0.35)]" />
                  Online
                </span>
                <span className="text-[10px] text-emerald-700/80 dark:text-emerald-200/80">
                  Ping &lt; 40ms
                </span>
              </div>
            </div>
          </div>

          {/* Middle: play + version / install info */}
          <div className="mt-5 space-y-4">
            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-orange-500/85 dark:text-amber-300/85">
                Ready to deploy
              </p>
              <p className="text-xs text-slate-600/95 dark:text-slate-200/85">
                Version <span className="font-mono">2.3.7</span> • Patch{' '}
                <span className="font-mono">“Ashes of the First Gate”</span> •
                Downloaded and verified.
              </p>
            </div>

            <Button
              type="button"
              onClick={() => {
                void window.conveyor.app.launchGame()
              }}
              className="w-full h-10 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-[13px] font-semibold tracking-wide text-white shadow-md shadow-orange-900/30 transition-all hover:from-amber-400 hover:via-orange-400 hover:to-rose-400 hover:shadow-lg hover:shadow-orange-900/40 active:translate-y-[0.5px] active:shadow-md"
            >
              Play Era
            </Button>

            <div className="flex flex-col gap-1.5 text-[11px] text-slate-500/95 dark:text-slate-400/90">
              <span className="truncate">Install path: /Games/Era/Client</span>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-500/95 dark:text-slate-400/90">
                  Storage usage: 47.3 GB
                </span>
                <button
                  type="button"
                  onClick={() => setPage(Page.SETTINGS)}
                  className="text-[11px] font-medium text-orange-600 underline-offset-4 hover:underline dark:text-amber-300"
                >
                  Settings
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}


