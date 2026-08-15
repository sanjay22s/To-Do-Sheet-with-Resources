import type {
  Category,
  ItemType,
  PlacementResource,
  ResourceType,
  RoadmapItem,
  RoadmapResponse,
} from "./types";

export const DUMMY_YOUTUBE_URL = "https://www.youtube.com/";
export const DUMMY_LEETCODE_URL = "https://leetcode.com/problems/";

const dsaTopics = [
  "Arrays",
  "2D Arrays",
  "Two Pointers",
  "Sliding Window",
  "Hashing",
  "Binary Search",
  "Linked List",
  "Recursion / Backtracking",
  "Stack",
  "Queue / Deque",
  "Heap / Priority Queue",
  "Trees",
  "Graphs",
  "Greedy",
  "Dynamic Programming",
];

export const CS_CORE_FOLDERS = ["DBMS", "CN", "OS", "OOPS"];

const arraysProblems = [
  {
    title: "Subarray Sum Equals K",
    difficulty: "Medium",
    leetcodeUrl: "https://leetcode.com/problems/subarray-sum-equals-k/",
  },
  {
    title: "Valid Palindrome",
    difficulty: "Easy",
    leetcodeUrl: "https://leetcode.com/problems/valid-palindrome/",
  },
  {
    title: "Two Sum II - Input Array Is Sorted",
    difficulty: "Medium",
    leetcodeUrl:
      "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/",
  },
  {
    title: "Reverse String",
    difficulty: "Easy",
    leetcodeUrl: "https://leetcode.com/problems/reverse-string/",
  },
  {
    title: "Move Zeroes",
    difficulty: "Easy",
    leetcodeUrl: "https://leetcode.com/problems/move-zeroes/",
  },
  {
    title: "Container With Most Water",
    difficulty: "Medium",
    leetcodeUrl: "https://leetcode.com/problems/container-with-most-water/",
  },
  {
    title: "3Sum",
    difficulty: "Medium",
    leetcodeUrl: "https://leetcode.com/problems/3sum/",
  },
  {
    title: "Trapping Rain Water",
    difficulty: "Hard",
    leetcodeUrl: "https://leetcode.com/problems/trapping-rain-water/",
  },
  {
    title: "Remove Duplicates from Sorted Array",
    difficulty: "Easy",
    leetcodeUrl:
      "https://leetcode.com/problems/remove-duplicates-from-sorted-array/",
  },
  {
    title: "Squares of a Sorted Array",
    difficulty: "Easy",
    leetcodeUrl: "https://leetcode.com/problems/squares-of-a-sorted-array/",
  },
  {
    title: "Is Subsequence",
    difficulty: "Easy",
    leetcodeUrl: "https://leetcode.com/problems/is-subsequence/",
  },
];

const twoDArrayProblems = [
  {
    title: "Search a 2D Matrix",
    difficulty: "Medium",
    leetcodeUrl: "https://leetcode.com/problems/search-a-2d-matrix/",
  },
  {
    title: "Set Matrix Zeroes",
    difficulty: "Medium",
    leetcodeUrl: "https://leetcode.com/problems/set-matrix-zeroes/",
  },
  {
    title: "Spiral Matrix",
    difficulty: "Medium",
    leetcodeUrl: "https://leetcode.com/problems/spiral-matrix/",
  },
  {
    title: "Rotate Image",
    difficulty: "Medium",
    leetcodeUrl: "https://leetcode.com/problems/rotate-image/",
  },
  {
    title: "Search a 2D Matrix II",
    difficulty: "Medium",
    leetcodeUrl: "https://leetcode.com/problems/search-a-2d-matrix-ii/",
  },
  {
    title: "Game of Life",
    difficulty: "Medium",
    leetcodeUrl: "https://leetcode.com/problems/game-of-life/",
  },
  {
    title: "Spiral Matrix II",
    difficulty: "Medium",
    leetcodeUrl: "https://leetcode.com/problems/spiral-matrix-ii/",
  },
  {
    title: "Reshape the Matrix",
    difficulty: "Easy",
    leetcodeUrl: "https://leetcode.com/problems/reshape-the-matrix/",
  },
  {
    title: "Transpose Matrix",
    difficulty: "Easy",
    leetcodeUrl: "https://leetcode.com/problems/transpose-matrix/",
  },
];

