const THRESHOLDS = {
  standard: 50700,
  reduced: 45934.2,
};

const lowThresholdReasons = {
  shortage: "短缺职业",
  it: "IT 专家或 IT 管理岗位",
  recentGraduate: "毕业三年内的新入职者",
  itExperience: "无学历 IT 专家路径",
};

const baseDocuments = [
  {
    group: "身份与表格",
    items: [
      "有效护照及个人信息页复印件",
      "签证或居留许可申请表",
      "近期生物识别证件照",
      "申请费支付准备",
    ],
  },
  {
    group: "工作与薪资",
    items: [
      "德国雇主签署的劳动合同或有约束力的 job offer",
      "职位说明：职责、工作地点、合同期限、周工时",
      "税前年薪证明，确保金额达到对应门槛",
      "雇主填写的 Declaration of Employment / Erklärung zum Beschäftigungsverhältnis",
    ],
  },
  {
    group: "岗位匹配证明",
    items: [
      "岗位职责说明，证明工作需要大学或合格职业培训层级的专业技能",
      "用 3-5 条要点说明你的学历、同等资格或 IT 经验如何对应岗位职责",
      "简历，突出与德国岗位相关的学历、项目、技术栈、管理经验或执业经历",
    ],
  },
  {
    group: "学历与资格",
    items: [
      "大学毕业证、学位证及翻译件，或同等高等资格证明",
      "Anabin 学校 H+ 与专业可比性截图，或 ZAB 认证",
      "如为同等高等资格：证明课程至少 3 年且达到 ISCED/EQF 6 级的材料",
    ],
  },
  {
    group: "入境与生活",
    items: [
      "德国有效医疗保险证明",
      "德国住址或临时住宿证明",
      "如在德国境内申请：当前签证、居留卡或入境章记录",
    ],
  },
];

const conditionalDocuments = {
  lowThreshold: {
    group: "低薪资门槛补充",
    items: [
      "说明适用低门槛的证据：短缺职业、IT 岗位、新入职者或无学历 IT 经验路径",
      "准备联邦就业局 BA 可能审核所需的岗位与薪资材料",
    ],
  },
  recentGraduate: {
    group: "毕业三年内",
    items: [
      "最高学历或同等资格取得日期证明",
      "能说明当前岗位为入职早期职业阶段的材料",
      "BA 可能审核所需的岗位与薪资材料",
    ],
  },
  itExperience: {
    group: "无学历 IT 路径",
    items: [
      "过去 7 年内至少 3 年 IT 工作经验证明",
      "证明经验达到大学水平并且岗位需要该经验的项目、推荐信或职责说明",
      "能说明你是 IT 专家或 IT 管理者的技术栈、系统、项目或管理职责材料",
    ],
  },
  regulated: {
    group: "受监管职业",
    items: ["德国执业许可，或许可即将获批的正式证明"],
  },
  shortage: {
    group: "短缺职业",
    items: [
      "把岗位归入具体短缺职业类别的说明",
      "雇主职位说明，突出短缺职业类别对应的专业职责",
    ],
  },
  outside: {
    group: "境外签证申请",
    items: ["德国驻当地使领馆预约确认", "使领馆辖区要求的额外清单"],
  },
};

const form = document.querySelector("#blueCardForm");
const resultTitle = document.querySelector("#resultTitle");
const resultSummary = document.querySelector("#resultSummary");
const thresholdText = document.querySelector("#thresholdText");
const gapText = document.querySelector("#gapText");
const issuesList = document.querySelector("#issuesList");
const nextStepsList = document.querySelector("#nextStepsList");
const scoreCard = document.querySelector("#scoreCard");
const meterBar = document.querySelector("#meterBar");
const documentList = document.querySelector("#documentList");
const printBtn = document.querySelector("#printBtn");
const resetBtn = document.querySelector("#resetBtn");
const copyChecklistBtn = document.querySelector("#copyChecklistBtn");
const clearChecksBtn = document.querySelector("#clearChecksBtn");

const money = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 2,
});

