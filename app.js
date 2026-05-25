const SOURCE = {
  munich: "https://stadt.muenchen.de/service/en-GB/info/servicestelle-fur-zuwanderung-und-einburgerung/10422541/",
  makeIt: "https://www.make-it-in-germany.com/en/visa-residence/types/eu-blue-card",
  anabin: "https://anabin.kmk.org/",
  zab: "https://www.kmk.org/zab/central-office-for-foreign-education/certificate-assessment.html",
};

const LOW_THRESHOLD = 45934.2;
const STANDARD_THRESHOLD = 50700;

const defaults = {
  citizenship: "yes",
  munichResidence: "yes",
  currentPermitValid: "unknown",
  passportValid: "unknown",
  contract: "yes",
  annualSalary: "46800",
  workingHours: "40",
  diplomaDate: "2023-06",
  submitBeforeJune: "yes",
  degreeComparable: "yes",
  jobQualified: "likely",
  jobMatch: "yes",
  hrSupport: "yes",
  healthInsurance: "yes",
  permitSection: "unknown",
  exactDocuments: "unknown",
};

const questions = [
  {
    id: "citizenship",
    title: "她是否为非欧盟/非欧洲经济区/非瑞士公民？",
    help: "蓝卡面向第三国公民；欧盟/欧洲经济区/瑞士公民通常不需要蓝卡。",
    source: SOURCE.munich,
    options: [
      ["yes", "是，属于第三国公民"],
      ["no", "不是"],
      ["unknown", "不确定"],
    ],
  },
  {
    id: "munichResidence",
    title: "她是否在慕尼黑登记居住或由慕尼黑外管局负责？",
    help: "本页面按慕尼黑外管局材料要求设计；若不归慕尼黑管辖，需要改按对应城市。",
    source: SOURCE.munich,
    options: [
      ["yes", "是"],
      ["no", "不是"],
      ["unknown", "不确定"],
    ],
  },
  {
    id: "currentPermitValid",
    title: "当前工作居留是否仍有效，且能在到期前提交蓝卡申请？",
    help: "慕尼黑要求在签证/居留到期前申请。请确认居留卡和 Zusatzblatt。",
    source: SOURCE.munich,
    options: [
      ["yes", "是，仍有效"],
      ["no", "否，可能已过期或很快过期"],
      ["unknown", "不确定"],
    ],
  },
  {
    id: "passportValid",
    title: "护照是否有效期充足？",
    help: "慕尼黑材料清单要求有效护照或替代证件；护照太短会影响居留卡时长。",
    source: SOURCE.munich,
    options: [
      ["yes", "是，至少还有 12 个月"],
      ["short", "有效但少于 12 个月"],
      ["no", "无有效护照"],
      ["unknown", "不确定"],
    ],
  },
  {
    id: "contract",
    title: "是否已有巴伐利亚国立歌剧院的合同，且雇佣至少 6 个月？",
    help: "已知信息是无固定期限合同；慕尼黑要求 job offer 至少 6 个月。",
    source: SOURCE.munich,
    options: [
      ["yes", "是，无固定期限/至少 6 个月"],
      ["no", "不是"],
      ["unknown", "不确定"],
    ],
  },
  {
    id: "annualSalary",
    title: "合同税前年薪是多少？",
    help: "已知为 €3,900 × 12 = €46,800。低门槛为 €45,934.20，普通门槛为 €50,700。",
    source: SOURCE.munich,
    type: "number",
    suffix: "EUR / 年",
  },
  {
    id: "workingHours",
    title: "每周工作时间是多少？",
    help: "已知为 40 小时。慕尼黑说明薪资门槛不按兼职比例折算。",
    source: SOURCE.munich,
    type: "number",
    suffix: "小时 / 周",
  },
  {
    id: "diplomaDate",
    title: "Diplom 的正式取得日期是什么？",
    help: "请填毕业证上的精确日期。她需要在取得学历 3 年内提交，最安全是赶在 2026 年 6 月中对应日期前。",
    source: SOURCE.munich,
    type: "month",
  },
  {
    id: "submitBeforeJune",
    title: "能否在 2026 年 6 月内、最好在毕业证满三年前提交？",
    help: "她只满足低门槛；毕业三年内是当前最强低门槛理由。",
    source: SOURCE.munich,
    options: [
      ["yes", "能，计划立即提交"],
      ["risk", "可能能，但未预约/未准备好"],
      ["no", "不能"],
      ["unknown", "不确定"],
    ],
  },
  {
    id: "degreeComparable",
    title: "莫扎特大学和 Diplom 专业是否已有 Anabin/ZAB 认可或可比证明？",
    help: "已知你们说学校和专业已确认认可/可比。请让她准备截图或证明文件。",
    source: SOURCE.munich,
    options: [
      ["yes", "是，已确认并能提供证明"],
      ["partial", "学校 H+，专业或学位还没整理好"],
      ["no", "没有证明"],
      ["unknown", "不确定"],
    ],
  },
  {
    id: "jobQualified",
    title: "岗位职责是否能证明它是专业舞台设计工作，而不是普通助理/行政/低技能工作？",
    help: "关键职责应包括舞台空间设计文件、布景/道具设计执行、与导演/舞美/工坊/技术部门协作、排练和技术排。",
    source: SOURCE.munich,
    options: [
      ["likely", "能，岗位说明可以写清楚专业职责"],
      ["weak", "有专业内容，但合同/说明目前写得弱"],
      ["no", "不能，主要是行政或低技能辅助"],
      ["unknown", "不确定"],
    ],
  },
  {
    id: "jobMatch",
    title: "岗位是否与 Diplom“舞台和戏剧空间设计”直接匹配？",
    help: "慕尼黑要求工作必须适合她的资格。这里要证明岗位确实使用舞台设计/戏剧空间设计能力。",
    source: SOURCE.munich,
    options: [
      ["yes", "是，直接匹配"],
      ["explain", "大致匹配，但需要解释"],
      ["no", "不匹配"],
      ["unknown", "不确定"],
    ],
  },
  {
    id: "hrSupport",
    title: "HR 是否愿意配合出具岗位说明、填写雇佣表格？",
    help: "慕尼黑要求 employment contract、insurance for the exercise of employment、Declaration of employment 等雇主材料。",
    source: SOURCE.munich,
    options: [
      ["yes", "愿意"],
      ["slow", "愿意但流程慢"],
      ["no", "不愿意"],
      ["unknown", "不确定"],
    ],
  },
  {
    id: "healthInsurance",
    title: "是否已有德国法定医保？",
    help: "已知为德国法定医保。慕尼黑可能会核查生活保障和常规居留材料。",
    source: SOURCE.munich,
    options: [
      ["yes", "有德国法定医保"],
      ["private", "有德国私人医保"],
      ["no", "没有"],
      ["unknown", "不确定"],
    ],
  },
  {
    id: "permitSection",
    title: "当前居留卡/Zusatzblatt 上的条文和限制是否已确认？",
    help: "请拍下居留卡和 Zusatzblatt。若仍在蓝卡前 12 个月换工作，慕尼黑页面也说明需通知外管局。",
    source: SOURCE.munich,
    options: [
      ["yes", "已确认，无明显障碍"],
      ["restricted", "有雇主/岗位限制，需要核对"],
      ["unknown", "还没看"],
    ],
  },
  {
    id: "exactDocuments",
    title: "所有文件是否能以 PDF/扫描件形式提交？",
    help: "慕尼黑允许在线或邮寄提交；线上提交后可下载确认 PDF。",
    source: SOURCE.munich,
    options: [
      ["yes", "可以"],
      ["partial", "部分还没有"],
      ["no", "暂时不行"],
      ["unknown", "不确定"],
    ],
  },
];