const heapProblems = [
  {
    title: "Shortest Subarray with Sum at Least K",
    difficulty: "Hard",
    leetcodeUrl: "https://leetcode.com/problems/shortest-subarray-with-sum-at-least-k/",
  },
  {
    title: "Kth Largest Element in a Stream",
    difficulty: "Easy",
    leetcodeUrl: "https://leetcode.com/problems/kth-largest-element-in-a-stream/",
  },
  {
    title: "Last Stone Weight",
    difficulty: "Easy",
    leetcodeUrl: "https://leetcode.com/problems/last-stone-weight/",
  },
  {
    title: "Kth Largest Element in an Array",
    difficulty: "Medium",
    leetcodeUrl: "https://leetcode.com/problems/kth-largest-element-in-an-array/",
  },
  {
    title: "K Closest Points to Origin",
    difficulty: "Medium",
    leetcodeUrl: "https://leetcode.com/problems/k-closest-points-to-origin/",
  },
  {
    title: "Top K Frequent Words",
    difficulty: "Medium",
    leetcodeUrl: "https://leetcode.com/problems/top-k-frequent-words/",
  },
  {
    title: "Merge k Sorted Lists",
    difficulty: "Hard",
    leetcodeUrl: "https://leetcode.com/problems/merge-k-sorted-lists/",
  },
  {
    title: "Find Median from Data Stream",
    difficulty: "Hard",
    leetcodeUrl: "https://leetcode.com/problems/find-median-from-data-stream/",
  },
  {
    title: "Find K Pairs with Smallest Sums",
    difficulty: "Medium",
    leetcodeUrl: "https://leetcode.com/problems/find-k-pairs-with-smallest-sums/",
  },
  {
    title: "Task Scheduler",
    difficulty: "Medium",
    leetcodeUrl: "https://leetcode.com/problems/task-scheduler/",
  },
];

const treesProblems = [
  {
    title: "Maximum Depth of Binary Tree",
    difficulty: "Easy",
    leetcodeUrl: "https://leetcode.com/problems/maximum-depth-of-binary-tree/",
  },
  {
    title: "Same Tree",
    difficulty: "Easy",
    leetcodeUrl: "https://leetcode.com/problems/same-tree/",
  },
  {
    title: "Invert Binary Tree",
    difficulty: "Easy",
    leetcodeUrl: "https://leetcode.com/problems/invert-binary-tree/",
  },
  {
    title: "Symmetric Tree",
    difficulty: "Easy",
    leetcodeUrl: "https://leetcode.com/problems/symmetric-tree/",
  },
  {
    title: "Diameter of Binary Tree",
    difficulty: "Easy",
    leetcodeUrl: "https://leetcode.com/problems/diameter-of-binary-tree/",
  },
  {
    title: "Binary Tree Level Order Traversal",
    difficulty: "Medium",
    leetcodeUrl: "https://leetcode.com/problems/binary-tree-level-order-traversal/",
  },
  {
    title: "Binary Tree Right Side View",
    difficulty: "Medium",
    leetcodeUrl: "https://leetcode.com/problems/binary-tree-right-side-view/",
  },
  {
    title: "Lowest Common Ancestor of a Binary Tree",
    difficulty: "Medium",
    leetcodeUrl: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/",
  },
  {
    title: "Binary Tree Maximum Path Sum",
    difficulty: "Hard",
    leetcodeUrl: "https://leetcode.com/problems/binary-tree-maximum-path-sum/",
  },
  {
    title: "Kth Smallest Element in a BST",
    difficulty: "Medium",
    leetcodeUrl: "https://leetcode.com/problems/kth-smallest-element-in-a-bst/",
  },
];

