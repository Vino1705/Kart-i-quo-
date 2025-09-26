
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="w-full">
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-background/80 backdrop-blur-sm">
        <Logo />
        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      </header>

      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 text-center">
          <div className="container">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl font-headline">
              Your Personal AI Financial Guide
            </h1>
            <p className="max-w-[700px] mx-auto mt-4 text-muted-foreground md:text-xl">
              Kart-I-Quo helps you manage expenses, track savings goals, and get
              personalized financial advice powered by AI.
            </p>
            <div className="mt-8">
              <Button size="lg" asChild>
                <Link href="/signup">Get Started for Free</Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-20 bg-muted/50">
            <div className="container">
                <div className="text-center">
                    <h2 className="text-3xl font-bold font-headline">Features at a Glance</h2>
                    <p className="text-muted-foreground mt-2">Everything you need to take control of your finances.</p>
                </div>
                <div className="grid gap-8 mt-12 md:grid-cols-3">
                    <div className="p-6 text-center bg-background rounded-lg shadow">
                        <h3 className="text-xl font-semibold font-headline">AI-Powered Insights</h3>
                        <p className="mt-2 text-muted-foreground">Get smart forecasts, budget simulations, and personalized advice from our AI financial advisor.</p>
                    </div>
                     <div className="p-6 text-center bg-background rounded-lg shadow">
                        <h3 className="text-xl font-semibold font-headline">Goal Tracking</h3>
                        <p className="mt-2 text-muted-foreground">Set, track, and contribute to your financial goals with visual progress bars to keep you motivated.</p>
                    </div>
                     <div className="p-6 text-center bg-background rounded-lg shadow">
                        <h3 className="text-xl font-semibold font-headline">Daily Expense Logging</h3>
                        <p className="mt-2 text-muted-foreground">Easily log your daily spending to understand your habits and stay within your AI-suggested budget.</p>
                    </div>
                </div>
            </div>
        </section>

        {/* How it works */}
        <section className="py-20">
             <div className="container">
                  <div className="text-center">
                    <h2 className="text-3xl font-bold font-headline">How It Works</h2>
                    <p className="text-muted-foreground mt-2">A simple path to financial clarity.</p>
                </div>
                <div className="grid items-center gap-12 mt-12 md:grid-cols-2">
                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="flex items-center justify-center w-12 h-12 text-lg font-bold rounded-full bg-primary text-primary-foreground">1</div>
                            <div>
                                <h3 className="text-xl font-semibold font-headline">Set Your Profile</h3>
                                <p className="mt-1 text-muted-foreground">Tell us your monthly income and mandatory expenses during a quick onboarding process.</p>
                            </div>
                        </div>
                         <div className="flex gap-4">
                            <div className="flex items-center justify-center w-12 h-12 text-lg font-bold rounded-full bg-primary text-primary-foreground">2</div>
                            <div>
                                <h3 className="text-xl font-semibold font-headline">Get Your Plan</h3>
                                <p className="mt-1 text-muted-foreground">Our AI calculates your disposable income and suggests a daily spending limit and a savings goal.</p>
                            </div>
                        </div>
                         <div className="flex gap-4">
                            <div className="flex items-center justify-center w-12 h-12 text-lg font-bold rounded-full bg-primary text-primary-foreground">3</div>
                            <div>
                                <h3 className="text-xl font-semibold font-headline">Track & Achieve</h3>
                                <p className="mt-1 text-muted-foreground">Log daily expenses, contribute to your goals, and use our AI tools to stay on track and make smart decisions.</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <Image 
                          src="https://picsum.photos/seed/finance-app/600/400"
                          alt="Financial planning illustration"
                          width={600}
                          height={400}
                          className="rounded-lg shadow-lg"
                          data-ai-hint="financial planning abstract"
                        />
                    </div>
                </div>
             </div>
        </section>
      </main>

      <footer className="py-6 text-center border-t text-muted-foreground">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Kart-I-Quo. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