const documentGroups = [
  {
    group: "身份与当前居留",
    items: [
      ["有效护照或护照替代证件", SOURCE.munich],
      ["当前居留卡正反面和 Zusatzblatt", SOURCE.munich],
      ["如适用：入境签证和入境章", SOURCE.munich],
      ["慕尼黑住址登记证明或当前住址材料", SOURCE.munich],
    ],
  },
  {
    group: "慕尼黑申请表与照片",
    items: [
      ["完整填写的居留许可申请表", SOURCE.munich],
      ["当前生物识别证件照，按慕尼黑要求由认证照相馆/药妆店数字提交或现场终端拍摄", SOURCE.munich],
      ["在线提交后的确认 PDF", SOURCE.munich],
    ],
  },
  {
    group: "雇主与薪资",
    items: [
      ["巴伐利亚国立歌剧院劳动合同：无固定期限、40 小时、年税前 €46,800", SOURCE.munich],
      ["HR 填写的 Declaration of employment / Erklärung zum Beschäftigungsverhältnis", SOURCE.munich],
      ["insurance for the exercise of employment，并与合同一起上传", SOURCE.munich],
      ["如被视作延长/换发：前两个月和最近两个月工资证明", SOURCE.munich],
    ],
  },
  {
    group: "岗位专业性证明",
    items: [
      ["详细岗位说明：说明该岗位需要舞台设计/戏剧空间设计高等专业能力", SOURCE.munich],
      ["职责清单：舞台空间设计文件、布景/道具设计执行、排练/技术排、舞台转换方案", SOURCE.munich],
      ["HR 说明：职位虽为 Bühnenbildassistenz / Assistant Stage Designer，但不是普通行政助理", SOURCE.munich],
    ],
  },
  {
    group: "学历与毕业三年内",
    items: [
      ["莫扎特大学 Diplom 毕业证：舞台和戏剧空间设计", SOURCE.munich],
      ["毕业证上的精确日期，证明申请时仍在取得学历 3 年内", SOURCE.munich],
      ["Anabin 学校 H+ 和学位/专业可比性截图，或 ZAB 证明", SOURCE.munich],
      ["如证书非德文或英文：认证德文或英文翻译", SOURCE.munich],
    ],
  },
  {
    group: "补强材料",
    items: [
      ["个人简历，突出 2023 年后 Bamberg 剧院和巴伐利亚国立歌剧院舞台设计经历", SOURCE.munich],
      ["德国法定医保确认", SOURCE.munich],
      ["如外管局要求：进一步个案补充文件", SOURCE.munich],
    ],
  },
];