const graphsProblems = [
  {
    title: "Number of Islands",
    difficulty: "Medium",
    leetcodeUrl: "https://leetcode.com/problems/number-of-islands/",
  },
  {
    title: "Flood Fill",
    difficulty: "Easy",
    leetcodeUrl: "https://leetcode.com/problems/flood-fill/",
  },
  {
    title: "Max Area of Island",
    difficulty: "Medium",
    leetcodeUrl: "https://leetcode.com/problems/max-area-of-island/",
  },
  {
    title: "Rotting Oranges",
    difficulty: "Medium",
    leetcodeUrl: "https://leetcode.com/problems/rotting-oranges/",
  },
  {
    title: "Course Schedule",
    difficulty: "Medium",
    leetcodeUrl: "https://leetcode.com/problems/course-schedule/",
  },
  {
    title: "Course Schedule II",
    difficulty: "Medium",
    leetcodeUrl: "https://leetcode.com/problems/course-schedule-ii/",
  },
  {
    title: "Clone Graph",
    difficulty: "Medium",
    leetcodeUrl: "https://leetcode.com/problems/clone-graph/",
  },
  {
    title: "Number of Provinces",
    difficulty: "Medium",
    leetcodeUrl: "https://leetcode.com/problems/number-of-provinces/",
  },
  {
    title: "Pacific Atlantic Water Flow",
    difficulty: "Medium",
    leetcodeUrl: "https://leetcode.com/problems/pacific-atlantic-water-flow/",
  },
  {
    title: "Network Delay Time",
    difficulty: "Medium",
    leetcodeUrl: "https://leetcode.com/problems/network-delay-time/",
  },
];

const dsaProblemSeeds: Record<string, typeof arraysProblems> = {
  Arrays: arraysProblems,
  "2D Arrays": twoDArrayProblems,
  "Heap / Priority Queue": heapProblems,
  Trees: treesProblems,
  Graphs: graphsProblems,
};

const sections = [
  ["dashboard", "Dashboard", false],
  ["dsa", "DSA", true],
  ["frontend", "Frontend", true],
  ["backend", "Backend", true],
  ["cs-core", "CS Core", true],
  ["git-github", "Git & GitHub", true],
  ["system-design", "System Design", true],
  ["docker", "Docker", true],
  ["aptitude", "Aptitude", true],
  ["communication", "Communication / Interview", true],
  ["placement-resources", "Resources", false],
] as const;

let itemId = 1;

export function createInitialRoadmap(): RoadmapResponse {
  const categories: Category[] = sections.map(
    ([slug, title, progressTracked], index) => ({
      id: index + 1,
      slug,
      title,
      displayOrder: index + 1,
      progressTracked,
      completedCount: 0,
      totalCount: 0,
      progress: 0,
      items: [],
      topics: {},
    }),
  );

  const dsa = categories.find((category) => category.slug === "dsa")!;
  dsaTopics.forEach((topic) => {
    const seededProblems = dsaProblemSeeds[topic] ?? [];
    const slotCount = Math.max(10, seededProblems.length);
    dsa.topics[topic] = Array.from({ length: slotCount }, (_, index) => ({
      id: itemId++,
      categorySlug: "dsa",
      type: "DSA_PROBLEM",
      title: seededProblems[index]?.title ?? "",
      completed: false,
      topic,
      slotNumber: index + 1,
      difficulty: seededProblems[index]?.difficulty ?? null,
      youtubeUrl: seededProblems[index] ? DUMMY_YOUTUBE_URL : null,
      leetcodeUrl: seededProblems[index]?.leetcodeUrl ?? null,
    }));
  });
  dsa.items = Object.values(dsa.topics).flat();

  const csCore = categories.find((category) => category.slug === "cs-core")!;
  csCore.topics = Object.fromEntries(
    CS_CORE_FOLDERS.map((folder) => [folder, []]),
  );

  return recalculate({
    categories,
    resources: [],
    overall: { completedCount: 0, totalCount: 0, progress: 0 },
  });
}

export function normalizeRoadmap(roadmap: RoadmapResponse): RoadmapResponse {
  return recalculate({
    ...roadmap,
    categories: (roadmap.categories || [])
      .filter((category) => category.slug !== "projects")
      .map((category) => {
        if (category.slug === "dsa") {
          return normalizeDsaCategory(category);
        }
        if (category.slug === "cs-core") {
          return normalizeGeneralCategory(category, CS_CORE_FOLDERS);
        }
        return normalizeGeneralCategory(category);
      }),
    resources: (roadmap.resources || []).map((resource) => ({
      ...resource,
      type: resource.type ?? "RESOURCE",
      parentId: resource.parentId ?? null,
    })),
  });
}

