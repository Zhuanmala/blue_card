const SOURCE = {
  makeIt: "https://www.make-it-in-germany.com/en/visa-residence/living-permanently/settlement-permit",
  munichSkilled: "https://stadt.muenchen.de/service/info/servicestelle-fur-zuwanderung-und-einburgerung/1080792/",
  munichBlue: "https://stadt.muenchen.de/service/info/servicestelle-fur-zuwanderung-und-einburgerung/1080810/",
  munichGeneral: "https://stadt.muenchen.de/service/info/servicestelle-fur-zuwanderung-und-einburgerung/1064106/",
};

const CASE_KEY = "permanent-residence-check-v1";

const defaults = {
  city: "",
  path: "",
  validPermit: "",
  legalYears: "",
  titleMonths: "",
  pensionMonths: "",
  germanLevel: "",
  lidTest: "",
  livelihood: "",
  housing: "",
  passport: "",
  currentJob: "",
  criminalRecord: "",
  germanGraduation: "",
  spouseSettlement: "",
  spouseCohabits: "",
  weeklyHours: "",
  selfEmploymentStable: "",
  excludedTitle: "",
};

const questions = [
  {
    id: "city",
    title: "你是否在慕尼黑登记居住，或计划在慕尼黑外管局申请？",
    help: "慕尼黑申请人需要按慕尼黑页面提交在线/邮寄申请和材料。",
    source: SOURCE.munichSkilled,
    options: [["munich", "是，慕尼黑"], ["other", "不是，其他城市"], ["unknown", "不确定"]],
  },
  {
    id: "path",
    title: "你最接近哪一条长居路径？",
    help: "如果不确定，先选当前居留卡/Zusatzblatt 上最接近的类型。",
    source: SOURCE.makeIt,
    options: [
      ["blueCard", "EU Blue Card / §18g"],
      ["skilled", "技术工人：§18a / §18b / §18d"],
      ["germanGraduate", "德国毕业后，以技术工人身份工作"],
      ["selfEmployed", "自雇：§21"],
      ["spouseSkilled", "技术工人长居持有者的配偶"],
      ["euPermanent", "Daueraufenthalt-EU / 5 年长期居留 EU"],
      ["general", "普通 Niederlassungserlaubnis / 其他路径"],
      ["unknown", "不确定"],
    ],
  },
  {
    id: "validPermit",
    title: "申请时是否持有有效居留许可？",
    help: "申请长居通常需要当前合法居留；自雇路径也要求申请时仍有允许自雇的有效居留。",
    source: SOURCE.makeIt,
    options: [["yes", "是"], ["no", "否"], ["unknown", "不确定"]],
  },
  {
    id: "legalYears",
    title: "你已在德国合法居住多少年？",
    help: "Daueraufenthalt-EU 通常要求至少 5 年合法居住。",
    source: SOURCE.makeIt,
    type: "number",
    suffix: "年",
  },
  {
    id: "titleMonths",
    title: "当前路径下的相关居留/工作时间有多少个月？",
    help: "蓝卡看 21/27 个月；技术工人通常看 36 个月；德国毕业快速路径看 24 个月；自雇看 3 年。",
    source: SOURCE.makeIt,
    type: "number",
    suffix: "个月",
  },
  {
    id: "pensionMonths",
    title: "德国法定养老保险或等效养老保障已缴多少个月？",
    help: "蓝卡通常对应 21/27 个月；技术工人 36 个月，德国毕业快速路径 24 个月；Daueraufenthalt-EU 通常 60 个月。",
    source: SOURCE.makeIt,
    type: "number",
    suffix: "个月",
  },
  {
    id: "germanLevel",
    title: "你的德语证明最高是什么等级？",
    help: "蓝卡 27 个月通常至少 A1；B1 可缩短到 21 个月。技术工人和德国毕业路径通常需要 B1。",
    source: SOURCE.makeIt,
    options: [["none", "没有证明"], ["a1", "A1"], ["a2", "A2"], ["b1", "B1"], ["b2plus", "B2 或以上"], ["unknown", "不确定"]],
  },
  {
    id: "lidTest",
    title: "是否有 Leben in Deutschland 测试或等效证明？",
    help: "通常用来证明德国法律、社会制度和生活方式基础知识。",
    source: SOURCE.makeIt,
    options: [["yes", "有"], ["germanDegree", "德国学校/培训/高校德语毕业，可作为等效"], ["no", "没有"], ["unknown", "不确定"]],
  },
  {
    id: "livelihood",
    title: "是否能独立保障生活来源，不依赖社会救济？",
    help: "长居通常要求生活来源有保障；慕尼黑材料包括工资单、工作关系确认和生活费声明。",
    source: SOURCE.munichSkilled,
    options: [["yes", "是"], ["maybe", "大概可以，但材料不全"], ["no", "不能"], ["unknown", "不确定"]],
  },
  {
    id: "housing",
    title: "是否有足够住房，并能提供租约/住房证明等材料？",
    help: "慕尼黑要求证明足够住房，如租约、房租流水、Wohnraumbescheinigung 等。",
    source: SOURCE.munichSkilled,
    options: [["yes", "有"], ["partial", "有住处但证明不全"], ["no", "没有"], ["unknown", "不确定"]],
  },
  {
    id: "passport",
    title: "是否有有效护照或护照替代证件？",
    help: "慕尼黑材料清单要求有效护照或护照替代证件。",
    source: SOURCE.munichSkilled,
    options: [["yes", "有"], ["short", "有但有效期较短"], ["no", "没有"], ["unknown", "不确定"]],
  },
  {
    id: "currentJob",
    title: "当前是否有居留许可允许从事的工作？",
    help: "技术工人和德国毕业快速路径要求有当前居留允许从事的工作。",
    source: SOURCE.makeIt,
    options: [["yes", "有，且居留允许"], ["restricted", "有工作但许可限制不清楚"], ["no", "没有"], ["unknown", "不确定"]],
  },
  {
    id: "criminalRecord",
    title: "是否有刑事犯罪记录？",
    help: "慕尼黑技术工人长居条件列明不得有前科。",
    source: SOURCE.munichSkilled,
    options: [["no", "没有"], ["yes", "有"], ["unknown", "不确定"]],
  },
  {
    id: "germanGraduation",
    title: "是否在德国成功完成大学或职业培训？",
    help: "德国毕业可触发 2 年/24 个月的快速路径。",
    source: SOURCE.makeIt,
    options: [["yes", "是"], ["no", "不是"], ["unknown", "不确定"]],
  },
  {
    id: "selfEmploymentStable",
    title: "如果走自雇路径：业务是否已持续 3 年且可持续发展？",
    help: "自雇路径通常要求自雇 3 年，业务成功且预计可持续，并能保障生活来源。",
    source: SOURCE.makeIt,
    options: [["na", "不适用"], ["yes", "是"], ["weak", "部分满足"], ["no", "否"], ["unknown", "不确定"]],
  },
  {
    id: "spouseSettlement",
    title: "如果走配偶路径：配偶是否已持有技术工人长居？",
    help: "配偶路径要求配偶持有 §18c 技术工人长居。",
    source: SOURCE.makeIt,
    options: [["na", "不适用"], ["yes", "是"], ["no", "否"], ["unknown", "不确定"]],
  },
  {
    id: "spouseCohabits",
    title: "如果走配偶路径：是否共同生活，且本人每周工作至少 20 小时？",
    help: "配偶路径要求共同生活，并且本人每周至少工作 20 小时且有工作许可。",
    source: SOURCE.makeIt,
    options: [["na", "不适用"], ["yes", "是"], ["no", "否"], ["unknown", "不确定"]],
  },
  {
    id: "excludedTitle",
    title: "如果申请 Daueraufenthalt-EU：当前居留是否为学习或部分人道原因等可能排除的居留？",
    help: "Make it in Germany 提醒某些居留不能获得 Daueraufenthalt-EU，例如教育目的或某些人道原因。",
    source: SOURCE.makeIt,
    options: [["na", "不适用"], ["no", "不是排除类型"], ["yes", "可能是排除类型"], ["unknown", "不确定"]],
  },
];