const form = document.querySelector("#caseForm");
const questionsNode = document.querySelector("#questions");
const verdictCard = document.querySelector("#verdictCard");
const verdictTitle = document.querySelector("#verdictTitle");
const verdictText = document.querySelector("#verdictText");
const meterBar = document.querySelector("#meterBar");
const findingsList = document.querySelector("#findingsList");
const actionsList = document.querySelector("#actionsList");
const documentList = document.querySelector("#documentList");
const printBtn = document.querySelector("#printBtn");
const saveBtn = document.querySelector("#saveBtn");
const resetBtn = document.querySelector("#resetBtn");
const copyChecklistBtn = document.querySelector("#copyChecklistBtn");
const clearChecksBtn = document.querySelector("#clearChecksBtn");

const money = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 2,
});

function storageKey(item) {
  return `stage-blue-card:${item}`;
}

function getSaved() {
  try {
    return { ...defaults, ...JSON.parse(localStorage.getItem("stage-blue-card-case") || "{}") };
  } catch {
    return { ...defaults };
  }
}

function getData() {
  return Object.fromEntries(new FormData(form).entries());
}

function renderQuestions(data) {
  questionsNode.innerHTML = "";
  questions.forEach((question) => {
    const section = document.createElement("section");
    section.className = "question-card";

    const label = document.createElement("label");
    label.textContent = question.title;
    label.setAttribute("for", question.id);

    const help = document.createElement("p");
    help.textContent = question.help;

    let input;
    if (question.type === "number" || question.type === "month") {
      input = document.createElement("input");
      input.type = question.type;
      input.id = question.id;
      input.name = question.id;
      input.value = data[question.id] || "";
      if (question.type === "number") input.min = "0";
    } else {
      input = document.createElement("select");
      input.id = question.id;
      input.name = question.id;
      question.options.forEach(([value, text]) => {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = text;
        input.appendChild(option);
      });
      input.value = data[question.id] || defaults[question.id];
    }

    input.addEventListener("input", update);
    input.addEventListener("change", update);

    const meta = document.createElement("div");
    meta.className = "question-meta";
    const source = document.createElement("a");
    source.href = question.source;
    source.target = "_blank";
    source.rel = "noreferrer";
    source.textContent = "来源";
    meta.appendChild(source);
    if (question.suffix) {
      const suffix = document.createElement("span");
      suffix.textContent = question.suffix;
      meta.appendChild(suffix);
    }

    section.append(label, help, input, meta);
    questionsNode.appendChild(section);
  });
}

