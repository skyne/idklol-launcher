import { Button } from '@/app/components/ui/button'
import eraPreview from '@/app/assets/era-preview.png'
import { Page, setPage } from '@/app/states/router';

export const LoginPage = () => {

  const handleLogin = () => {
    setPage(Page.HOME);
  }

  return (
    <div className="relative flex h-full bg-background text-foreground">
      {/* Painterly fantasy background glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,253,250,1),_transparent_62%),radial-gradient(circle_at_bottom,_rgba(254,215,170,0.35),_transparent_58%)] dark:bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.95),_transparent_62%),radial-gradient(circle_at_bottom,_rgba(127,29,29,0.55),_transparent_58%)]" />
        <div className="absolute inset-0 mix-blend-soft-light opacity-70 [background-image:linear-gradient(118deg,rgba(254,215,170,0.55),transparent_36%,rgba(254,243,199,0.6)_72%,transparent)]" />
      </div>

      {/* Main content */}
      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-row px-6 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-12 gap-6 lg:gap-10">
        {/* Illustration / world panel */}
        <div className="hidden flex-1 flex-col justify-between rounded-2xl border border-border/40 bg-white/90 p-5 shadow-[0_18px_55px_rgba(248,113,22,0.25)] backdrop-blur-md sm:flex">
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-b from-orange-50 via-amber-50/90 to-rose-50/90 dark:from-slate-950/90 dark:via-slate-900/70 dark:to-red-950/85">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(248,181,129,0.4),transparent_55%),radial-gradient(circle_at_80%_0,rgba(248,113,22,0.3),transparent_55%),radial-gradient(circle_at_50%_100%,rgba(244,114,182,0.26),transparent_55%)] mix-blend-soft-light" />
            <img
              src={eraPreview}
              alt="Era of Legends world preview"
              className="relative block h-64 w-full object-cover object-center sm:h-72 md:h-80 lg:h-full"
            />
          </div>

          <div className="mt-4 space-y-2 text-slate-900 dark:text-slate-100">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-500/80 dark:text-amber-300/80">
              Era Online • Launcher
            </p>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Return to the Shattered Realms
            </h1>
            <p className="max-w-md text-sm text-slate-600/95 dark:text-slate-200/85">
              Log in to manage updates, patch notes, and characters before you step
              back onto the painted battlements of a world at the edge of legend.
            </p>
          </div>
        </div>

        {/* Login card */}
        <div className="flex w-full max-w-md flex-col justify-center rounded-2xl border border-border/70 bg-card/90 px-5 py-6 shadow-[0_18px_48px_rgba(248,113,22,0.35)] backdrop-blur-xl sm:px-7 sm:py-7 lg:px-8 lg:py-8">
          <div className="mb-6 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-500/85 dark:text-amber-300/85">
              Login
            </p>
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              Commander, your party awaits
            </h2>
            <p className="text-xs text-slate-600/95 dark:text-slate-200/85">
              Sign in to your Era account to update the game, manage characters, and
              join your guild on the next campaign.
            </p>
          </div>

          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault()
            }}
          >
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-xs font-medium text-slate-800 dark:text-slate-100"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder="you@era-legends.com"
                className="h-9 w-full rounded-md border border-border bg-background/95 px-3 text-sm text-foreground shadow-xs outline-none ring-0 transition-all placeholder:text-slate-400 focus-visible:border-orange-300 focus-visible:ring-2 focus-visible:ring-orange-200/80 dark:border-slate-700 dark:bg-slate-900/70 dark:placeholder:text-slate-500 dark:focus-visible:border-amber-300 dark:focus-visible:ring-amber-500/60"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-xs font-medium text-slate-800 dark:text-slate-100"
                >
                  Password
                </label>
                <button
                  type="button"
                  className="text-[11px] font-medium text-orange-600 hover:text-orange-500 dark:text-amber-300 dark:hover:text-amber-200"
                >
                  Forgot?
                </button>
              </div>
              <input
                id="password"
                type="password"
                required
                placeholder="Enter your password"
                className="h-9 w-full rounded-md border border-border bg-background/95 px-3 text-sm text-foreground shadow-xs outline-none ring-0 transition-all placeholder:text-slate-400 focus-visible:border-orange-300 focus-visible:ring-2 focus-visible:ring-orange-200/80 dark:border-slate-700 dark:bg-slate-900/70 dark:placeholder:text-slate-500 dark:focus-visible:border-amber-300 dark:focus-visible:ring-amber-500/60"
              />
            </div>

            <div className="flex items-center justify-between pt-1 text-[11px] text-slate-600/95 dark:text-slate-300/85">
              <label className="inline-flex cursor-pointer items-center gap-2 select-none">
                <input
                  type="checkbox"
                  className="peer h-[14px] w-[14px] cursor-pointer rounded border border-slate-400/80 bg-background/90 text-indigo-500 shadow-xs outline-none transition-all focus-visible:ring-2 focus-visible:ring-indigo-300/70 dark:border-slate-600 dark:bg-slate-900/80"
                />
                <span className="text-[11px] leading-none">Stay signed in</span>
              </label>
              <span className="text-[11px] text-slate-500/90 dark:text-slate-400/85">
                Secured through the Embergate
              </span>
            </div>

            <div className="pt-3">
              <Button
                type="submit"
                onClick={handleLogin}
                className="w-full h-9 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-[13px] font-semibold tracking-wide text-white shadow-md shadow-orange-900/30 transition-all hover:from-amber-400 hover:via-orange-400 hover:to-rose-400 hover:shadow-lg hover:shadow-orange-900/40 active:translate-y-[0.5px] active:shadow-md"
              >
                Launch Era
              </Button>
            </div>
          </form>

          <div className="mt-5 border-t border-border/70 pt-4">
            <p className="text-[11px] text-slate-500/95 dark:text-slate-400/90">
              New to Era?
              <button
                type="button"
                className="ml-1 text-[11px] font-semibold text-orange-600 underline-offset-4 hover:underline dark:text-amber-300"
              >
                Create an account
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}