const getData = () => Object.fromEntries(new FormData(form).entries());

function determineThreshold(data) {
  const lowByOccupation = data.occupation === "shortage" || data.occupation === "it";
  const lowByPath = data.path === "recentGraduate" || data.path === "itExperience";
  const lowThreshold = lowByOccupation || lowByPath;
  const reasons = [];

  if (data.occupation === "shortage") reasons.push(lowThresholdReasons.shortage);
  if (data.occupation === "it") reasons.push(lowThresholdReasons.it);
  if (data.path === "recentGraduate") reasons.push(lowThresholdReasons.recentGraduate);
  if (data.path === "itExperience") reasons.push(lowThresholdReasons.itExperience);

  return {
    amount: lowThreshold ? THRESHOLDS.reduced : THRESHOLDS.standard,
    type: lowThreshold ? "reduced" : "standard",
    reasons,
  };
}

function hasEducationPath(data) {
  return ["degree", "equivalentQualification", "recentGraduate"].includes(data.path);
}

function evaluate(data) {
  const salary = Number(data.salary || 0);
  const threshold = determineThreshold(data);
  const issues = [];
  const nextSteps = [];
  let score = 100;

  if (data.citizenship === "eu") {
    return {
      status: "warn",
      score: 65,
      title: "你通常不需要申请德国蓝卡",
      summary: "欧盟、欧洲经济区或瑞士公民一般可自由迁徙和工作，蓝卡主要面向第三国公民。",
      threshold,
      salary,
      issues: ["请确认你是否确实需要居留许可，而不是直接办理工作、登记和社保手续。"],
      nextSteps: ["向德国当地居民登记机关和雇主 HR 确认入职手续。"],
    };
  }

  if (data.jobOffer !== "yes") {
    score -= data.jobOffer === "soon" ? 18 : 38;
    issues.push(data.jobOffer === "soon" ? "还缺少已签署合同或有约束力 offer。" : "德国蓝卡需要具体德国工作机会。");
  }

  if (data.contractMonths !== "6") {
    score -= data.contractMonths === "0" ? 14 : 30;
    issues.push("工作合同通常需要至少 6 个月。");
  }

  if (!salary) {
    score -= 28;
    issues.push("请填写税前年薪，薪资是蓝卡判断的核心条件。");
  } else if (salary < threshold.amount) {
    score -= 38;
    issues.push(`当前薪资低于适用门槛 ${money.format(threshold.amount)}。`);
  } else if (salary < THRESHOLDS.standard && threshold.type === "reduced") {
    issues.push("你使用的是低薪资门槛，短缺职业、新入职者或部分 IT 情形通常需要 BA 同意或审核。");
    nextSteps.push("让雇主准备岗位说明和雇佣条件材料，便于 BA 审核。");
    score -= 6;
  }

  if (hasEducationPath(data)) {
    if (data.degreeStatus === "checking") {
      score -= 12;
      issues.push("学历或同等高等资格认可状态还未确认。");
    }
    if (data.degreeStatus === "notRecognized" || data.degreeStatus === "noDegree") {
      score -= 32;
      issues.push("学历或同等高等资格路径需要能证明资格被德国认可或可比。");
    }
  }

  if (data.path === "equivalentQualification") {
    nextSteps.push("同等高等资格路径要证明资格至少 3 年且达到 ISCED/EQF 6 级。");
  }

  if (data.path === "recentGraduate") {
    if (data.graduationAge !== "within3") {
      score -= data.graduationAge === "unknown" ? 12 : 30;
      issues.push("新入职者低门槛路径要求最高学历或同等资格取得时间不超过 3 年。");
    }
    nextSteps.push("新入职者路径可适用于所有职业类别，但通常需要 BA 同意。");
  }

  if (data.path === "degree" && data.graduationAge === "within3" && salary >= THRESHOLDS.reduced && salary < THRESHOLDS.standard) {
    nextSteps.push("你毕业未满 3 年，若年薪低于普通门槛，可评估新入职者低门槛路径。");
  }

  if (data.path === "itExperience") {
    if (data.occupation !== "it") {
      score -= 18;
      issues.push("无学历 IT 路径要求德国岗位是 IT 专家或 IT 管理岗位。");
    }
    if (data.itYears !== "3plus") {
      score -= data.itYears === "unknown" ? 16 : 34;
      issues.push("无学历 IT 蓝卡路径要求过去 7 年内至少 3 年 IT 工作经验。");
    }
    nextSteps.push("IT 经验材料要说明经验达到大学水平，并且是德国岗位要求的一部分。");
  }

  if (data.qualifiedJob === "unknown") {
    score -= 12;
    issues.push("需要确认这份工作是否属于合格工作：职责是否通常需要大学或合格职业培训层级的专业技能。");
  }
  if (data.qualifiedJob === "no" || data.occupation === "notQualified") {
    score -= 36;
    issues.push("蓝卡要求合格工作；低技能、简单服务、纯辅助或体力岗位通常不适合蓝卡。");
  }

  if (data.occupation === "shortage") {
    if (data.shortageGroup === "none" || data.shortageGroup === "unknown") {
      score -= 10;
      issues.push("如果按短缺职业使用低门槛，需要能把岗位归入具体短缺职业类别。");
    }
    nextSteps.push("短缺职业低门槛通常需要 BA 同意，岗位类别和职责说明要写清楚。");
  }

  if (data.occupation === "regulated" || data.license !== "notNeeded") {
    if (data.license === "missing") {
      score -= 30;
      issues.push("受监管职业需要执业许可已取得或至少可预期取得。");
    }
    if (data.license === "unknown") {
      score -= 14;
      issues.push("请先确认该岗位是否属于受监管职业，以及是否需要德国执业许可。");
    }
    if (data.license === "ready") {
      nextSteps.push("把执业许可或许可承诺放进核心材料包。");
    }
  }

  if (data.jobMatch === "adjacent") {
    score -= 4;
    nextSteps.push("相邻匹配通常可行，但建议让雇主职责说明写出岗位需要你的核心专业能力。");
  }
  if (data.jobMatch === "management") {
    score -= 4;
    nextSteps.push("同领域管理通常可解释，建议突出你管理的团队、流程或项目与原专业的关系。");
  }
  if (data.jobMatch === "weak") {
    score -= 16;
    issues.push("岗位与资格或经验关系较弱，需要用职责说明、项目经历或雇主解释补强。");
  }
  if (data.jobMatch === "none") {
    score -= 34;
    issues.push("岗位必须与学历、同等资格或符合条件的 IT 经验有清楚关系。");
  }

  if (!issues.length) {
    nextSteps.push("整理合同、资格认可、岗位匹配说明、医疗保险和申请表，按申请地点预约提交。");
    nextSteps.push("提交前再次核对当年薪资门槛和德国使领馆或外管局清单。");
  } else {
    nextSteps.push("先补齐上方风险点，再预约签证或居留申请。");
  }

  if (data.location === "outside") {
    nextSteps.push("按德国驻所在地使领馆要求准备辖区特定材料。");
  }

  const normalizedScore = Math.max(0, Math.min(100, score));
  let status = "ok";
  let title = "大概率具备蓝卡申请基础条件";
  let summary = "从你填写的信息看，核心条件基本通过，可以进入材料准备阶段。";

  if (normalizedScore < 60) {
    status = "danger";
    title = "目前不建议按蓝卡提交";
    summary = "存在影响资格的关键问题，建议先补齐工作、薪资、资格证明或岗位匹配证据。";
  } else if (normalizedScore < 82 || issues.length) {
    status = "warn";
    title = "可能具备条件，但仍有待确认项";
    summary = "你接近或满足核心条件，但仍需处理低门槛、岗位匹配、资格认可、执业许可或合同细节。";
  }

  return {
    status,
    score: normalizedScore,
    title,
    summary,
    threshold,
    salary,
    issues,
    nextSteps,
  };
}