function evaluate(data) {
  const findings = [];
  const actions = [];
  let score = 100;
  const salary = Number(data.annualSalary || 0);

  const addIssue = (text, weight = 10) => {
    findings.push(text);
    score -= weight;
  };
  const addAction = (text) => actions.push(text);

  if (data.citizenship === "yes") {
    findings.push("身份符合蓝卡适用对象：第三国公民。");
  } else {
    addIssue("身份不符合或不确定：蓝卡主要面向第三国公民。", 35);
  }

  if (data.munichResidence !== "yes") {
    addIssue("慕尼黑管辖不确定：若不由慕尼黑外管局负责，本页材料要求需调整。", 12);
  }

  if (data.currentPermitValid === "unknown") {
    addIssue("当前居留条款和有效期未确认：需要查看居留卡和 Zusatzblatt。", 10);
    addAction("让她拍摄当前居留卡和 Zusatzblatt，确认条文、有效期、雇主限制。");
  } else if (data.currentPermitValid === "no") {
    addIssue("当前居留可能无效或即将过期：必须优先联系慕尼黑外管局。", 35);
  }

  if (data.passportValid === "unknown") {
    addIssue("护照有效期未确认。", 6);
    addAction("确认护照有效期，太短则先换护照或准备解释。");
  } else if (data.passportValid === "short") {
    addIssue("护照有效期少于 12 个月，可能影响居留卡时长。", 8);
  } else if (data.passportValid === "no") {
    addIssue("没有有效护照，暂不适合提交。", 35);
  }

  if (data.contract === "yes") {
    findings.push("无固定期限合同满足至少 6 个月雇佣要求。");
  } else {
    addIssue("合同期限或 offer 不满足至少 6 个月要求。", 30);
  }

  if (!salary) {
    addIssue("年薪未填写，无法判断薪资门槛。", 30);
  } else if (salary >= STANDARD_THRESHOLD) {
    findings.push(`年薪 ${money.format(salary)} 达到普通蓝卡门槛 ${money.format(STANDARD_THRESHOLD)}。`);
  } else if (salary >= LOW_THRESHOLD) {
    findings.push(`年薪 ${money.format(salary)} 达到 2026 低门槛 ${money.format(LOW_THRESHOLD)}，但未达到普通门槛。`);
    addAction("必须把申请路径写成毕业三年内新入职者低门槛，并准备 BA 审核材料。");
    score -= 5;
  } else {
    addIssue(`年薪 ${money.format(salary)} 低于 2026 低门槛 ${money.format(LOW_THRESHOLD)}。`, 40);
  }

  if (data.submitBeforeJune === "yes") {
    findings.push("计划 2026 年 6 月前提交，符合毕业三年内低门槛策略。");
  } else if (data.submitBeforeJune === "risk" || data.submitBeforeJune === "unknown") {
    addIssue("提交时间存在风险：毕业三年窗口可能到 2026 年 6 月中结束。", 18);
    addAction("尽快在线提交或至少完成预约/联系，保留提交记录。");
  } else {
    addIssue("若 2026 年 6 月后才提交，毕业三年内低门槛可能失效。", 35);
  }

  if (data.degreeComparable === "yes") {
    findings.push("学历认可/可比性已确认，是核心有利条件。");
  } else if (data.degreeComparable === "partial") {
    addIssue("学历证明尚不完整：需要 Anabin 或 ZAB 材料补齐。", 14);
    addAction("整理 Anabin 学校 H+、学位/专业可比截图，或 ZAB 证明。");
  } else {
    addIssue("学历认可/可比性未证明，蓝卡学历路径风险很高。", 32);
  }

  if (data.jobQualified === "likely") {
    findings.push("岗位职责可被包装为专业舞台设计工作，而非普通助理。");
  } else if (data.jobQualified === "weak" || data.jobQualified === "unknown") {
    addIssue("岗位专业性材料不足：职位名含助理，必须补强岗位说明。", 18);
    addAction("让 HR 出具详细岗位说明，明确高等舞台设计专业能力要求。");
  } else {
    addIssue("如果岗位主要是行政/低技能辅助，则不适合蓝卡。", 38);
  }

  if (data.jobMatch === "yes") {
    findings.push("岗位与 Diplom 舞台和戏剧空间设计直接匹配。");
  } else if (data.jobMatch === "explain" || data.jobMatch === "unknown") {
    addIssue("岗位与学历关系需要解释：材料中必须写出对应关系。", 16);
  } else {
    addIssue("岗位与学历不匹配，蓝卡风险很高。", 35);
  }

  if (data.hrSupport === "yes") {
    findings.push("HR 愿意配合，是低门槛和岗位专业性证明的关键利好。");
  } else if (data.hrSupport === "slow" || data.hrSupport === "unknown") {
    addIssue("HR 配合不确定或较慢，可能拖过毕业三年窗口。", 14);
    addAction("立即向 HR 要雇佣表格、岗位说明和薪资确认。");
  } else {
    addIssue("HR 不配合会显著增加申请风险。", 25);
  }

  if (data.healthInsurance === "no" || data.healthInsurance === "unknown") {
    addIssue("医保状态未确认或没有医保，需要补齐。", 8);
  }

  if (data.permitSection === "unknown") {
    addIssue("当前居留条款未知：需要确认是否有雇主绑定或换工作通知义务。", 8);
  } else if (data.permitSection === "restricted") {
    addIssue("当前居留可能有雇主/岗位限制，需要先核对外管局要求。", 14);
  }

  if (data.exactDocuments !== "yes") {
    addIssue("线上提交文件尚未完全准备好。", data.exactDocuments === "partial" ? 6 : 10);
    addAction("把所有材料扫描成清晰 PDF，文件名按材料类型命名。");
  }

  const normalized = Math.max(0, Math.min(100, score));
  let status = "ok";
  let title = "建议尽快提交，基础条件较强";
  let text = "她的条件适合按毕业三年内新入职者低门槛申请，但材料必须强调岗位专业性和学历匹配。";

  if (normalized < 60) {
    status = "danger";
    title = "暂不建议直接提交";
    text = "存在关键不确定或不满足项，需要先补齐再申请。";
  } else if (normalized < 82 || findings.some((item) => item.includes("风险") || item.includes("不足") || item.includes("不确定"))) {
    status = "warn";
    title = "可以推进，但要先补强材料";
    text = "整体方向可行，主要风险在提交时间、岗位专业性、当前居留条款或材料完整度。";
  }

  return { status, score: normalized, title, text, findings, actions: [...new Set(actions)] };
}

