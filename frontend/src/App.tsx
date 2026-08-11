import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  BookOpen,
  Box,
  Brain,
  Check,
  ChevronDown,
  ChevronRight,
  Code2,
  Database,
  FileText,
  Folder,
  Gauge,
  GitBranch,
  LayoutDashboard,
  Link2,
  Menu,
  MessageSquare,
  Pencil,
  Plus,
  Server,
  Trash2,
  X,
  Cloud,
} from "lucide-react";
import { SiLeetcode, SiYoutube } from "react-icons/si";
import { IconButton } from "./components/IconButton";
import { ProgressBar } from "./components/ProgressBar";
import { CloudSyncModal } from "./components/CloudSyncModal";
import {
  type CloudCredentials,
  fetchFromCloud,
  saveToCloud,
} from "./lib/cloudSync";
import {
  DUMMY_LEETCODE_URL,
  DUMMY_YOUTUBE_URL,
  CS_CORE_FOLDERS,
  addDsaProblemToTopic,
  addFolderToCategory,
  addItemToCategory,
  addLearningItemToFolder,
  addSectionToRoadmap,
  createInitialRoadmap,
  deleteItemFromRoadmap,
  deleteFolderFromCategory,
  deleteResourceTree,
  deleteSectionFromRoadmap,
  normalizeRoadmap,
  updateItemInRoadmap,
  upsertResource,
} from "./lib/mockRoadmap";
import type {
  Category,
  PlacementResource,
  RoadmapItem,
  RoadmapResponse,
} from "./lib/types";

const STORAGE_KEY = "prepstack-frontend-state-v8";

const navIcons: Record<string, typeof LayoutDashboard> = {
  dashboard: LayoutDashboard,
  dsa: Code2,
  frontend: BookOpen,
  backend: Server,
  "cs-core": Database,
  "git-github": GitBranch,
  "system-design": Brain,
  docker: Box,
  aptitude: Gauge,
  communication: MessageSquare,
  "placement-resources": Link2,
};

function loadInitialState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    return createInitialRoadmap();
  }

  try {
    return normalizeRoadmap(JSON.parse(saved) as RoadmapResponse);
  } catch {
    return createInitialRoadmap();
  }
}