function normalizeGeneralCategory(
  category: Category,
  defaultFolders: string[] = [],
): Category {
  const topics = { ...(category.topics ?? {}) };
  const items = category.items ?? [];

  // Ensure default folders exist
  defaultFolders.forEach((folder) => {
    topics[folder] = topics[folder] ?? [];
  });

  // Ensure all items with a topic are represented in the topics map
  items.forEach((item) => {
    if (item.topic) {
      topics[item.topic] = topics[item.topic] ?? [];
    }
  });

  // Re-populate all topic lists from items to keep them in sync
  Object.keys(topics).forEach((topic) => {
    topics[topic] = items.filter((item) => item.topic === topic);
  });

  return { ...category, items, topics };
}

function normalizeDsaCategory(category: Category): Category {
  const items = category.items ?? [];
  const topics = category.topics ?? {};
  let nextId = Math.max(0, ...items.map((item) => item.id)) + 1;
  let normalizedCategory = { ...category, items, topics };

  Object.entries(dsaProblemSeeds).forEach(([topic, problems]) => {
    const topicItems =
      normalizedCategory.topics[topic] ??
      normalizedCategory.items.filter((item) => item.topic === topic);
    const needsSeed =
      topicItems.length < problems.length ||
      topicItems.every((item) => !item.title.trim());

    if (!needsSeed) {
      return;
    }

    const seededItems = problems.map((problem, index) => ({
      id: topicItems[index]?.id ?? nextId++,
      categorySlug: "dsa",
      type: "DSA_PROBLEM" as const,
      title: problem.title,
      completed: topicItems[index]?.completed ?? false,
      topic,
      slotNumber: index + 1,
      difficulty: problem.difficulty,
      youtubeUrl: topicItems[index]?.youtubeUrl ?? DUMMY_YOUTUBE_URL,
      leetcodeUrl: problem.leetcodeUrl,
    }));
    const emptySlots = topicItems
      .slice(problems.length)
      .map((item, index) => ({
        ...item,
        slotNumber: problems.length + index + 1,
      }));
    const normalizedTopicItems = [...seededItems, ...emptySlots];

    normalizedCategory = {
      ...normalizedCategory,
      items: [
        ...normalizedCategory.items.filter((item) => item.topic !== topic),
        ...normalizedTopicItems,
      ].sort(
        (first, second) =>
          (first.topic ?? "").localeCompare(second.topic ?? "") ||
          (first.slotNumber ?? 0) - (second.slotNumber ?? 0),
      ),
      topics: {
        ...normalizedCategory.topics,
        [topic]: normalizedTopicItems,
      },
    };
  });

  return normalizedCategory;
}

export function recalculate(roadmap: RoadmapResponse): RoadmapResponse {
  const categories = (roadmap.categories || []).map((category) => {
    const items = category.items || [];
    const completedCount = items.filter((item) => item.completed).length;
    const totalCount = items.length;
    return {
      ...category,
      items,
      completedCount,
      totalCount,
      progress:
        totalCount === 0 ? 0 : Math.round((completedCount * 100) / totalCount),
    };
  });

  const tracked = categories.filter((category) => category.progressTracked);
  const completedCount = tracked.reduce(
    (sum, category) => sum + category.completedCount,
    0,
  );
  const totalCount = tracked.reduce(
    (sum, category) => sum + category.totalCount,
    0,
  );

  return {
    ...roadmap,
    categories,
    overall: {
      completedCount,
      totalCount,
      progress:
        totalCount === 0 ? 0 : Math.round((completedCount * 100) / totalCount),
    },
  };
}

export function updateItemInRoadmap(
  roadmap: RoadmapResponse,
  itemIdToUpdate: number,
  patch: Partial<RoadmapItem>,
): RoadmapResponse {
  const categories = roadmap.categories.map((category) => {
    const items = category.items.map((item) =>
      item.id === itemIdToUpdate ? { ...item, ...patch } : item,
    );
    const topics = Object.fromEntries(
      Object.entries(category.topics || {}).map(([topic, topicItems]) => [
        topic,
        topicItems.map((item) =>
          item.id === itemIdToUpdate ? { ...item, ...patch } : item,
        ),
      ]),
    );

    return { ...category, items, topics };
  });

  return recalculate({ ...roadmap, categories });
}