function renderList(node, items, fallback) {
  node.innerHTML = "";
  (items.length ? items : [fallback]).forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    node.appendChild(li);
  });
}

function renderDocuments() {
  documentList.innerHTML = "";
  documentGroups.forEach((group) => {
    const article = document.createElement("article");
    article.className = "doc-group";
    const title = document.createElement("h3");
    title.textContent = group.group;
    article.appendChild(title);

    group.items.forEach(([item, source]) => {
      const row = document.createElement("label");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = localStorage.getItem(storageKey(item)) === "done";
      checkbox.addEventListener("change", () => {
        if (checkbox.checked) localStorage.setItem(storageKey(item), "done");
        else localStorage.removeItem(storageKey(item));
      });
      const span = document.createElement("span");
      span.textContent = item;
      const link = document.createElement("a");
      link.href = source;
      link.target = "_blank";
      link.rel = "noreferrer";
      link.textContent = "来源";
      row.append(checkbox, span, link);
      article.appendChild(row);
    });

    documentList.appendChild(article);
  });
}

function update() {
  const data = getData();
  localStorage.setItem("stage-blue-card-case", JSON.stringify(data));
  const result = evaluate(data);
  verdictCard.className = `verdict-card ${result.status}`;
  verdictTitle.textContent = result.title;
  verdictText.textContent = result.text;
  meterBar.style.width = `${result.score}%`;
  renderList(findingsList, result.findings, "暂未生成判断。");
  renderList(actionsList, result.actions, "当前没有新增紧急动作。");
}

function init() {
  renderQuestions(getSaved());
  renderDocuments();
  update();
}

printBtn.addEventListener("click", () => window.print());
saveBtn.addEventListener("click", update);
resetBtn.addEventListener("click", () => {
  localStorage.removeItem("stage-blue-card-case");
  renderQuestions(defaults);
  update();
});
clearChecksBtn.addEventListener("click", () => {
  [...document.querySelectorAll(".doc-group input[type='checkbox']")].forEach((checkbox) => {
    checkbox.checked = false;
    localStorage.removeItem(storageKey(checkbox.nextElementSibling.textContent));
  });
});
copyChecklistBtn.addEventListener("click", async () => {
  const text = documentGroups
    .flatMap((group) => [group.group, ...group.items.map(([item, source]) => `- ${item} (${source})`), ""])
    .join("\n");
  await navigator.clipboard.writeText(text);
  copyChecklistBtn.textContent = "已复制";
  setTimeout(() => {
    copyChecklistBtn.textContent = "复制清单";
  }, 1400);
});

init();
