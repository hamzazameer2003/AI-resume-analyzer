"use client";

import { useState } from "react";
import { API_URL } from "@/lib/api";

export default function ResumeGeneratorPage() {
  const [experienceLevel, setExperienceLevel] = useState("fresher");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    title: "",
    linkedin: "",
    github: "",
    portfolio: "",
    summary: "",
    experience: "",
    projects: "",
    skills: "",
    education: "",
    certifications: "",
    achievements: "",
    languages: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState("midnight");
  const [sectionOrder, setSectionOrder] = useState([
    "summary",
    "skills",
    "experience",
    "projects",
    "education",
    "certifications",
    "achievements",
    "languages",
  ]);

  function updateField(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = window.localStorage.getItem("token") || "";
      const payload = {
        ...form,
        experienceLevel,
        experience: experienceLevel === "experienced" ? form.experience : undefined,
        projects: experienceLevel === "fresher" ? form.projects : undefined,
        theme,
        sectionOrder,
      };

      const res = await fetch(`${API_URL}/api/resume-generator/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Generation failed");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "resume.pdf";
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">AI Resume Builder</h1>
        <p className="text-sm text-slate dark:text-slate-300">Fill the form and generate a professional PDF resume. This feature use AI to generate content, so make sure to review and edit it before using.</p>
      </div>
      <form className="rounded-2xl border border-white/70 bg-white/80 p-6 shadow-sm dark:border-white/10 dark:bg-slate-900/70" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <input
            className="w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none focus:border-ink dark:border-white/10 dark:bg-slate-950 dark:text-slate-100"
            placeholder="Full name"
            value={form.fullName}
            onChange={(e) => updateField("fullName", e.target.value)}
            required
          />
          <input
            className="w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none focus:border-ink dark:border-white/10 dark:bg-slate-950 dark:text-slate-100"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
            required
          />
          <input
            className="w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none focus:border-ink dark:border-white/10 dark:bg-slate-950 dark:text-slate-100"
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            required
          />
          <input
            className="w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none focus:border-ink dark:border-white/10 dark:bg-slate-950 dark:text-slate-100"
            placeholder="Location (City, Country)"
            value={form.location}
            onChange={(e) => updateField("location", e.target.value)}
          />
          <input
            className="w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none focus:border-ink dark:border-white/10 dark:bg-slate-950 dark:text-slate-100"
            placeholder="Target title (e.g., Software Engineer)"
            value={form.title}
            onChange={(e) => updateField("title", e.target.value)}
          />
          <input
            className="w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none focus:border-ink dark:border-white/10 dark:bg-slate-950 dark:text-slate-100"
            placeholder="LinkedIn URL"
            value={form.linkedin}
            onChange={(e) => updateField("linkedin", e.target.value)}
          />
          <input
            className="w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none focus:border-ink dark:border-white/10 dark:bg-slate-950 dark:text-slate-100"
            placeholder="GitHub URL"
            value={form.github}
            onChange={(e) => updateField("github", e.target.value)}
          />
          <input
            className="w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none focus:border-ink dark:border-white/10 dark:bg-slate-950 dark:text-slate-100"
            placeholder="Portfolio URL"
            value={form.portfolio}
            onChange={(e) => updateField("portfolio", e.target.value)}
          />
          <input
            className="w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none focus:border-ink dark:border-white/10 dark:bg-slate-950 dark:text-slate-100"
            placeholder="Skills (comma-separated)"
            value={form.skills}
            onChange={(e) => updateField("skills", e.target.value)}
            required
          />
        </div>
        <textarea
          className="mt-4 w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none focus:border-ink dark:border-white/10 dark:bg-slate-950 dark:text-slate-100"
          placeholder="Professional summary"
          rows={3}
          value={form.summary}
          onChange={(e) => updateField("summary", e.target.value)}
          required
        />
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-xs uppercase tracking-widest text-slate dark:text-slate-300">
              PDF Theme
            </label>
            <select
              className="mt-2 w-full rounded-xl border border-ink/10 bg-white px-3 py-2 text-sm outline-none focus:border-ink dark:border-white/10 dark:bg-slate-950 dark:text-slate-100"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
            >
              <option value="midnight">Midnight</option>
              <option value="ember">Ember</option>
              <option value="ocean">Ocean</option>
            </select>
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-slate dark:text-slate-300">
              Section Order
            </label>
            <div className="mt-2 space-y-2 text-sm text-slate dark:text-slate-300">
              {sectionOrder.map((section, index) => (
                <div
                  key={section}
                  className="flex items-center justify-between rounded-lg border border-ink/10 bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-slate-950"
                >
                  <span className="capitalize">{section.replace("-", " ")}</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => {
                        const next = [...sectionOrder];
                        [next[index - 1], next[index]] = [next[index], next[index - 1]];
                        setSectionOrder(next);
                      }}
                      className="rounded-full border border-ink/20 px-2 py-0.5 text-xs text-ink disabled:opacity-40 dark:border-white/20 dark:text-slate-100"
                    >
                      Up
                    </button>
                    <button
                      type="button"
                      disabled={index === sectionOrder.length - 1}
                      onClick={() => {
                        const next = [...sectionOrder];
                        [next[index + 1], next[index]] = [next[index], next[index + 1]];
                        setSectionOrder(next);
                      }}
                      className="rounded-full border border-ink/20 px-2 py-0.5 text-xs text-ink disabled:opacity-40 dark:border-white/20 dark:text-slate-100"
                    >
                      Down
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="experienceLevel"
              value="experienced"
              checked={experienceLevel === "experienced"}
              onChange={() => setExperienceLevel("experienced")}
            />
            Experienced
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="experienceLevel"
              value="fresher"
              checked={experienceLevel === "fresher"}
              onChange={() => setExperienceLevel("fresher")}
            />
            Fresher
          </label>
        </div>
        {experienceLevel === "experienced" && (
          <textarea
            className="mt-4 w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none focus:border-ink dark:border-white/10 dark:bg-slate-950 dark:text-slate-100"
            placeholder="Experience details"
            rows={4}
            value={form.experience}
            onChange={(e) => updateField("experience", e.target.value)}
            required
          />
        )}
        {experienceLevel === "fresher" && (
          <textarea
            className="mt-4 w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none focus:border-ink dark:border-white/10 dark:bg-slate-950 dark:text-slate-100"
            placeholder="Projects and short descriptions"
            rows={4}
            value={form.projects}
            onChange={(e) => updateField("projects", e.target.value)}
            required
          />
        )}
        <textarea
          className="mt-4 w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none focus:border-ink dark:border-white/10 dark:bg-slate-950 dark:text-slate-100"
          placeholder="Education (one per line)"
          rows={3}
          value={form.education}
          onChange={(e) => updateField("education", e.target.value)}
        />
        <textarea
          className="mt-4 w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none focus:border-ink dark:border-white/10 dark:bg-slate-950 dark:text-slate-100"
          placeholder="Certifications (one per line)"
          rows={2}
          value={form.certifications}
          onChange={(e) => updateField("certifications", e.target.value)}
        />
        <textarea
          className="mt-4 w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none focus:border-ink dark:border-white/10 dark:bg-slate-950 dark:text-slate-100"
          placeholder="Achievements (one per line)"
          rows={2}
          value={form.achievements}
          onChange={(e) => updateField("achievements", e.target.value)}
        />
        <input
          className="mt-4 w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none focus:border-ink dark:border-white/10 dark:bg-slate-950 dark:text-slate-100"
          placeholder="Languages (comma-separated)"
          value={form.languages}
          onChange={(e) => updateField("languages", e.target.value)}
        />
        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
        <button
          type="submit"
          className="mt-4 rounded-xl bg-ink px-4 py-3 text-sm text-fog transition hover:-translate-y-0.5 dark:bg-slate-100 dark:text-slate-900"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Resume"}
        </button>
      </form>
    </div>
  );
}