export function addItemToCategory(
  roadmap: RoadmapResponse,
  categorySlug: string,
  title: string,
): RoadmapResponse {
  const categoriesList = roadmap.categories || [];
  const categories = categoriesList.map((category) => {
    if (category.slug !== categorySlug) {
      return category;
    }
    const type: ItemType =
      category.slug === "projects" ? "PROJECT" : "LEARNING";
    const nextId = nextItemId(roadmap);
    const item: RoadmapItem = {
      id: nextId,
      categorySlug,
      type,
      title: title.trim(),
      completed: false,
      topic: null,
      slotNumber: null,
      difficulty: null,
      youtubeUrl: DUMMY_YOUTUBE_URL,
      leetcodeUrl: null,
    };
    return { ...category, items: [...(category.items || []), item] };
  });

  return recalculate({ ...roadmap, categories });
}

export function addSectionToRoadmap(
  roadmap: RoadmapResponse,
  title: string,
): RoadmapResponse {
  const trimmedTitle = title.trim();
  if (!trimmedTitle) {
    return roadmap;
  }

  const categoriesList = roadmap.categories || [];
  const baseSlug = slugify(trimmedTitle);
  const existingSlugs = new Set(
    categoriesList.map((category) => category.slug),
  );
  let slug = baseSlug;
  let suffix = 2;
  while (existingSlugs.has(slug)) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  const placementResources = categoriesList.find(
    (category) => category.slug === "placement-resources",
  );
  const displayOrder =
    placementResources?.displayOrder ?? categoriesList.length + 1;
  const category: Category = {
    id: nextCategoryId(roadmap),
    slug,
    title: trimmedTitle,
    displayOrder,
    progressTracked: true,
    completedCount: 0,
    totalCount: 0,
    progress: 0,
    items: [],
    topics: {},
  };

  const categories = [
    ...categoriesList
      .filter((item) => item.slug !== "placement-resources")
      .map((item) =>
        item.displayOrder >= displayOrder
          ? { ...item, displayOrder: item.displayOrder + 1 }
          : item,
      ),
    category,
    ...(placementResources
      ? [{ ...placementResources, displayOrder: displayOrder + 1 }]
      : []),
  ].sort((first, second) => first.displayOrder - second.displayOrder);

  return recalculate({ ...roadmap, categories });
}

function slugify(value: string) {
  return (
    value
      .toLowerCase()
      .trim()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "section"
  );
}

export function addFolderToCategory(
  roadmap: RoadmapResponse,
  categorySlug: string,
  folderName: string,
): RoadmapResponse {
  const trimmedName = folderName.trim();
  if (!trimmedName) {
    return roadmap;
  }

  const categories = roadmap.categories.map((category) => {
    if (category.slug !== categorySlug) {
      return category;
    }
    const topics = category.topics ?? {};
    if (topics[trimmedName] !== undefined) {
      // folder already exists — skip
      return category;
    }
    return {
      ...category,
      topics: {
        ...topics,
        [trimmedName]: [],
      },
    };
  });

  return recalculate({ ...roadmap, categories });
}

export function addLearningItemToFolder(
  roadmap: RoadmapResponse,
  categorySlug: string,
  folder: string,
  title: string,
): RoadmapResponse {
  const nextId = nextItemId(roadmap);
  const categories = roadmap.categories.map((category) => {
    if (category.slug !== categorySlug) {
      return category;
    }

    const item: RoadmapItem = {
      id: nextId,
      categorySlug,
      type: category.slug === "projects" ? "PROJECT" : "LEARNING",
      title: title.trim(),
      completed: false,
      topic: folder,
      slotNumber: null,
      difficulty: null,
      youtubeUrl: DUMMY_YOUTUBE_URL,
      leetcodeUrl: null,
    };
    const topics = category.topics ?? {};
    const folderItems =
      topics[folder] ??
      category.items.filter((existingItem) => existingItem.topic === folder);

    return {
      ...category,
      items: [...category.items, item],
      topics: {
        ...topics,
        [folder]: [...folderItems, item],
      },
    };
  });

  return recalculate({ ...roadmap, categories });
}

