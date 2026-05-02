"use client";

import { useState } from "react";
import { API_URL } from "@/lib/api";

type ExperienceLevel = "experienced" | "fresher";

type TimelineItem = {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
};

const emptyTimelineItem = (): TimelineItem => ({
  title: "",
  description: "",
  startDate: "",
  endDate: "",
});

function TimelineEditor({
  label,
  titlePlaceholder,
  descriptionPlaceholder,
  items,
  onChange,
}: {
  label: string;
  titlePlaceholder: string;
  descriptionPlaceholder: string;
  items: TimelineItem[];
  onChange: (items: TimelineItem[]) => void;
}) {
  function updateItem(index: number, key: keyof TimelineItem, value: string) {
    const next = items.map((item, itemIndex) =>
      itemIndex === index ? { ...item, [key]: value } : item
    );
    onChange(next);
  }

  function addItem() {
    onChange([...items, emptyTimelineItem()]);
  }

  function removeItem(index: number) {
    if (items.length === 1) {
      onChange([emptyTimelineItem()]);
      return;
    }
    onChange(items.filter((_, itemIndex) => itemIndex !== index));
  }

  return (
    <div className="mt-4 space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="text-xs uppercase tracking-widest text-slate dark:text-slate-300">
          {label}
        </label>
        <button
          type="button"
          onClick={addItem}
          className="rounded-full border border-ink/20 px-3 py-1 text-xs text-ink dark:border-white/20 dark:text-slate-100"
        >
          Add another
        </button>
      </div>
      {items.map((item, index) => (
        <div
          key={`${label}-${index}`}
          className="space-y-3 rounded-2xl border border-ink/10 bg-white/70 p-4 dark:border-white/10 dark:bg-slate-950"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-medium text-ink dark:text-slate-100">
              {label} {index + 1}
            </p>
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="rounded-full border border-red-300 px-3 py-1 text-xs text-red-600 dark:border-red-400/40 dark:text-red-300"
            >
              Remove
            </button>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <input
              className="w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none focus:border-ink dark:border-white/10 dark:bg-slate-900 dark:text-slate-100"
              placeholder={titlePlaceholder}
              value={item.title}
              onChange={(e) => updateItem(index, "title", e.target.value)}
              required
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                className="w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none focus:border-ink dark:border-white/10 dark:bg-slate-900 dark:text-slate-100"
                type="month"
                value={item.startDate}
                onChange={(e) => updateItem(index, "startDate", e.target.value)}
                required
              />
              <input
                className="w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none focus:border-ink dark:border-white/10 dark:bg-slate-900 dark:text-slate-100"
                type="month"
                value={item.endDate}
                onChange={(e) => updateItem(index, "endDate", e.target.value)}
                required
              />
            </div>
          </div>
          <textarea
            className="w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none focus:border-ink dark:border-white/10 dark:bg-slate-900 dark:text-slate-100"
            placeholder={descriptionPlaceholder}
            rows={4}
            value={item.description}
            onChange={(e) => updateItem(index, "description", e.target.value)}
            required
          />
        </div>
      ))}
    </div>
  );
}

export default function ResumeGeneratorPage() {
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>("fresher");
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
    skills: "",
    education: "",
    certifications: "",
    achievements: "",
    languages: "",
    softSkills: "",
  });
  const [experienceItems, setExperienceItems] = useState<TimelineItem[]>([emptyTimelineItem()]);
  const [projectItems, setProjectItems] = useState<TimelineItem[]>([emptyTimelineItem()]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);
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
    "soft-skills",
  ]);

  function updateField(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleGenerateSummary() {
    setError("");
    setSummaryLoading(true);

    try {
      const token = window.localStorage.getItem("token") || "";
      const res = await fetch(`${API_URL}/api/resume-generator/summary`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: form.title,
          skills: form.skills,
          experienceLevel,
          experience: experienceItems,
          projects: projectItems,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Summary generation failed");
      }

      const data = (await res.json()) as { summary?: string };
      updateField("summary", data.summary || "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Summary generation failed");
    } finally {
      setSummaryLoading(false);
    }
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
        experience: experienceLevel === "experienced" ? experienceItems : [],
        projects: experienceLevel === "fresher" ? projectItems : [],
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
        <h1 className="text-2xl font-semibold sm:text-3xl">AI Resume Builder</h1>
        <p className="text-sm text-slate dark:text-slate-300">
          Fill the form and generate a professional PDF resume. This feature uses AI to improve content, so review it before sending it out.
        </p>
      </div>
      <form
        className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-sm sm:p-6 dark:border-white/10 dark:bg-slate-900/70"
        onSubmit={handleSubmit}
      >
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
            required
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
            className="w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none focus:border-ink dark:border-white/10 dark:bg-slate-950 dark:text-slate-100 md:col-span-2"
            placeholder="Skills (comma-separated)"
            value={form.skills}
            onChange={(e) => updateField("skills", e.target.value)}
            required
          />
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <label className="text-xs uppercase tracking-widest text-slate dark:text-slate-300">
              Professional Summary
            </label>
            <button
              type="button"
              onClick={handleGenerateSummary}
              disabled={summaryLoading || !form.title.trim()}
              className="rounded-full border border-ink/20 px-3 py-1 text-xs text-ink disabled:opacity-50 dark:border-white/20 dark:text-slate-100"
            >
              {summaryLoading ? "Generating..." : "Generate with AI"}
            </button>
          </div>
          <textarea
            className="w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none focus:border-ink dark:border-white/10 dark:bg-slate-950 dark:text-slate-100"
            placeholder="Professional summary"
            rows={4}
            value={form.summary}
            onChange={(e) => updateField("summary", e.target.value)}
            required
          />
        </div>

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

        <div className="mt-4 flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:gap-4">
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

        {experienceLevel === "experienced" ? (
          <TimelineEditor
            label="Work Experience"
            titlePlaceholder="Job title"
            descriptionPlaceholder="Describe your responsibilities, wins, and impact"
            items={experienceItems}
            onChange={setExperienceItems}
          />
        ) : (
          <TimelineEditor
            label="Projects"
            titlePlaceholder="Project title"
            descriptionPlaceholder="Describe the project, tools used, and results"
            items={projectItems}
            onChange={setProjectItems}
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
        <input
          className="mt-4 w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none focus:border-ink dark:border-white/10 dark:bg-slate-950 dark:text-slate-100"
          placeholder="Soft skills (comma-separated)"
          value={form.softSkills}
          onChange={(e) => updateField("softSkills", e.target.value)}
        />
        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
        <button
          type="submit"
          className="mt-4 w-full rounded-xl bg-ink px-4 py-3 text-sm text-fog transition hover:-translate-y-0.5 sm:w-auto dark:bg-slate-100 dark:text-slate-900"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Resume"}
        </button>
      </form>
    </div>
  );
}