function renderList(node, items, fallback) {
  node.innerHTML = "";
  const list = items.length ? items : [fallback];
  list.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    node.appendChild(li);
  });
}

function renderResult(result) {
  scoreCard.className = `score-card ${result.status}`;
  resultTitle.textContent = result.title;
  resultSummary.textContent = result.summary;
  thresholdText.textContent = `${money.format(result.threshold.amount)} / 年`;

  if (!result.salary) {
    gapText.textContent = "待填写";
  } else {
    const gap = result.salary - result.threshold.amount;
    gapText.textContent = gap >= 0 ? `高出 ${money.format(gap)}` : `还差 ${money.format(Math.abs(gap))}`;
  }

  meterBar.style.width = `${result.score}%`;
  renderList(issuesList, result.issues, "暂未发现明显阻碍。");
  renderList(nextStepsList, result.nextSteps, "填写信息后显示下一步。");
}

function buildDocuments(data) {
  const groups = structuredClone(baseDocuments);
  const threshold = determineThreshold(data);

  if (threshold.type === "reduced") groups.push(conditionalDocuments.lowThreshold);
  if (data.path === "recentGraduate") groups.push(conditionalDocuments.recentGraduate);
  if (data.path === "itExperience") groups.push(conditionalDocuments.itExperience);
  if (data.occupation === "shortage") groups.push(conditionalDocuments.shortage);
  if (data.occupation === "regulated" || data.license !== "notNeeded") groups.push(conditionalDocuments.regulated);
  if (data.location === "outside") groups.push(conditionalDocuments.outside);

  return groups;
}