export default function App() {
  const [roadmap, setRoadmap] = useState<RoadmapResponse>(loadInitialState);
  const [activeSlug, setActiveSlug] = useState("dashboard");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [openTopics, setOpenTopics] = useState<Record<string, boolean>>({});
  const [isCloudModalOpen, setIsCloudModalOpen] = useState(false);
  const [cloudCreds, setCloudCreds] = useState<CloudCredentials | null>(() => {
    const saved = localStorage.getItem("prepstack-cloud-creds");
    return saved ? JSON.parse(saved) : null;
  });
  const [isInitialCloudLoad, setIsInitialCloudLoad] = useState(false);

  const activeCategory =
    roadmap.categories.find((category) => category.slug === activeSlug) ??
    roadmap.categories[0];

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(roadmap));
  }, [roadmap]);

  useEffect(() => {
    if (cloudCreds) {
      localStorage.setItem("prepstack-cloud-creds", JSON.stringify(cloudCreds));
    } else {
      localStorage.removeItem("prepstack-cloud-creds");
    }
  }, [cloudCreds]);

  // Initial cloud fetch
  useEffect(() => {
    if (cloudCreds && !isInitialCloudLoad) {
      fetchFromCloud(cloudCreds)
        .then((cloudData) => {
          if (cloudData) {
            setRoadmap(normalizeRoadmap(cloudData));
          }
          setIsInitialCloudLoad(true);
        })
        .catch((err) => {
          console.error("Initial cloud load failed:", err);
          setIsInitialCloudLoad(true);
        });
    } else if (!cloudCreds) {
      setIsInitialCloudLoad(true);
    }
  }, [cloudCreds, isInitialCloudLoad]);

  // Auto save to cloud
  useEffect(() => {
    if (cloudCreds && isInitialCloudLoad) {
      const timer = setTimeout(() => {
        saveToCloud(cloudCreds, roadmap);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [roadmap, cloudCreds, isInitialCloudLoad]);

  const trackedCategories = useMemo(
    () => roadmap.categories.filter((category) => category.progressTracked),
    [roadmap.categories],
  );

  function selectSection(slug: string) {
    setActiveSlug(slug);
    setMobileNavOpen(false);
  }

  function updateItem(id: number, patch: Partial<RoadmapItem>) {
    setRoadmap((current) => updateItemInRoadmap(current, id, patch));
  }

  function addTopic(categorySlug: string, title: string) {
    setRoadmap((current) => addItemToCategory(current, categorySlug, title));
  }

  function addSection(title: string) {
    setRoadmap((current) => addSectionToRoadmap(current, title));
  }

  function addFolderTopic(categorySlug: string, folder: string, title: string) {
    setRoadmap((current) =>
      addLearningItemToFolder(current, categorySlug, folder, title),
    );
  }

  function addFolder(categorySlug: string, folderName: string) {
    setRoadmap((current) =>
      addFolderToCategory(current, categorySlug, folderName),
    );
  }

  function addDsaProblem(topic: string) {
    setRoadmap((current) => addDsaProblemToTopic(current, topic));
    setOpenTopics((current) => ({ ...current, [topic]: true }));
  }

  function deleteItem(id: number) {
    setRoadmap((current) => deleteItemFromRoadmap(current, id));
  }

  function deleteSection(slug: string) {
    if (activeSlug === slug) {
      setActiveSlug("dashboard");
    }
    setRoadmap((current) => deleteSectionFromRoadmap(current, slug));
  }

  function deleteFolder(categorySlug: string, folderName: string) {
    setRoadmap((current) =>
      deleteFolderFromCategory(current, categorySlug, folderName),
    );
  }

  function saveResource(
    resource: Omit<PlacementResource, "id"> & { id?: number },
  ) {
    setRoadmap((current) => ({
      ...current,
      resources: upsertResource(current.resources, resource),
    }));
  }

  function deleteResource(id: number) {
    setRoadmap((current) => ({
      ...current,
      resources: deleteResourceTree(current.resources, id),
    }));
  }

  return (
    <div className="min-h-screen bg-ink text-slate-100">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_10%,rgba(61,220,151,0.16),transparent_26%),radial-gradient(circle_at_85%_5%,rgba(244,184,96,0.12),transparent_24%),linear-gradient(135deg,#080a0f_0%,#121620_52%,#0b0d13_100%)]" />
      <div className="flex min-h-screen">
        <Sidebar
          categories={roadmap.categories}
          activeSlug={activeSlug}
          mobileOpen={mobileNavOpen}
          onSelect={selectSection}
          onClose={() => setMobileNavOpen(false)}
          onDeleteSection={deleteSection}
        />

        <main className="min-w-0 flex-1 lg:pl-72">
          <header className="sticky top-0 z-20 border-b border-white/10 bg-ink/80 px-4 py-4 backdrop-blur lg:px-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-mint">
                  PrepStack
                </p>
                <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
                  {activeCategory.title}
                </h1>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsCloudModalOpen(true)}
                  className="flex h-10 items-center gap-2 rounded-md border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  <Cloud size={18} className={cloudCreds ? "text-mint" : ""} />
                  <span className="hidden sm:inline">Cloud Sync</span>
                </button>
                <button
                  aria-label="Open navigation"
                  className="grid h-10 w-10 place-items-center rounded-md border border-white/10 bg-white/[0.04] lg:hidden"
                  onClick={() => setMobileNavOpen(true)}
                >
                  <Menu size={20} />
                </button>
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
            {activeSlug === "dashboard" && (
              <Dashboard
                roadmap={roadmap}
                trackedCategories={trackedCategories}
                onAddSection={addSection}
              />
            )}
            {activeSlug === "dsa" && (
              <DsaSection
                category={activeCategory}
                openTopics={openTopics}
                onToggleTopic={(topic) =>
                  setOpenTopics((current) => ({
                    ...current,
                    [topic]: !current[topic],
                  }))
                }
                onAddProblem={addDsaProblem}
                onDeleteItem={deleteItem}
                onUpdateItem={updateItem}
              />
            )}
            {activeSlug === "cs-core" && (
              <FolderLearningSection
                category={activeCategory}
                folders={
                  Object.keys(activeCategory.topics).length > 0
                    ? Object.keys(activeCategory.topics)
                    : CS_CORE_FOLDERS
                }
                onAddTopic={addFolderTopic}
                onAddFolder={(folderName) =>
                  addFolder(activeCategory.slug, folderName)
                }
                onDeleteFolder={(folderName) =>
                  deleteFolder(activeCategory.slug, folderName)
                }
                onDeleteItem={deleteItem}
                onUpdateItem={updateItem}
              />
            )}
            {activeSlug !== "dashboard" &&
              activeSlug !== "dsa" &&
              activeSlug !== "placement-resources" &&
              activeSlug !== "cs-core" && (
                <LearningSection
                  category={activeCategory}
                  onAddTopic={addTopic}
                  onAddFolder={(folderName) =>
                    addFolder(activeCategory.slug, folderName)
                  }
                  onAddFolderTopic={addFolderTopic}
                  onDeleteFolder={(folderName) =>
                    deleteFolder(activeCategory.slug, folderName)
                  }
                  onDeleteItem={deleteItem}
                  onUpdateItem={updateItem}
                />
              )}
            {activeSlug === "placement-resources" && (
              <ResourcesSection
                resources={roadmap.resources}
                onSave={saveResource}
                onDelete={deleteResource}
              />
            )}
          </div>
        </main>
      </div>

      <CloudSyncModal
        isOpen={isCloudModalOpen}
        onClose={() => setIsCloudModalOpen(false)}
        currentCreds={cloudCreds}
        onConnect={async (creds) => {
          try {
            // Attempt immediate sync to verify credentials FIRST
            const data = await fetchFromCloud(creds);
            if (data) {
              setRoadmap(normalizeRoadmap(data));
            } else {
              // If no data exists, push current roadmap
              const success = await saveToCloud(creds, roadmap);
              if (!success) {
                return false;
              }
            }
            // Only set credentials if connection succeeded and we read/wrote successfully
            setCloudCreds(creds);
            return true;
          } catch (e) {
            console.error("Cloud connection failed verification:", e);
            return false;
          }
        }}
        onDisconnect={() => {
          setCloudCreds(null);
          setIsInitialCloudLoad(false);
        }}
      />
    </div>
  );
}

// Sections that cannot be deleted
const PROTECTED_SLUGS = new Set(["dashboard", "dsa", "placement-resources"]);

function Sidebar({
  categories,
  activeSlug,
  mobileOpen,
  onSelect,
  onClose,
  onDeleteSection,
}: {
  categories: Category[];
  activeSlug: string;
  mobileOpen: boolean;
  onSelect: (slug: string) => void;
  onClose: () => void;
  onDeleteSection: (slug: string) => void;
}) {
  return (
    <>
      {mobileOpen && (
        <button
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          aria-label="Close navigation"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-white/10 bg-[#0b0f17]/95 p-4 backdrop-blur-xl transition lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="text-lg font-bold text-white">PrepStack</div>
            <div className="text-xs text-slate-400">SDE prep tracker</div>
          </div>
          <button
            aria-label="Close navigation"
            className="grid h-9 w-9 place-items-center rounded-md lg:hidden"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        <nav className="space-y-1">
          {categories.map((category) => {
            const Icon = navIcons[category.slug] ?? BookOpen;
            const isActive = activeSlug === category.slug;
            const canDelete = !PROTECTED_SLUGS.has(category.slug);
            return (
              <div
                key={category.slug}
                className="group relative flex items-center"
              >
                <button
                  className={`flex min-w-0 flex-1 items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm transition ${
                    isActive
                      ? "bg-mint/15 text-mint shadow-glow"
                      : "text-slate-300 hover:bg-white/[0.05] hover:text-white"
                  }`}
                  onClick={() => onSelect(category.slug)}
                >
                  <Icon size={18} />
                  <span className="min-w-0 flex-1 truncate">
                    {category.title}
                  </span>
                  {category.progressTracked && (
                    <span className="text-xs text-slate-500">
                      {category.progress}%
                    </span>
                  )}
                </button>
                {canDelete && (
                  <button
                    aria-label={`Delete ${category.title}`}
                    className="ml-1 hidden h-7 w-7 shrink-0 items-center justify-center rounded-md text-slate-600 transition hover:bg-red-500/15 hover:text-red-400 group-hover:flex"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (
                        window.confirm(
                          `Delete "${category.title}"? All topics inside will be lost.`,
                        )
                      ) {
                        onDeleteSection(category.slug);
                      }
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

function Dashboard({
  roadmap,
  trackedCategories,
  onAddSection,
}: {
  roadmap: RoadmapResponse;
  trackedCategories: Category[];
  onAddSection: (title: string) => void;
}) {
  const [sectionTitle, setSectionTitle] = useState("");

  function addSection() {
    if (!sectionTitle.trim()) {
      return;
    }
    onAddSection(sectionTitle);
    setSectionTitle("");
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-3 rounded-lg border border-white/10 bg-panel p-4 sm:grid-cols-[1fr_auto]">
        <input
          aria-label="New section title"
          value={sectionTitle}
          placeholder="New section title"
          onChange={(event) => setSectionTitle(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              addSection();
            }
          }}
          className="min-w-0 rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500 focus:border-mint"
        />
        <button
          className="inline-flex items-center justify-center gap-2 rounded-md border border-mint/40 bg-mint/10 px-3 py-2 text-sm font-semibold text-mint transition hover:bg-mint/15 disabled:cursor-not-allowed disabled:opacity-40"
          disabled={!sectionTitle.trim()}
          onClick={addSection}
        >
          <Plus size={17} />
          Add Section
        </button>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-lg border border-white/10 bg-panel p-5 shadow-glow">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Overall Progress
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                {roadmap.overall.completedCount} / {roadmap.overall.totalCount}{" "}
                completed
              </p>
            </div>
            <div className="text-5xl font-black text-mint">
              {roadmap.overall.progress}%
            </div>
          </div>
          <div className="mt-5">
            <ProgressBar value={roadmap.overall.progress} />
          </div>
        </div>
        <div className="rounded-lg border border-white/10 bg-panel p-5">
          <h2 className="text-lg font-semibold text-white">Focus Snapshot</h2>
          <div className="mt-4 grid grid-cols-3 gap-3">
            <Metric label="Sections" value={trackedCategories.length} />
            <Metric label="Completed" value={roadmap.overall.completedCount} />
            <Metric
              label="Remaining"
              value={
                roadmap.overall.totalCount - roadmap.overall.completedCount
              }
            />
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {trackedCategories.map((category) => (
          <div
            key={category.slug}
            className="rounded-lg border border-white/10 bg-panel p-4"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="font-semibold text-white">{category.title}</h3>
              <span className="text-sm text-slate-400">
                {category.progress}%
              </span>
            </div>
            <ProgressBar
              value={category.progress}
              tone={
                category.progress > 70
                  ? "mint"
                  : category.progress > 35
                    ? "amber"
                    : "coral"
              }
            />
            <div className="mt-3 text-sm text-slate-400">
              {category.completedCount} / {category.totalCount} completed
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-white/10 bg-white/[0.04] p-3">
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="mt-1 text-xs text-slate-400">{label}</div>
    </div>
  );
}

function DsaSection({
  category,
  openTopics,
  onToggleTopic,
  onAddProblem,
  onDeleteItem,
  onUpdateItem,
}: {
  category: Category;
  openTopics: Record<string, boolean>;
  onToggleTopic: (topic: string) => void;
  onAddProblem: (topic: string) => void;
  onDeleteItem: (id: number) => void;
  onUpdateItem: (id: number, patch: Partial<RoadmapItem>) => void;
}) {
  return (
    <section className="space-y-4">
      <SectionProgress category={category} />
      {Object.entries(category.topics).map(([topic, items]) => (
        <div
          key={topic}
          className="overflow-hidden rounded-lg border border-white/10 bg-panel"
        >
          <button
            className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left"
            onClick={() => onToggleTopic(topic)}
          >
            <div className="flex items-center gap-3">
              {openTopics[topic] ? (
                <ChevronDown size={18} />
              ) : (
                <ChevronRight size={18} />
              )}
              <div>
                <h2 className="font-semibold text-white">{topic}</h2>
                <p className="text-sm text-slate-400">
                  {items.filter((item) => item.completed).length} /{" "}
                  {items.length} completed
                </p>
              </div>
            </div>
            <span className="text-sm font-semibold text-mint">
              {Math.round(
                (items.filter((item) => item.completed).length * 100) /
                  items.length,
              )}
              %
            </span>
          </button>
          {openTopics[topic] && (
            <div className="border-t border-white/10">
              <div className="flex justify-end px-4 py-3">
                <button
                  className="inline-flex items-center gap-2 rounded-md border border-mint/40 bg-mint/10 px-3 py-2 text-sm font-semibold text-mint transition hover:bg-mint/15"
                  onClick={() => onAddProblem(topic)}
                >
                  <Plus size={17} />
                  Add Problem
                </button>
              </div>
              <div className="divide-y divide-white/10">
                {items.map((item) => (
                  <DsaProblemRow
                    key={item.id}
                    item={item}
                    onDeleteItem={onDeleteItem}
                    onUpdateItem={onUpdateItem}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </section>
  );
}

function DsaProblemRow({
  item,
  onDeleteItem,
  onUpdateItem,
}: {
  item: RoadmapItem;
  onDeleteItem: (id: number) => void;
  onUpdateItem: (id: number, patch: Partial<RoadmapItem>) => void;
}) {
  const hasTitle = item.title.trim().length > 0;

  function updateTitle(title: string) {
    const patch: Partial<RoadmapItem> = { title };
    if (title.trim() && !item.title.trim()) {
      patch.leetcodeUrl = item.leetcodeUrl ?? DUMMY_LEETCODE_URL;
      patch.youtubeUrl = item.youtubeUrl ?? DUMMY_YOUTUBE_URL;
    }
    if (!title.trim()) {
      patch.completed = false;
    }
    onUpdateItem(item.id, patch);
  }

  return (
    <div className="grid gap-3 px-4 py-3 xl:grid-cols-[auto_1.4fr_1fr_1fr_auto_auto] xl:items-center">
      <CompletionCheckbox
        disabled={!hasTitle}
        completed={item.completed}
        onChange={(completed) => onUpdateItem(item.id, { completed })}
      />
      <input
        aria-label={`Problem slot ${item.slotNumber}`}
        value={item.title}
        placeholder={`Problem slot ${item.slotNumber}`}
        onChange={(event) => updateTitle(event.target.value)}
        className="min-w-0 rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-mint"
      />
      <LinkEditor
        disabled={!hasTitle}
        icon="leetcode"
        label="LeetCode"
        value={item.leetcodeUrl ?? ""}
        onChange={(leetcodeUrl) => onUpdateItem(item.id, { leetcodeUrl })}
      />
      <LinkEditor
        disabled={!hasTitle}
        icon="youtube"
        label="YouTube"
        value={item.youtubeUrl ?? ""}
        onChange={(youtubeUrl) => onUpdateItem(item.id, { youtubeUrl })}
      />
      <select
        aria-label="Difficulty"
        disabled={!hasTitle}
        value={item.difficulty ?? ""}
        onChange={(event) =>
          onUpdateItem(item.id, { difficulty: event.target.value })
        }
        className="h-9 rounded-md border border-white/10 bg-[#0d111a] px-2 text-sm text-slate-200 outline-none disabled:cursor-not-allowed disabled:opacity-40 focus:border-mint"
      >
        <option value="">Difficulty</option>
        <option>Easy</option>
        <option>Medium</option>
        <option>Hard</option>
      </select>
      <IconButton label="Delete problem" onClick={() => onDeleteItem(item.id)}>
        <Trash2 size={17} />
      </IconButton>
    </div>
  );
}

function LearningSection({
  category,
  onAddTopic,
  onAddFolder,
  onAddFolderTopic,
  onDeleteFolder,
  onDeleteItem,
  onUpdateItem,
}: {
  category: Category;
  onAddTopic: (categorySlug: string, title: string) => void;
  onAddFolder: (folderName: string) => void;
  onAddFolderTopic: (
    categorySlug: string,
    folder: string,
    title: string,
  ) => void;
  onDeleteFolder: (folderName: string) => void;
  onDeleteItem: (id: number) => void;
  onUpdateItem: (id: number, patch: Partial<RoadmapItem>) => void;
}) {
  const [newTopicTitle, setNewTopicTitle] = useState("");
  const [newFolderTitle, setNewFolderTitle] = useState("");
  const [showFolderInput, setShowFolderInput] = useState(false);
  const [draftFolderTitles, setDraftFolderTitles] = useState<
    Record<string, string>
  >({});
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({});

  const folders = Object.keys(category.topics || {});
  const ungroupedItems = category.items.filter((item) => !item.topic);

  function addTopic() {
    if (!newTopicTitle.trim()) return;
    onAddTopic(category.slug, newTopicTitle);
    setNewTopicTitle("");
  }

  function addFolder() {
    if (!newFolderTitle.trim()) return;
    const name = newFolderTitle.trim();
    onAddFolder(name);
    setNewFolderTitle("");
    setShowFolderInput(false);
    setOpenFolders((current) => ({ ...current, [name]: true }));
  }

  function addFolderTopic(folder: string) {
    onAddFolderTopic(category.slug, folder, draftFolderTitles[folder] ?? "");
    setDraftFolderTitles((current) => ({ ...current, [folder]: "" }));
    setOpenFolders((current) => ({ ...current, [folder]: true }));
  }

  return (
    <section className="space-y-5">
      <SectionProgress category={category} />

      {/* Add item toolbar */}
      <div className="space-y-2 rounded-lg border border-white/10 bg-panel p-4">
        <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
          <input
            aria-label="New topic title"
            value={newTopicTitle}
            placeholder="Enter topic title"
            onChange={(event) => setNewTopicTitle(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") addTopic();
            }}
            className="min-w-0 rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500 focus:border-mint"
          />
          <button
            className="inline-flex items-center justify-center gap-2 rounded-md border border-mint/40 bg-mint/10 px-3 py-2 text-sm font-semibold text-mint transition hover:bg-mint/15"
            onClick={addTopic}
          >
            <Plus size={17} />
            New Topic
          </button>
          <button
            className="inline-flex items-center justify-center gap-2 rounded-md border border-amber/40 bg-amber/10 px-3 py-2 text-sm font-semibold text-amber transition hover:bg-amber/15"
            onClick={() => setShowFolderInput((v) => !v)}
          >
            <Folder size={17} />
            New Folder
          </button>
        </div>
        {showFolderInput && (
          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <input
              aria-label="New folder name"
              value={newFolderTitle}
              placeholder="Folder name"
              autoFocus
              onChange={(event) => setNewFolderTitle(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") addFolder();
                if (event.key === "Escape") setShowFolderInput(false);
              }}
              className="min-w-0 rounded-md border border-amber/40 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500 focus:border-amber"
            />
            <button
              disabled={!newFolderTitle.trim()}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-amber/40 bg-amber/10 px-3 py-2 text-sm font-semibold text-amber transition hover:bg-amber/15 disabled:cursor-not-allowed disabled:opacity-40"
              onClick={addFolder}
            >
              <Plus size={17} />
              Create
            </button>
          </div>
        )}
      </div>

      {/* Folders */}
      {folders.length > 0 && (
        <div className="space-y-3">
          {folders.map((folder) => {
            const items = category.topics[folder] ?? [];
            const completed = items.filter((item) => item.completed).length;
            return (
              <div
                key={folder}
                className="overflow-hidden rounded-lg border border-white/10 bg-panel"
              >
                <div className="flex w-full items-center justify-between gap-4 px-4 py-4">
                  <button
                    className="flex min-w-0 flex-1 items-center gap-3 text-left"
                    onClick={() =>
                      setOpenFolders((current) => ({
                        ...current,
                        [folder]: !current[folder],
                      }))
                    }
                  >
                    {openFolders[folder] ? (
                      <ChevronDown size={18} />
                    ) : (
                      <ChevronRight size={18} />
                    )}
                    <Folder size={16} className="text-amber" />
                    <div>
                      <h2 className="font-semibold text-white">{folder}</h2>
                      <p className="text-sm text-slate-400">
                        {completed} / {items.length} completed
                      </p>
                    </div>
                  </button>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="text-sm font-semibold text-mint">
                      {items.length === 0
                        ? 0
                        : Math.round((completed * 100) / items.length)}
                      %
                    </span>
                    <IconButton
                      label={`Delete folder ${folder}`}
                      onClick={() => {
                        if (
                          window.confirm(
                            `Delete folder "${folder}"? All topics inside will be lost.`,
                          )
                        ) {
                          onDeleteFolder(folder);
                        }
                      }}
                    >
                      <Trash2 size={15} />
                    </IconButton>
                  </div>
                </div>
                {openFolders[folder] && (
                  <div className="space-y-3 border-t border-white/10 p-4">
                    <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                      <input
                        aria-label={`${folder} new topic`}
                        value={draftFolderTitles[folder] ?? ""}
                        placeholder={`Add topic to ${folder}`}
                        onChange={(event) =>
                          setDraftFolderTitles((current) => ({
                            ...current,
                            [folder]: event.target.value,
                          }))
                        }
                        onKeyDown={(event) => {
                          if (event.key === "Enter") addFolderTopic(folder);
                        }}
                        className="min-w-0 rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500 focus:border-mint"
                      />
                      <button
                        className="inline-flex items-center justify-center gap-2 rounded-md border border-mint/40 bg-mint/10 px-3 py-2 text-sm font-semibold text-mint transition hover:bg-mint/15"
                        onClick={() => addFolderTopic(folder)}
                      >
                        <Plus size={17} />
                        Add Topic
                      </button>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {items.map((item) => (
                        <LearningItemCard
                          key={item.id}
                          item={item}
                          onDeleteItem={onDeleteItem}
                          onUpdateItem={onUpdateItem}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Ungrouped items */}
      {ungroupedItems.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {ungroupedItems.map((item) => (
            <div
              key={item.id}
              className="rounded-lg border border-white/10 bg-panel p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                  <CompletionCheckbox
                    completed={item.completed}
                    onChange={(completed) =>
                      onUpdateItem(item.id, { completed })
                    }
                  />
                  <div className="min-w-0 flex-1 space-y-3">
                    <input
                      aria-label="Topic title"
                      value={item.title}
                      placeholder="Topic title"
                      onChange={(event) =>
                        onUpdateItem(item.id, { title: event.target.value })
                      }
                      className="w-full rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-semibold text-white outline-none focus:border-mint"
                    />
                    <LinkEditor
                      icon="youtube"
                      label="YouTube"
                      value={item.youtubeUrl ?? DUMMY_YOUTUBE_URL}
                      onChange={(youtubeUrl) =>
                        onUpdateItem(item.id, { youtubeUrl })
                      }
                    />
                  </div>
                </div>
                <IconButton
                  label="Delete topic"
                  onClick={() => onDeleteItem(item.id)}
                >
                  <Trash2 size={17} />
                </IconButton>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function FolderLearningSection({
  category,
  folders,
  onAddTopic,
  onAddFolder,
  onDeleteFolder,
  onDeleteItem,
  onUpdateItem,
}: {
  category: Category;
  folders: string[];
  onAddTopic: (categorySlug: string, folder: string, title: string) => void;
  onAddFolder: (folderName: string) => void;
  onDeleteFolder: (folderName: string) => void;
  onDeleteItem: (id: number) => void;
  onUpdateItem: (id: number, patch: Partial<RoadmapItem>) => void;
}) {
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>(
    Object.fromEntries(folders.map((folder) => [folder, false])),
  );
  const [draftTitles, setDraftTitles] = useState<Record<string, string>>({});
  const [newFolderTitle, setNewFolderTitle] = useState("");
  const [showFolderInput, setShowFolderInput] = useState(false);

  function addTopic(folder: string) {
    onAddTopic(category.slug, folder, draftTitles[folder] ?? "");
    setDraftTitles((current) => ({ ...current, [folder]: "" }));
    setOpenFolders((current) => ({ ...current, [folder]: true }));
  }

  function addFolder() {
    if (!newFolderTitle.trim()) return;
    const name = newFolderTitle.trim();
    onAddFolder(name);
    setNewFolderTitle("");
    setShowFolderInput(false);
    setOpenFolders((current) => ({ ...current, [name]: true }));
  }

  return (
    <section className="space-y-4">
      <SectionProgress category={category} />

      {/* New Folder toolbar */}
      <div className="rounded-lg border border-white/10 bg-panel p-4">
        {showFolderInput ? (
          <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
            <input
              aria-label="New folder name"
              value={newFolderTitle}
              placeholder="Folder name"
              autoFocus
              onChange={(event) => setNewFolderTitle(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") addFolder();
                if (event.key === "Escape") setShowFolderInput(false);
              }}
              className="min-w-0 rounded-md border border-amber/40 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500 focus:border-amber"
            />
            <button
              disabled={!newFolderTitle.trim()}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-amber/40 bg-amber/10 px-3 py-2 text-sm font-semibold text-amber transition hover:bg-amber/15 disabled:cursor-not-allowed disabled:opacity-40"
              onClick={addFolder}
            >
              <Plus size={17} />
              Create
            </button>
            <button
              className="inline-flex items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-400 transition hover:bg-white/[0.08]"
              onClick={() => setShowFolderInput(false)}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            className="inline-flex items-center gap-2 rounded-md border border-amber/40 bg-amber/10 px-3 py-2 text-sm font-semibold text-amber transition hover:bg-amber/15"
            onClick={() => setShowFolderInput(true)}
          >
            <Folder size={17} />
            New Folder
          </button>
        )}
      </div>

      {folders.map((folder) => {
        const items =
          category.topics[folder] ??
          category.items.filter((item) => item.topic === folder);
        const completed = items.filter((item) => item.completed).length;
        return (
          <div
            key={folder}
            className="overflow-hidden rounded-lg border border-white/10 bg-panel"
          >
            <div className="flex w-full items-center justify-between gap-4 px-4 py-4">
              <button
                className="flex min-w-0 flex-1 items-center gap-3 text-left"
                onClick={() =>
                  setOpenFolders((current) => ({
                    ...current,
                    [folder]: !current[folder],
                  }))
                }
              >
                {openFolders[folder] ? (
                  <ChevronDown size={18} />
                ) : (
                  <ChevronRight size={18} />
                )}
                <Folder size={16} className="text-amber" />
                <div>
                  <h2 className="font-semibold text-white">{folder}</h2>
                  <p className="text-sm text-slate-400">
                    {completed} / {items.length} completed
                  </p>
                </div>
              </button>
              <div className="flex shrink-0 items-center gap-3">
                <span className="text-sm font-semibold text-mint">
                  {items.length === 0
                    ? 0
                    : Math.round((completed * 100) / items.length)}
                  %
                </span>
                <IconButton
                  label={`Delete folder ${folder}`}
                  onClick={() => {
                    if (
                      window.confirm(
                        `Delete folder "${folder}"? All topics inside will be lost.`,
                      )
                    ) {
                      onDeleteFolder(folder);
                    }
                  }}
                >
                  <Trash2 size={15} />
                </IconButton>
              </div>
            </div>
            {openFolders[folder] && (
              <div className="space-y-3 border-t border-white/10 p-4">
                <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                  <input
                    aria-label={`${folder} title`}
                    value={draftTitles[folder] ?? ""}
                    placeholder={`Add topic to ${folder}`}
                    onChange={(event) =>
                      setDraftTitles((current) => ({
                        ...current,
                        [folder]: event.target.value,
                      }))
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        addTopic(folder);
                      }
                    }}
                    className="min-w-0 rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500 focus:border-mint"
                  />
                  <button
                    className="inline-flex items-center justify-center gap-2 rounded-md border border-mint/40 bg-mint/10 px-3 py-2 text-sm font-semibold text-mint transition hover:bg-mint/15"
                    onClick={() => addTopic(folder)}
                  >
                    <Plus size={17} />
                    Add Topic
                  </button>
                </div>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {items.map((item) => (
                    <LearningItemCard
                      key={item.id}
                      item={item}
                      onDeleteItem={onDeleteItem}
                      onUpdateItem={onUpdateItem}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
}

function LearningItemCard({
  item,
  onDeleteItem,
  onUpdateItem,
}: {
  item: RoadmapItem;
  onDeleteItem: (id: number) => void;
  onUpdateItem: (id: number, patch: Partial<RoadmapItem>) => void;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-panel p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <CompletionCheckbox
            completed={item.completed}
            onChange={(completed) => onUpdateItem(item.id, { completed })}
          />
          <div className="min-w-0 flex-1 space-y-3">
            <input
              aria-label="Topic title"
              value={item.title}
              placeholder="Topic title"
              onChange={(event) =>
                onUpdateItem(item.id, { title: event.target.value })
              }
              className="w-full rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-semibold text-white outline-none focus:border-mint"
            />
            <LinkEditor
              icon="youtube"
              label="YouTube"
              value={item.youtubeUrl ?? DUMMY_YOUTUBE_URL}
              onChange={(youtubeUrl) => onUpdateItem(item.id, { youtubeUrl })}
            />
          </div>
        </div>
        <IconButton label="Delete topic" onClick={() => onDeleteItem(item.id)}>
          <Trash2 size={17} />
        </IconButton>
      </div>
    </div>
  );
}

function LinkEditor({
  disabled = false,
  icon,
  label,
  value,
  onChange,
}: {
  disabled?: boolean;
  icon: "leetcode" | "youtube";
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const Icon = icon === "leetcode" ? SiLeetcode : SiYoutube;
  return (
    <div className="grid min-w-0 grid-cols-[auto_1fr_auto] items-center gap-2">
      <span
        className={
          disabled
            ? "text-slate-600"
            : icon === "leetcode"
              ? "text-amber"
              : "text-coral"
        }
      >
        <Icon size={18} />
      </span>
      <input
        aria-label={`${label} URL`}
        disabled={disabled}
        value={value}
        placeholder={`${label} URL`}
        onChange={(event) => onChange(event.target.value)}
        className="min-w-0 rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none disabled:cursor-not-allowed disabled:opacity-40 placeholder:text-slate-500 focus:border-mint"
      />
      <IconButton
        label={`Open ${label}`}
        disabled={disabled || !value}
        onClick={() => value && window.open(value, "_blank")}
      >
        <Link2 size={16} />
      </IconButton>
    </div>
  );
}

function SectionProgress({ category }: { category: Category }) {
  return (
    <div className="rounded-lg border border-white/10 bg-panel p-5">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white">
            {category.title} Progress
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            {category.completedCount} / {category.totalCount} completed
          </p>
        </div>
        <div className="text-4xl font-black text-mint">
          {category.progress}%
        </div>
      </div>
      <ProgressBar value={category.progress} />
    </div>
  );
}

function CompletionCheckbox({
  completed,
  disabled = false,
  onChange,
}: {
  completed: boolean;
  disabled?: boolean;
  onChange: (completed: boolean) => void;
}) {
  return (
    <button
      aria-label={completed ? "Completed" : "Not Completed"}
      title={completed ? "Completed" : "Not Completed"}
      className={`grid h-8 w-8 shrink-0 place-items-center rounded-md border transition ${
        completed
          ? "border-mint bg-mint text-ink"
          : "border-white/15 bg-white/[0.03] text-transparent hover:border-mint"
      } ${disabled ? "cursor-not-allowed opacity-40 hover:border-white/15" : ""}`}
      disabled={disabled}
      onClick={() => onChange(!completed)}
    >
      <Check size={17} strokeWidth={3} />
    </button>
  );
}

function ResourcesSection({
  resources,
  onSave,
  onDelete,
}: {
  resources: PlacementResource[];
  onSave: (resource: Omit<PlacementResource, "id"> & { id?: number }) => void;
  onDelete: (id: number) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const folderInputRef = useRef<HTMLInputElement | null>(null);
  const pendingFileParentId = useRef<number | null>(null);
  const pendingFolderParentId = useRef<number | null>(null);

  function openFilePicker(parentId: number | null = null) {
    pendingFileParentId.current = parentId;
    fileInputRef.current?.click();
  }

  function openFolderPicker(parentId: number | null = null) {
    pendingFolderParentId.current = parentId;
    folderInputRef.current?.click();
  }

  function addFiles(event: ChangeEvent<HTMLInputElement>) {
    const parentId = pendingFileParentId.current;
    Array.from(event.target.files ?? []).forEach((file) => {
      onSave({
        title: file.name,
        url: URL.createObjectURL(file),
        type: "RESOURCE",
        parentId,
      });
    });
    pendingFileParentId.current = null;
    event.target.value = "";
  }

  function addFolderFiles(event: ChangeEvent<HTMLInputElement>) {
    const parentId = pendingFolderParentId.current;
    Array.from(event.target.files ?? []).forEach((file) => {
      const relativePath = file.webkitRelativePath || file.name;
      const parts = relativePath.split("/").filter(Boolean);
      const title = parts.length > 1 ? relativePath : file.name;
      onSave({
        title,
        url: URL.createObjectURL(file),
        type: "RESOURCE",
        parentId,
      });
    });
    pendingFolderParentId.current = null;
    event.target.value = "";
  }

  function addFolder(parentId: number | null = null) {
    const title = window.prompt("Folder name");
    if (title?.trim()) {
      onSave({ title: title.trim(), url: null, type: "FOLDER", parentId });
    }
  }

  return (
    <section className="space-y-5">
      <div className="rounded-lg border border-white/10 bg-panel p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-white">Resources</h2>
            <p className="mt-1 text-sm text-slate-400">
              Reference materials here do not affect overall progress.
            </p>
          </div>
          <button
            className="inline-flex items-center gap-2 rounded-md border border-mint/40 bg-mint/10 px-3 py-2 text-sm font-semibold text-mint hover:bg-mint/15"
            onClick={() => openFilePicker()}
          >
            <Plus size={17} />
            Add Resource
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.webp,.gif,image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="hidden"
          onChange={addFiles}
        />
        <input
          ref={folderInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={addFolderFiles}
          // @ts-expect-error Chromium supports directory picking for folder uploads.
          webkitdirectory=""
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-200 hover:bg-white/[0.08]"
            onClick={() => addFolder()}
          >
            New Folder
          </button>
          <button
            className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-200 hover:bg-white/[0.08]"
            onClick={() => openFolderPicker()}
          >
            Upload Folder
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <ResourceTree
          resources={resources}
          parentId={null}
          depth={0}
          onAddFile={openFilePicker}
          onAddFolderUpload={openFolderPicker}
          onAddFolder={addFolder}
          onDelete={onDelete}
          onSave={onSave}
        />
      </div>
    </section>
  );
}

function ResourceTree({
  resources,
  parentId,
  depth,
  onAddFile,
  onAddFolderUpload,
  onAddFolder,
  onDelete,
  onSave,
}: {
  resources: PlacementResource[];
  parentId: number | null;
  depth: number;
  onAddFile: (parentId: number | null) => void;
  onAddFolderUpload: (parentId: number | null) => void;
  onAddFolder: (parentId: number | null) => void;
  onDelete: (id: number) => void;
  onSave: (resource: Omit<PlacementResource, "id"> & { id?: number }) => void;
}) {
  const children = resources.filter(
    (resource) => resource.parentId === parentId,
  );
  function rename(resource: PlacementResource) {
    const title = window.prompt("Rename resource", resource.title);
    if (title?.trim()) {
      onSave({ ...resource, title: title.trim() });
    }
  }

  return (
    <>
      {children.map((resource) => (
        <div key={resource.id} className="space-y-3">
          <div
            className="rounded-lg border border-white/10 bg-panel p-4"
            style={{ marginLeft: `${Math.min(depth * 24, 96)}px` }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                {resource.type === "FOLDER" ? (
                  <Folder className="text-amber" size={18} />
                ) : (
                  <FileText className="text-mint" size={18} />
                )}
                <h3 className="min-w-0 break-words font-semibold text-white">
                  {resource.title}
                </h3>
              </div>
              <div className="flex shrink-0 flex-wrap justify-end gap-2">
                {resource.type === "FOLDER" && (
                  <>
                    <IconButton
                      label="Add file in folder"
                      onClick={() => onAddFile(resource.id)}
                    >
                      <Plus size={17} />
                    </IconButton>
                    <IconButton
                      label="Upload folder inside"
                      onClick={() => onAddFolderUpload(resource.id)}
                    >
                      <Folder size={17} />
                    </IconButton>
                    <IconButton
                      label="New folder inside"
                      onClick={() => onAddFolder(resource.id)}
                    >
                      <Folder size={17} />
                    </IconButton>
                  </>
                )}
                {resource.type === "RESOURCE" && (
                  <IconButton
                    label="Open resource"
                    disabled={!resource.url}
                    onClick={() =>
                      resource.url && window.open(resource.url, "_blank")
                    }
                  >
                    <Link2 size={17} />
                  </IconButton>
                )}
                <IconButton label="Rename" onClick={() => rename(resource)}>
                  <Pencil size={17} />
                </IconButton>
                <IconButton
                  label="Delete"
                  onClick={() => onDelete(resource.id)}
                >
                  <Trash2 size={17} />
                </IconButton>
              </div>
            </div>
          </div>
          {resource.type === "FOLDER" && (
            <ResourceTree
              resources={resources}
              parentId={resource.id}
              depth={depth + 1}
              onAddFile={onAddFile}
              onAddFolderUpload={onAddFolderUpload}
              onAddFolder={onAddFolder}
              onDelete={onDelete}
              onSave={onSave}
            />
          )}
        </div>
      ))}
    </>
  );
}