const docs = [
  {
    group: "通用身份与申请",
    items: [
      ["完整填写的申请表", SOURCE.munichSkilled],
      ["有效护照或护照替代证件", SOURCE.munichSkilled],
      ["当前生物识别证件照", SOURCE.munichSkilled],
      ["当前居留卡和 Zusatzblatt", SOURCE.munichGeneral],
    ],
  },
  {
    group: "生活来源和工作",
    items: [
      ["最近三个月工资单或收入证明", SOURCE.munichSkilled],
      ["工作关系确认 / Bestätigung über das Arbeitsverhältnis", SOURCE.munichSkilled],
      ["生活费声明 / Erklärung zum Lebensunterhalt", SOURCE.munichSkilled],
      ["当前工作合同或雇主证明", SOURCE.makeIt],
    ],
  },
  {
    group: "住房",
    items: [
      ["租房合同，包含住房面积", SOURCE.munichSkilled],
      ["房租支付流水，或 Wohnraumbescheinigung", SOURCE.munichSkilled],
      ["家庭共同居住声明，如有家属共同申请或共同居住", SOURCE.munichSkilled],
    ],
  },
  {
    group: "养老保险",
    items: [
      ["德国养老保险 Wartezeitauskunft", SOURCE.munichSkilled],
      ["等效养老保障证明，或私人养老保险证明", SOURCE.munichSkilled],
    ],
  },
  {
    group: "语言和社会知识",
    items: [
      ["德语证书：蓝卡至少 A1，B1 可缩短等待期；技术工人通常 B1", SOURCE.makeIt],
      ["Leben in Deutschland 测试证书，或德国德语授课学校/培训/高校毕业证明", SOURCE.munichSkilled],
    ],
  },
  {
    group: "路径补充",
    items: [
      ["蓝卡路径：EU Blue Card 和 21/27 个月合格就业证明", SOURCE.munichBlue],
      ["德国毕业快速路径：德国毕业证和 24 个月技术工人工作/养老保险证明", SOURCE.makeIt],
      ["自雇路径：3 年自雇、业务成功和可持续发展的证明", SOURCE.makeIt],
      ["配偶路径：配偶技术工人长居、共同生活、本人每周至少 20 小时工作证明", SOURCE.makeIt],
    ],
  },
];