function storageKey(item) {
  return `blue-card-doc:${item}`;
}

function renderDocuments(data = getData()) {
  documentList.innerHTML = "";
  buildDocuments(data).forEach((group) => {
    const article = document.createElement("article");
    article.className = "doc-group";
    const title = document.createElement("h3");
    title.textContent = group.group;
    article.appendChild(title);

    group.items.forEach((item) => {
      const label = document.createElement("label");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = localStorage.getItem(storageKey(item)) === "done";
      checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
          localStorage.setItem(storageKey(item), "done");
        } else {
          localStorage.removeItem(storageKey(item));
        }
      });
      const span = document.createElement("span");
      span.textContent = item;
      label.append(checkbox, span);
      article.appendChild(label);
    });

    documentList.appendChild(article);
  });
}

function updateAll() {
  const data = getData();
  const result = evaluate(data);
  renderResult(result);
  renderDocuments(data);
  localStorage.setItem("blue-card-form", JSON.stringify(data));
}

function restoreForm() {
  const raw = localStorage.getItem("blue-card-form");
  if (!raw) return;
  try {
    const saved = JSON.parse(raw);
    Object.entries(saved).forEach(([name, value]) => {
      const field = form.elements[name];
      if (!field) return;
      if (field instanceof RadioNodeList) {
        const radio = [...field].find((input) => input.value === value);
        if (radio) radio.checked = true;
      } else {
        field.value = value;
      }
    });
  } catch {
    localStorage.removeItem("blue-card-form");
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  updateAll();
});

form.addEventListener("input", updateAll);
form.addEventListener("change", updateAll);

printBtn.addEventListener("click", () => window.print());

resetBtn.addEventListener("click", () => {
  form.reset();
  localStorage.removeItem("blue-card-form");
  updateAll();
});

clearChecksBtn.addEventListener("click", () => {
  [...document.querySelectorAll(".doc-group input[type='checkbox']")].forEach((checkbox) => {
    checkbox.checked = false;
    localStorage.removeItem(storageKey(checkbox.nextElementSibling.textContent));
  });
});

copyChecklistBtn.addEventListener("click", async () => {
  const lines = buildDocuments(getData()).flatMap((group) => [
    group.group,
    ...group.items.map((item) => `- ${item}`),
    "",
  ]);
  await navigator.clipboard.writeText(lines.join("\n"));
  copyChecklistBtn.textContent = "已复制";
  setTimeout(() => {
    copyChecklistBtn.textContent = "复制清单";
  }, 1400);
});

restoreForm();
updateAll();
