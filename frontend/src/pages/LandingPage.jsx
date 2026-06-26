import { Link } from "react-router-dom";

export default function LandingPage() {
  const features = [
    {
      emoji: "☁️",
      title: "Cloud Ready",
      desc: "Monitor AWS EC2, Azure, Google Cloud or any Linux server securely.",
    },
    {
      emoji: "📊",
      title: "Real-Time Metrics",
      desc: "View CPU, Memory, Disk and System Load instantly.",
    },
    {
      emoji: "🔒",
      title: "Secure SSH",
      desc: "Authenticate using Username and PEM Key without agents.",
    },
    {
      emoji: "⚡",
      title: "Auto Refresh",
      desc: "Continuously monitor infrastructure with scheduled updates.",
    },
  ];

  const benefits = [
    "Real-Time Monitoring",
    "Cloud Infrastructure Ready",
    "Secure SSH Authentication",
    "Automatic Metric Collection",
    "Historical Metrics",
    "Lightweight & Fast",
    "No Agent Installation",
    "Simple Dashboard",
  ];

  return (
    <div className="bg-black text-white min-h-screen overflow-x-hidden">
      {/* ================= HERO ================= */}

      <section className="min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center rounded-full border border-indigo-300/50 bg-indigo-300/15 px-4 py-2 text-indigo-200 text-sm font-semibold">
              Cloud Native Infrastructure Monitoring
            </div>

            <h1 className="mt-8 text-5xl md:text-6xl font-extrabold leading-tight">
              Cloud-Based
              <br />
              <span className="text-indigo-300">Server Monitoring</span>
              <br />
              Platform
            </h1>

            <p className="mt-8 text-gray-300 text-lg leading-8 max-w-xl">
              Securely connect to Linux servers using SSH credentials and
              monitor CPU usage, Memory utilization, Disk space, and System Load
              from one centralized dashboard.
            </p>

            <div className="mt-10 flex flex-wrap gap-5">
              <Link
                to="/Homepage"
                className="bg-indigo-600 hover:bg-indigo-700 transition px-8 py-4 rounded-lg font-semibold"
              >
                Get Started →
              </Link>

              <a
                href="#about"
                className="border border-zinc-500 hover:border-indigo-500 transition px-8 py-4 rounded-lg"
              >
                Learn More
              </a>
            </div>
          </div>

          {/* Dashboard Preview */}

          {/* <div className="flex justify-center">
            <div className="w-full max-w-lg bg-zinc-800/90 border border-zinc-500 rounded-3xl p-8 shadow-2xl">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">Live Dashboard</h2>

                  <p className="text-gray-300 text-sm">Server Monitoring</p>
                </div>

                <div className="w-4 h-4 rounded-full bg-green-500 animate-pulse"></div>
              </div>

              <div className="mt-10 space-y-8">
                <div>
                  <div className="flex justify-between mb-2">
                    <span>CPU Usage</span>

                    <span>43%</span>
                  </div>

                  <div className="h-3 bg-zinc-700 rounded-full overflow-hidden">
                    <div className="h-full w-[43%] bg-blue-500 rounded-full"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span>Memory</span>

                    <span>61%</span>
                  </div>

                  <div className="h-3 bg-zinc-700 rounded-full overflow-hidden">
                    <div className="h-full w-[61%] bg-green-500 rounded-full"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span>Disk Usage</span>

                    <span>73%</span>
                  </div>

                  <div className="h-3 bg-zinc-700 rounded-full overflow-hidden">
                    <div className="h-full w-[73%] bg-purple-500 rounded-full"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span>System Load</span>

                    <span>Normal</span>
                  </div>

                  <div className="h-3 bg-zinc-700 rounded-full overflow-hidden">
                    <div className="h-full w-[35%] bg-indigo-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </section>

      {/* ================= ABOUT ================= */}

      <section id="about" className="py-24 bg-zinc-950">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center">
            What is this Platform?
          </h2>

          <p className="text-center text-gray-300 mt-6 max-w-3xl mx-auto leading-8">
            This Cloud-Based Monitoring Platform enables administrators to
            remotely connect to Linux servers using SSH authentication and
            visualize real-time infrastructure metrics including CPU, Memory,
            Disk Usage and System Load through a centralized dashboard.
          </p>
        </div>
      </section>

      {/* ================= FEATURES ================= */}

      <section id="features" className="py-5">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-center text-4xl font-bold">Platform Features</h2>

          <p className="text-center text-gray-300 mt-4">
            Everything required to monitor your infrastructure.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
            {features.map((item, index) => (
              <div
                key={index}
                className="bg-zinc-800/90 border border-zinc-500 hover:border-indigo-300 transition rounded-2xl p-8"
              >
                <div className="text-5xl">{item.emoji}</div>

                <h3 className="text-2xl font-bold mt-6">{item.title}</h3>

                <p className="text-gray-300 mt-4 leading-7">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* ================= HOW IT WORKS ================= */}

      <section className="py-24 bg-zinc-950">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center">
            Get Started in 3 Simple Steps
          </h2>

          <p className="text-center text-gray-300 mt-4">
            Connect to your server securely and start monitoring within seconds.
          </p>

          <div className="grid md:grid-cols-3 gap-10 mt-20">
            <div className="bg-black border border-zinc-500 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                1
              </div>

              <h3 className="text-2xl font-semibold mt-6">Enter Credentials</h3>

              <p className="text-gray-300 mt-4 leading-7">
                Provide your Server IP address, Username and PEM key to
                establish a secure SSH connection.
              </p>
            </div>

            <div className="bg-black border border-zinc-500 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                2
              </div>

              <h3 className="text-2xl font-semibold mt-6">Secure Connection</h3>

              <p className="text-gray-300 mt-4 leading-7">
                The platform securely authenticates using your SSH private key
                without requiring any monitoring agent.
              </p>
            </div>

            <div className="bg-black border border-zinc-500 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                3
              </div>

              <h3 className="text-2xl font-semibold mt-6">
                Monitor Live Metrics
              </h3>

              <p className="text-gray-300 mt-4 leading-7">
                Instantly visualize CPU, Memory, Disk Usage and System Load
                through an interactive dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= BENEFITS ================= */}

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-bold">
              Why Use Our Monitoring Platform?
            </h2>

            <p className="text-gray-300 mt-6 leading-8">
              Designed for cloud administrators, DevOps engineers and students,
              our platform provides secure server monitoring without installing
              any additional software on the target machine.
            </p>

            <div className="grid sm:grid-cols-2 gap-5 mt-10">
              {benefits.map((item, index) => (
                <div
                  key={index}
                  className="bg-zinc-800/90 border border-zinc-500 rounded-xl px-5 py-4 flex items-center gap-3"
                >
                  <div className="text-green-400 text-xl">✔</div>

                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="bg-zinc-800/90 border border-zinc-500 rounded-3xl p-10">
              <h3 className="text-3xl font-bold">Platform Highlights</h3>

              <div className="mt-10 space-y-8">
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Infrastructure Monitoring</span>

                    <span>100%</span>
                  </div>

                  <div className="h-3 bg-zinc-700 rounded-full">
                    <div className="h-full w-full bg-indigo-500 rounded-full"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span>Secure SSH Authentication</span>

                    <span>100%</span>
                  </div>

                  <div className="h-3 bg-zinc-700 rounded-full">
                    <div className="h-full w-full bg-green-500 rounded-full"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span>Real-Time Monitoring</span>

                    <span>99%</span>
                  </div>

                  <div className="h-3 bg-zinc-700 rounded-full">
                    <div className="h-full w-[99%] bg-blue-500 rounded-full"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span>Cloud Ready</span>

                    <span>100%</span>
                  </div>

                  <div className="h-3 bg-zinc-700 rounded-full">
                    <div className="h-full w-full bg-purple-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= STATS ================= */}

      <section className="py-24 bg-zinc-950">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <h2 className="text-5xl font-bold text-indigo-300">24/7</h2>

              <p className="text-gray-300 mt-3">Monitoring Support</p>
            </div>

            <div>
              <h2 className="text-5xl font-bold text-indigo-300">SSH</h2>

              <p className="text-gray-300 mt-3">Secure Authentication</p>
            </div>

            <div>
              <h2 className="text-5xl font-bold text-indigo-300">Live</h2>

              <p className="text-gray-300 mt-3">Performance Metrics</p>
            </div>

            <div>
              <h2 className="text-5xl font-bold text-indigo-300">Cloud</h2>

              <p className="text-gray-300 mt-3">Infrastructure Ready</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}

      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-5xl font-bold leading-tight">
            Ready to Monitor Your Servers?
          </h2>

          <p className="text-gray-300 text-lg mt-6 leading-8">
            Connect securely using SSH credentials and start monitoring your
            cloud infrastructure with real-time performance insights.
          </p>
          <div className="mt-12">
            <Link
              to="/Homepage"
              className="inline-flex items-center bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 px-10 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-indigo-500/30"
            >
              Get Started →
            </Link>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}

      <footer className="border-t border-zinc-500 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h3 className="text-xl font-bold">Cloud Monitoring Platform</h3>

            <p className="text-gray-500 mt-2 text-sm">
              Monitor Linux servers securely with real-time infrastructure
              insights.
            </p>
          </div>

          <div className="flex gap-8 text-gray-300 text-sm">
            <a href="#about" className="hover:text-indigo-200 transition">
              About
            </a>

            <a href="#features" className="hover:text-indigo-200 transition">
              Features
            </a>

            <Link to="/Homepage" className="hover:text-indigo-200 transition">
              Dashboard
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