export function addDsaProblemToTopic(
  roadmap: RoadmapResponse,
  topic: string,
): RoadmapResponse {
  const nextId = nextItemId(roadmap);
  const categories = roadmap.categories.map((category) => {
    if (category.slug !== "dsa") {
      return category;
    }

    const topics = category.topics ?? {};
    const topicItems =
      topics[topic] ?? category.items.filter((item) => item.topic === topic);
    const nextSlotNumber =
      topicItems.length === 0
        ? 1
        : Math.max(...topicItems.map((item) => item.slotNumber ?? 0)) + 1;
    const item: RoadmapItem = {
      id: nextId,
      categorySlug: "dsa",
      type: "DSA_PROBLEM",
      title: "",
      completed: false,
      topic,
      slotNumber: nextSlotNumber,
      difficulty: null,
      youtubeUrl: null,
      leetcodeUrl: null,
    };

    return {
      ...category,
      items: [...category.items, item],
      topics: {
        ...topics,
        [topic]: [...topicItems, item],
      },
    };
  });

  return recalculate({ ...roadmap, categories });
}

export function deleteItemFromRoadmap(
  roadmap: RoadmapResponse,
  itemIdToDelete: number,
): RoadmapResponse {
  const categories = roadmap.categories.map((category) => {
    const items = category.items.filter((item) => item.id !== itemIdToDelete);
    // For DSA, also renumber slots; for all others with topics, just filter.
    const topics =
      category.slug === "dsa"
        ? Object.fromEntries(
            Object.entries(category.topics || {}).map(([topic, topicItems]) => [
              topic,
              topicItems
                .filter((item) => item.id !== itemIdToDelete)
                .map((item, index) => ({ ...item, slotNumber: index + 1 })),
            ]),
          )
        : Object.fromEntries(
            Object.entries(category.topics || {}).map(([topic, topicItems]) => [
              topic,
              topicItems.filter((item) => item.id !== itemIdToDelete),
            ]),
          );

    return { ...category, items, topics };
  });

  return recalculate({ ...roadmap, categories });
}

export function deleteSectionFromRoadmap(
  roadmap: RoadmapResponse,
  slugToDelete: string,
): RoadmapResponse {
  if (
    slugToDelete === "dsa" ||
    slugToDelete === "placement-resources" ||
    slugToDelete === "dashboard"
  ) {
    return roadmap;
  }
  const categories = (roadmap.categories || []).filter(
    (category) => category.slug !== slugToDelete,
  );
  return recalculate({ ...roadmap, categories });
}

export function deleteFolderFromCategory(
  roadmap: RoadmapResponse,
  categorySlug: string,
  folderName: string,
): RoadmapResponse {
  const categories = (roadmap.categories || []).map((category) => {
    if (category.slug !== categorySlug) return category;
    const topics = { ...(category.topics ?? {}) };
    delete topics[folderName];
    const items = (category.items ?? []).filter(
      (item) => item.topic !== folderName,
    );
    return { ...category, items, topics };
  });
  return recalculate({ ...roadmap, categories });
}

function nextItemId(roadmap: RoadmapResponse) {
  const ids = (roadmap.categories || []).flatMap((category) =>
    (category.items || []).map((item) => item.id),
  );
  return ids.length === 0 ? 1 : Math.max(...ids) + 1;
}

function nextCategoryId(roadmap: RoadmapResponse) {
  const ids = (roadmap.categories || []).map((category) => category.id);
  return ids.length === 0 ? 1 : Math.max(...ids) + 1;
}

export function upsertResource(
  resources: PlacementResource[],
  resource: Omit<PlacementResource, "id"> & { id?: number },
): PlacementResource[] {
  if (resource.id) {
    return resources.map((item) =>
      item.id === resource.id ? { ...item, ...resource } : item,
    );
  }
  const nextId =
    resources.length === 0
      ? 1
      : Math.max(...resources.map((item) => item.id)) + 1;
  return [
    ...resources,
    {
      id: nextId,
      title: resource.title,
      url: resource.url ?? null,
      type: resource.type,
      parentId: resource.parentId ?? null,
    },
  ];
}

export function deleteResourceTree(
  resources: PlacementResource[],
  id: number,
): PlacementResource[] {
  const idsToDelete = new Set<number>([id]);
  let changed = true;

  while (changed) {
    changed = false;
    resources.forEach((resource) => {
      if (
        resource.parentId !== null &&
        idsToDelete.has(resource.parentId) &&
        !idsToDelete.has(resource.id)
      ) {
        idsToDelete.add(resource.id);
        changed = true;
      }
    });
  }

  return resources.filter((resource) => !idsToDelete.has(resource.id));
}
