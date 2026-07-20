import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Wallet,
  PieChart,
  CreditCard,
  BarChart2,
  ShieldCheck,
  Zap,
} from "lucide-react";

interface LandingPageProps {
  openLogin: () => void;
  openRegister: () => void;
}


// Landing Page Component
export default function LandingPage({ openLogin, openRegister }: LandingPageProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/dashboard", { replace: true });
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-white">

      {/* NAVBAR */}
      <nav className="w-full px-6 md:px-10 py-6 flex justify-between items-center border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            PECM
          </h1>
        </div>

        <div className="flex gap-3">
          <button
            onClick={openLogin}
            className="px-5 py-3 text-lg font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            Login
          </button>

          <button
            onClick={openRegister}
            className="px-5 py-3 text-lg bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Register
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="max-w-4xl mx-auto px-6 pt-20 md:pt-28 pb-20 text-center">

        <h2 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight">
          Take control of
          <br />
          <span className="text-blue-600">your finances</span>
        </h2>

        <p className="text-2xl md:text-2xl text-gray-700 mt-8 max-w-2xl mx-auto leading-relaxed">
          Track your spending, organize it into categories, and see clear
          reports — all in one simple dashboard.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-12">
          <button
            onClick={openRegister}
            className="px-10 py-5 bg-blue-600 text-white rounded-xl text-xl font-semibold hover:bg-blue-700 transition-colors shadow-md"
          >
            Get Started — It's Free
          </button>

          <button
            onClick={openLogin}
            className="px-10 py-5 bg-white border-2 border-gray-200 text-gray-700 rounded-xl text-xl font-semibold hover:bg-gray-50 transition-colors"
          >
            Login
          </button>
        </div>

        <p className="text-gray-600 font-bold text-xl mt-8">
          Free to use. No credit card needed.
        </p>

      </section>

      {/* HOW IT WORKS */}
      <section className="bg-gray-50 py-20 md:py-24 border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-6">

          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-5">
            How it works
          </h2>
          <p className="text-xl md:text-2xl text-gray-900 text-center mb-16">
            Get up and running in three simple steps.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-10">

            <StepCard
              number="1"
              title="Create your account"
              desc="Sign up in seconds — no credit card, no complicated setup."
            />

            <StepCard
              number="2"
              title="Add your expenses"
              desc="Log what you spend and organize it into simple categories."
            />

            <StepCard
              number="3"
              title="Get instant insights"
              desc="See clear reports and charts that show where your money goes."
            />

          </div>

        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-20">

        <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-5">
          Everything you need
        </h2>
        <p className="text-xl md:text-2xl text-gray-500 text-center mb-14">
          Simple tools to understand where your money goes.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

          <FeatureCard
            icon={<PieChart className="w-8 h-8" />}
            iconBg="bg-blue-50"
            iconColor="text-blue-600"
            title="Detailed Reports"
            desc="See your monthly and yearly spending with easy-to-read charts."
          />

          <FeatureCard
            icon={<CreditCard className="w-8 h-8" />}
            iconBg="bg-green-50"
            iconColor="text-green-600"
            title="Expense Tracking"
            desc="Add and organize expenses in seconds with a simple interface."
          />

          <FeatureCard
            icon={<Wallet className="w-8 h-8" />}
            iconBg="bg-purple-50"
            iconColor="text-purple-600"
            title="Personal Dashboard"
            desc="Your own private dashboard, made just for your finances."
          />

          <FeatureCard
            icon={<BarChart2 className="w-8 h-8" />}
            iconBg="bg-amber-50"
            iconColor="text-amber-600"
            title="Smart Analytics"
            desc="Understand your spending habits and where you can save more."
          />

          <FeatureCard
            icon={<ShieldCheck className="w-8 h-8" />}
            iconBg="bg-red-50"
            iconColor="text-red-600"
            title="Secure & Private"
            desc="Your financial data is protected and always stays yours."
          />

          <FeatureCard
            icon={<Zap className="w-8 h-8" />}
            iconBg="bg-indigo-50"
            iconColor="text-indigo-600"
            title="Quick to Start"
            desc="Create your account and start tracking within minutes."
          />

        </div>

      </section>

      {/* CTA SECTION */}
      <section className="bg-blue-600 py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">

          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Ready to get started?
          </h2>
          <p className="text-blue-100 text-xl md:text-2xl mt-4">
            Join now and start tracking your expenses today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <button
              onClick={openRegister}
              className="px-10 py-5 bg-white text-blue-600 rounded-xl text-xl font-semibold hover:bg-gray-100 transition-colors shadow-md"
            >
              Create Free Account
            </button>

            <button
              onClick={openLogin}
              className="px-10 py-5 border-2 border-white text-white rounded-xl text-xl font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Login
            </button>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 text-center border-t border-gray-100">
        <p className="text-gray-400 text-lg">
          © {new Date().getFullYear()} PECM — Personal Expense Control Manager
        </p>
      </footer>

    </div>
  );
}

/* Feature Card Component */

function FeatureCard({
  icon,
  iconBg,
  iconColor,
  title,
  desc,
}: {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 hover:shadow-md transition-shadow p-8 flex flex-col gap-5">
      <div className={`w-16 h-16 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center`}>
        {icon}
      </div>
      <h3 className="text-2xl font-semibold text-gray-900">{title}</h3>
      <p className="text-gray-500 text-lg leading-relaxed">{desc}</p>
    </div>
  );
}

/* Step Card Component */

function StepCard({
  number,
  title,
  desc,
}: {
  number: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex flex-col items-center text-center gap-5">
      <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold shadow-md">
        {number}
      </div>
      <h3 className="text-2xl font-semibold text-gray-900">{title}</h3>
      <p className="text-gray-900 text-xl leading-relaxed max-w-xs">{desc}</p>
    </div>
  );
}