const form = document.querySelector("#permanentForm");
const questionsNode = document.querySelector("#questions");
const verdictCard = document.querySelector("#verdictCard");
const verdictTitle = document.querySelector("#verdictTitle");
const verdictText = document.querySelector("#verdictText");
const bestPathText = document.querySelector("#bestPathText");
const riskText = document.querySelector("#riskText");
const meterBar = document.querySelector("#meterBar");
const findingsList = document.querySelector("#findingsList");
const actionsList = document.querySelector("#actionsList");
const documentList = document.querySelector("#documentList");
const printBtn = document.querySelector("#printBtn");
const saveBtn = document.querySelector("#saveBtn");
const resetBtn = document.querySelector("#resetBtn");
const copyChecklistBtn = document.querySelector("#copyChecklistBtn");
const clearChecksBtn = document.querySelector("#clearChecksBtn");

function getSaved() {
  try {
    return { ...defaults, ...JSON.parse(localStorage.getItem(CASE_KEY) || "{}") };
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
    if (question.type === "number") {
      input = document.createElement("input");
      input.type = "number";
      input.min = "0";
      input.placeholder = "请填写";
      input.id = question.id;
      input.name = question.id;
      input.value = data[question.id] || "";
    } else {
      input = document.createElement("select");
      input.id = question.id;
      input.name = question.id;
      const placeholder = document.createElement("option");
      placeholder.value = "";
      placeholder.textContent = "请选择";
      input.appendChild(placeholder);
      question.options.forEach(([value, text]) => {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = text;
        input.appendChild(option);
      });
      input.value = data[question.id] || "";
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

function pathLabel(path) {
  return {
    blueCard: "蓝卡长居：21/27 个月路径",
    skilled: "技术工人长居：36 个月路径",
    germanGraduate: "德国毕业后技术工人快速路径：24 个月",
    selfEmployed: "自雇长居：3 年路径",
    spouseSkilled: "技术工人长居持有者配偶路径",
    euPermanent: "Daueraufenthalt-EU：5 年/60 个月路径",
    general: "普通长居/其他路径",
    unknown: "路径不确定",
  }[path] || "待选择";
}

function evaluate(data) {
  const findings = [];
  const actions = [];
  let score = 100;
  let pending = 0;
  const titleMonths = Number(data.titleMonths || 0);
  const pensionMonths = Number(data.pensionMonths || 0);
  const legalYears = Number(data.legalYears || 0);

  const add = (text) => findings.push(text);
  const issue = (text, weight = 12) => {
    findings.push(text);
    score -= weight;
  };
  const wait = (text) => {
    findings.push(text);
    pending += 1;
  };
  const action = (text) => actions.push(text);

  if (!data.path) wait("待确认：当前最接近哪一条长居路径。");
  else add(`已选择路径：${pathLabel(data.path)}。`);

  if (!data.validPermit) wait("待确认：申请时是否有有效居留许可。");
  else if (data.validPermit !== "yes") issue("申请时没有有效居留许可或状态不明，风险很高。", data.validPermit === "unknown" ? 14 : 35);

  if (!data.city) wait("待确认：是否归慕尼黑外管局管辖。");
  else if (data.city === "other") action("请按所在地外管局材料清单核对，本页慕尼黑材料仅作参考。");

  if (!data.passport) wait("待确认：是否有有效护照。");
  else if (data.passport === "no") issue("没有有效护照，通常无法推进申请。", 35);
  else if (data.passport === "short") issue("护照有效期较短，可能影响长居卡签发或需要先换护照。", 8);

  if (!data.livelihood) wait("待确认：生活来源是否有保障。");
  else if (data.livelihood === "no") issue("生活来源不能保障，不满足核心条件。", 30);
  else if (data.livelihood !== "yes") issue("生活来源材料不完整，需要补工资单、合同和生活费声明。", 10);

  if (!data.housing) wait("待确认：是否有足够住房证明。");
  else if (data.housing === "no") issue("没有足够住房证明，不满足常见要求。", 18);
  else if (data.housing !== "yes") action("补租约、住房面积、房租支付流水或 Wohnraumbescheinigung。");

  if (!data.criminalRecord) wait("待确认：是否有刑事犯罪记录。");
  else if (data.criminalRecord === "yes") issue("存在刑事犯罪记录，慕尼黑技术工人长居条件风险很高。", 25);

  if (!data.germanLevel) wait("待确认：德语等级。");
  if (!data.lidTest) wait("待确认：是否有 Leben in Deutschland 或等效证明。");
  else if (data.lidTest === "no") action("报名或准备 Leben in Deutschland 测试，或确认是否有德国德语授课毕业等效证明。");

  if (data.path === "blueCard") {
    bestPathText.textContent = "蓝卡长居。B1 + 21 个月，或 A1 + 27 个月，是最核心判断。";
    const b1 = data.germanLevel === "b1" || data.germanLevel === "b2plus";
    const minMonths = b1 ? 21 : 27;
    if (!titleMonths) wait("待填写：蓝卡合格就业月份。");
    else if (titleMonths >= minMonths) add(`蓝卡就业时间达到 ${minMonths} 个月要求。`);
    else issue(`蓝卡就业时间不足：当前 ${titleMonths} 个月，预计需 ${minMonths} 个月。`, 22);
    if (!pensionMonths) wait("待填写：养老保险缴费月份。");
    else if (pensionMonths < minMonths) issue(`养老保险月份不足：当前 ${pensionMonths} 个月，预计需 ${minMonths} 个月。`, 20);
    if (data.germanLevel === "none" || data.germanLevel === "unknown") issue("蓝卡长居至少需要 A1 德语；B1 可缩短到 21 个月。", 18);
  } else if (data.path === "skilled" || data.path === "germanGraduate") {
    const isGraduateFast = data.path === "germanGraduate" || data.germanGraduation === "yes";
    const minMonths = isGraduateFast ? 24 : 36;
    bestPathText.textContent = isGraduateFast ? "德国毕业后技术工人快速路径：通常 24 个月。" : "技术工人长居：通常 36 个月。";
    if (!titleMonths) wait("待填写：技术工人居留工作月份。");
    else if (titleMonths >= minMonths) add(`技术工人居留时间达到 ${minMonths} 个月要求。`);
    else issue(`技术工人居留时间不足：当前 ${titleMonths} 个月，预计需 ${minMonths} 个月。`, 22);
    if (!pensionMonths) wait("待填写：养老保险缴费月份。");
    else if (pensionMonths < minMonths) issue(`养老保险月份不足：当前 ${pensionMonths} 个月，预计需 ${minMonths} 个月。`, 20);
    if (!(data.germanLevel === "b1" || data.germanLevel === "b2plus")) issue("技术工人长居通常需要 B1 德语证明。", data.germanLevel ? 16 : 8);
    if (!data.currentJob) wait("待确认：当前是否有居留许可允许从事的工作。");
    else if (data.currentJob !== "yes") issue("当前工作许可或工作状态不清楚，需要先核对。", 14);
  } else if (data.path === "selfEmployed") {
    bestPathText.textContent = "自雇长居：通常 3 年自雇且业务可持续。";
    if (!titleMonths) wait("待填写：自雇居留月份。");
    else if (titleMonths < 36) issue(`自雇时间不足：当前 ${titleMonths} 个月，通常需 36 个月。`, 22);
    if (data.selfEmploymentStable !== "yes") issue("自雇业务可持续性尚未证明。", data.selfEmploymentStable ? 16 : 8);
  } else if (data.path === "spouseSkilled") {
    bestPathText.textContent = "配偶路径：配偶需持技术工人长居，本人通常需居留 3 年、每周工作至少 20 小时、B1 和 LiD。";
    if (data.spouseSettlement !== "yes") issue("配偶是否持技术工人长居未满足或未确认。", data.spouseSettlement ? 20 : 8);
    if (data.spouseCohabits !== "yes") issue("共同生活和每周至少 20 小时工作未满足或未确认。", data.spouseCohabits ? 20 : 8);
    if (!titleMonths) wait("待填写：本人居留月份。");
    else if (titleMonths < 36) issue(`本人居留时间不足：当前 ${titleMonths} 个月，通常需 36 个月。`, 20);
    if (!(data.germanLevel === "b1" || data.germanLevel === "b2plus")) issue("配偶路径通常需要 B1 德语。", 14);
  } else if (data.path === "euPermanent") {
    bestPathText.textContent = "Daueraufenthalt-EU：通常 5 年合法居留、60 个月养老保险。";
    if (!legalYears) wait("待填写：德国合法居住年数。");
    else if (legalYears < 5) issue(`德国合法居住不足 5 年：当前 ${legalYears} 年。`, 24);
    if (!pensionMonths) wait("待填写：养老保险缴费月份。");
    else if (pensionMonths < 60) issue(`养老保险不足 60 个月：当前 ${pensionMonths} 个月。`, 24);
    if (data.excludedTitle === "yes" || data.excludedTitle === "unknown") issue("当前居留可能属于 Daueraufenthalt-EU 排除类型，需要先核对。", 18);
  } else {
    bestPathText.textContent = data.path ? "普通/其他长居路径，建议以所在地外管局清单为准。" : "填写当前居留类型后显示。";
    if (!legalYears) wait("待填写：德国合法居住年数。");
    if (!pensionMonths) wait("待填写：养老保险缴费月份。");
  }

  if (data.lidTest === "no" || data.lidTest === "unknown") {
    action("补 Leben in Deutschland 或确认是否有德国德语授课毕业等效证明。");
  }
  if (data.germanLevel === "none" || data.germanLevel === "unknown") {
    action("准备德语证书；技术工人通常 B1，蓝卡至少 A1，B1 可缩短蓝卡等待期。");
  }
  if (!pensionMonths || pensionMonths < 60) {
    action("向 Deutsche Rentenversicherung 申请 Wartezeitauskunft，确认可计入月份。");
  }

  if (pending > 0) score -= Math.min(55, pending * 4);
  const normalized = Math.max(0, Math.min(100, score));
  let status = "ok";
  let title = "接近申请条件";
  let text = "当前填写的信息显示可以准备申请，但仍需按外管局清单核对文件。";
  if (pending >= 6) {
    status = "warn";
    title = "请先完成信息填写";
    text = "信息不足，暂时无法准确判断长居资格。";
  } else if (normalized < 60) {
    status = "danger";
    title = "目前不建议直接提交";
    text = "存在关键条件不足或材料缺口，建议先补齐。";
  } else if (normalized < 82) {
    status = "warn";
    title = "可能可申请，但仍有缺口";
    text = "核心路径可能接近，但还有材料或月份、德语、养老保险等风险。";
  }

  riskText.textContent = actions[0] || "暂未发现主要风险。";
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

function storageKey(item) {
  return `permanent-doc:${item}`;
}

function renderDocuments() {
  documentList.innerHTML = "";
  docs.forEach((group) => {
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
  localStorage.setItem(CASE_KEY, JSON.stringify(data));
  const result = evaluate(data);
  verdictCard.className = `verdict-card ${result.status}`;
  verdictTitle.textContent = result.title;
  verdictText.textContent = result.text;
  meterBar.style.width = `${result.score}%`;
  renderList(findingsList, result.findings, "请先填写信息。");
  renderList(actionsList, result.actions, "当前没有新增动作。");
}

function init() {
  renderQuestions(getSaved());
  renderDocuments();
  update();
}

printBtn.addEventListener("click", () => window.print());
saveBtn.addEventListener("click", update);
resetBtn.addEventListener("click", () => {
  localStorage.removeItem(CASE_KEY);
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
  const text = docs
    .flatMap((group) => [group.group, ...group.items.map(([item, source]) => `- ${item} (${source})`), ""])
    .join("\n");
  await navigator.clipboard.writeText(text);
  copyChecklistBtn.textContent = "已复制";
  setTimeout(() => {
    copyChecklistBtn.textContent = "复制清单";
  }, 1400);
});

init();
