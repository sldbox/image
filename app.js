/*
=============================================================================
  [최종본] 개복디 넥서스 — app.js (스마트 프로그레션 버튼 및 비활성화 렌더링)
=============================================================================
*/

const unitMap = new Map(), activeUnits = new Map(), completedUnits = new Map(), DOM = {};

const clean = s => s ? s.replace(/\s+/g, '').toLowerCase() : '';
const IGNORE_PARSE_RECIPES = ["미발견", "없음", ""];
const dashboardAtoms = ["전쟁광", "스파르타중대", "암흑광전사", "암흑파수기", "원시바퀴", "저격수", "코브라", "암흑고위기사", "암흑추적자", "변종가시지옥", "망치경호대", "공성파괴단", "암흑집정관", "암흑불멸자", "원시히드라리스크", "땅거미지뢰", "자동포탑", "우르사돈암", "우르사돈수", "갓오타/메시브"];
const EMPTY_SVG = `<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="opacity:0.2;"><rect x="3" y="3" width="18" height="18" rx="3" ry="3"></rect><line x1="3" y1="21" x2="21" y2="3"></line></svg>`;

const isOneTime = (u) => u && (u.grade === "슈퍼히든" || ["데하카", "데하카고치", "데하카의오른팔", "유물"].includes(u.name));
const isTargetGrade = (u) => ["슈퍼히든", "히든", "레전드"].includes(u.grade);

function getUnitId(rawName){ const c=clean(rawName); const u=unitMap.get(c); return u ? u.id : c; }

function calculateTotalCostScore(costStr){
    if(!costStr||IGNORE_PARSE_RECIPES.includes(costStr))return 0;
    let score=0;
    costStr.split('+').forEach(p=>{const m=p.match(/\[(\d+(?:\.\d+)?)\]/);if(m)score+=parseFloat(m[1]);else score+=1});
    return score;
}

function initializeCacheEngine() {
    unitMap.forEach(u => {
        u.parsedCost = [];
        if(u.cost && !IGNORE_PARSE_RECIPES.includes(u.cost)) {
            const safeCost = u.cost.replace(/[.\/]/g, '+');
            safeCost.split('+').forEach(p => {
                const m = p.match(/(.+?)\[(\d+(?:\.\d+)?)\]/);
                let name = m ? m[1].trim() : p.trim(); let qty = m ? parseFloat(m[2]) : 1; let cName = clean(name); let type = 'atom', key = cName;
                if(cName.includes('메시브') || cName.includes('디제스터')) { type='special'; key='메시브'; }
                else if(cName.includes('갓오타') || cName.includes('갓오브타임')) { type='special'; key='갓오타'; }
                else if(cName.includes('땅거미지뢰')) { key='땅거미지뢰'; }
                else if(cName.includes('자동포탑')) { key='자동포탑'; }
                else if(cName.includes('잠복')) { key='잠복'; }
                else { const uid = getUnitId(cName); key = dashboardAtoms.find(a => clean(a) === uid) || uid; }
                u.parsedCost.push({ type, key, qty, name: u.name });
            });
        }
        u.parsedRecipe = [];
        if(u.recipe && !IGNORE_PARSE_RECIPES.includes(u.recipe)) {
            u.recipe.split(/\+(?![^()]*\))/).forEach(p => {
                const m = p.trim().match(/^([^(\[]+)(?:\(([^)]+)\))?(?:\[(\d+)\])?/);
                if(m) {
                    const childId = getUnitId(m[1]);
                    u.parsedRecipe.push({ id: childId, qty: m[3] ? parseFloat(m[3]) : 1, cond: m[2] || '' });
                }
            });
        }
    });
}

function calcEssenceRecursiveFast(uid, counts, visited) {
    if(visited.has(uid)) return; visited.add(uid);
    const u = unitMap.get(uid); if(!u) return;
    if(["히든", "슈퍼히든"].includes(u.grade)) {
        if(u.category === "테바테메") counts.코랄 += 1;
        else if(u.category === "토바토메") counts.아이어 += 1;
        else if(u.category === "저그중립" && u.name !== "미니성큰") counts.제루스 += 1;
        else if(u.category === "혼종") counts.혼종 += 1;
    }
    if(u.parsedRecipe) u.parsedRecipe.forEach(pr => { if(pr.id) calcEssenceRecursiveFast(pr.id, counts, visited); });
}

function getEssenceCount(sourceMap) {
    let counts = {코랄:0, 아이어:0, 제루스:0, 혼종:0};
    sourceMap.forEach((qty, uid) => {
        for(let i=0; i<qty; i++) {
            let visited = new Set();
            calcEssenceRecursiveFast(uid, counts, visited);
        }
    });
    return counts;
}

function updateEssence(){
    let targetE = getEssenceCount(activeUnits);
    let compE = getEssenceCount(completedUnits);

    let finalCoral = Math.max(0, targetE.코랄 - compE.코랄);
    let finalAiur = Math.max(0, targetE.아이어 - compE.아이어);
    let finalZerus = Math.max(0, targetE.제루스 - compE.제루스);
    let finalHybrid = Math.max(0, targetE.혼종 - compE.혼종);

    let displayCoral = finalCoral + finalHybrid;
    let displayAiur = finalAiur + finalHybrid;
    let displayZerus = finalZerus + finalHybrid;
    let totalEssence = displayCoral + displayAiur + displayZerus;

    const setVal = (id, totalVal, baseVal, hybridVal) => {
        const el = document.getElementById(`val-${id}`);
        const subEl = document.getElementById(`sub-${id}`);
        const parent = document.getElementById(`slot-${id}`);
        if(el) {
            if(el.innerText !== String(totalVal)) el.innerText = totalVal;
            if(subEl) {
                if (hybridVal > 0 && id !== 'hybrid') { subEl.innerText = `${baseVal} + ${hybridVal}`; }
                else { subEl.innerText = ''; }
            }
            if(parent) parent.classList.toggle('active', totalVal > 0);
        }
    };

    setVal('coral', displayCoral, finalCoral, finalHybrid);
    setVal('aiur', displayAiur, finalAiur, finalHybrid);
    setVal('zerus', displayZerus, finalZerus, finalHybrid);
    setVal('hybrid', finalHybrid, finalHybrid, 0);

    const totalEl = document.getElementById('essence-total-val');
    if(totalEl) {
        totalEl.innerText = totalEssence;
        const parent = document.getElementById('slot-total-essence');
        if(parent) parent.classList.toggle('active', totalEssence > 0);
    }
}

function updateMagicDashboard(){
    const totalMap={}; dashboardAtoms.forEach(a=>{if(a==="갓오타/메시브")totalMap[a]={갓오타:0,메시브:0};else totalMap[a]=0;});

    Array.from(activeUnits.keys()).forEach(k=>{
        const u=unitMap.get(k); if(!u) return; const c=activeUnits.get(k)||1;
        if(u.parsedCost && u.parsedCost.length > 0) {
            u.parsedCost.forEach(pc => {
                if(pc.type === 'special') totalMap['갓오타/메시브'][pc.key] += pc.qty * c;
                else totalMap[pc.key] = (totalMap[pc.key] || 0) + pc.qty * c;
            });
        }
    });

    const compMap={}; dashboardAtoms.forEach(a=>{if(a==="갓오타/메시브")compMap[a]={갓오타:0,메시브:0};else compMap[a]=0;});
    Array.from(completedUnits.keys()).forEach(k=>{
        const c=completedUnits.get(k)||0;
        if(c > 0) {
            const cleanK = clean(k);
            const atomKey = dashboardAtoms.find(a => clean(a) === cleanK);
            if (atomKey && atomKey !== '갓오타/메시브') compMap[atomKey] = (compMap[atomKey] || 0) + c;

            if(k === '갓오타') { compMap['갓오타/메시브'].갓오타 += c; return; }
            if(k === '메시브') { compMap['갓오타/메시브'].메시브 += c; return; }

            const u=unitMap.get(k); if(!u) return;
            if(u.parsedCost && u.parsedCost.length > 0) {
                u.parsedCost.forEach(pc => {
                    if(pc.type === 'special') compMap['갓오타/메시브'][pc.key] += pc.qty * c;
                    else compMap[pc.key] = (compMap[pc.key] || 0) + pc.qty * c;
                });
            }
        }
    });

    dashboardAtoms.forEach(a=>{
        const val=totalMap[a], comp=compMap[a];
        const container=document.getElementById(`vslot-${clean(a)}`);if(!container)return;
        const e=container.querySelector('.cost-val'), nameEl=container.querySelector('.cost-name');

        if(a==="갓오타/메시브"){
            let finalG = Math.max(0, val.갓오타 - comp.갓오타); let finalM = Math.max(0, val.메시브 - comp.메시브);
            if(finalG>0 || finalM>0){
                if(e.innerHTML === EMPTY_SVG || e.innerHTML === '') {
                    e.innerHTML=`<div class="sp-wrap" style="display:flex; width:100%; height:100%;">
                        <div style="flex:1; display:flex; flex-direction:column; justify-content:center; align-items:center; border-right:1px solid rgba(236,72,153,0.3);">
                            <span class="sp-val-g" style="font-size:1.8rem; font-weight:900; color:var(--grade-rare); line-height:1; margin-bottom:4px; text-shadow:0 0 10px rgba(251,191,36,0.5);"></span>
                            <span style="font-size:0.7rem; color:rgba(255,255,255,0.7); letter-spacing:-0.5px;">갓오타</span>
                        </div>
                        <div style="flex:1; display:flex; flex-direction:column; justify-content:center; align-items:center;">
                            <span class="sp-val-m" style="font-size:1.8rem; font-weight:900; color:var(--grade-unique); line-height:1; margin-bottom:4px; text-shadow:0 0 10px rgba(239,68,68,0.5);"></span>
                            <span style="font-size:0.7rem; color:rgba(255,255,255,0.7); letter-spacing:-0.5px;">메시브</span>
                        </div>
                    </div>`;
                }
                const spG = e.querySelector('.sp-val-g'); const spM = e.querySelector('.sp-val-m');
                if(spG) spG.innerText = finalG; if(spM) spM.innerText = finalM;
                if(nameEl.style.display !== 'none') nameEl.style.display='none';
                if(!container.classList.contains('active')) container.classList.add('active');
            } else {
                if(e.innerHTML !== EMPTY_SVG) { e.innerHTML=EMPTY_SVG; nameEl.style.display='block'; container.classList.remove('active'); }
            }
        } else {
            let finalVal = Math.max(0, val - comp);
            if(finalVal>0){
                let targetText = String(Math.ceil(finalVal));
                if(e.innerText !== targetText) e.innerText = targetText;
                if(nameEl.style.display !== 'block') nameEl.style.display='block';
                if(!container.classList.contains('active')) container.classList.add('active');
            } else {
                if(e.innerHTML !== EMPTY_SVG) { e.innerHTML=EMPTY_SVG; nameEl.style.display='block'; container.classList.remove('active'); }
            }
        }
    });
}

let _activeTabIdx = 0;
let _currentViewMode = 'codex';
let _currentHighlight = null;
let _currentLineageId = null;

const GRADE_ORDER = ["매직", "레어", "에픽", "유니크", "헬", "레전드", "히든", "슈퍼히든"];
const gradeColorsRaw = { "매직":"var(--grade-magic)", "레어":"var(--grade-rare)", "에픽":"var(--grade-epic)", "유니크":"var(--grade-unique)", "헬":"var(--grade-hell)", "레전드":"var(--grade-legend)", "히든":"var(--grade-hidden)", "슈퍼히든":"var(--grade-super)" };

const TAB_CATEGORIES = [
    {key:"테바테메", name:"테바테메", sym:"♆"},
    {key:"토바토메", name:"토바토메", sym:"⟡"},
    {key:"저그중립", name:"저그중립", sym:"☣︎"},
    {key:"혼종", name:"혼종", sym:"⌬"}
];

function triggerHaptic() { if (typeof navigator !== 'undefined' && navigator.vibrate) { navigator.vibrate(15); } }

function resetCodex(silent = false) { activeUnits.clear(); completedUnits.clear(); toggleHighlight(null); debouncedUpdateAllPanels(); if(!silent) showToast("목표 유닛이 초기화되었습니다."); }

function resetCompleted() { completedUnits.clear(); debouncedUpdateAllPanels(); showToast("완료 기록이 모두 초기화되었습니다."); }

function setupInitialView() {
    const layout = document.getElementById('mainLayout');
    if (layout) layout.style.display = '';
    switchLayout('codex');
    startTitleCycle();
}

const _cycleTitles = ['개복디 넥서스', '제작자 | 회장', 'ID : 3-S2-1-2461127'];
let _cycleTitleIdx = 0;
function startTitleCycle() {
    const el = document.getElementById('nexusCycleTitle');
    if(!el) return;
    setInterval(() => {
        _cycleTitleIdx = (_cycleTitleIdx + 1) % _cycleTitles.length;
        el.style.opacity = '0';
        el.style.transform = 'translateY(-8px)';
        setTimeout(() => {
            el.textContent = _cycleTitles[_cycleTitleIdx];
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 350);
    }, 3000);
}

let _jewelPanelOpen = false;
window.toggleJewelPanel = function() {
    const layout = document.getElementById('mainLayout');
    if (layout.classList.contains('view-jewel')) {
        closeJewelPanel();
    } else {
        layout.classList.remove('view-lineage');
        _currentLineageId = null;
        layout.classList.add('view-jewel');
        _jewelPanelOpen = true;
        renderJewelMiniGrid();
    }
};

window.closeJewelPanel = function() {
    const layout = document.getElementById('mainLayout');
    layout.classList.remove('view-jewel');
    _jewelPanelOpen = false;
};

function switchLayout(mode) {
    const layout = document.getElementById('mainLayout');
    const btnToggle = document.getElementById('btnToggleMode');
    if (!layout || !btnToggle) return;

    _currentViewMode = mode;
    layout.classList.remove('view-deduct');
    layout.classList.remove('view-lineage');
    _currentLineageId = null;
    layout.classList.remove('view-jewel');
    _jewelPanelOpen = false;

    if (mode === 'deduct') {
        layout.classList.add('view-deduct');
        btnToggle.classList.remove('active');
        btnToggle.innerHTML = '<span class="toggle-icon">◧</span> 도감 모드 전환';
    } else if (mode === 'codex') {
        btnToggle.classList.add('active');
        btnToggle.innerHTML = '<span class="toggle-icon">◨</span> 체크리스트 전환';
    }
}

function toggleViewMode() {
    if (_currentViewMode === 'deduct') switchLayout('codex');
    else switchLayout('deduct');
}

window.toggleLineageNode = function(el) {
    const node = el.closest('.tree-node');
    if(!node) return;
    const body = node.querySelector(':scope > .tree-body');
    const toggle = el.querySelector('.th-toggle');
    if(body) {
        if(body.classList.contains('collapsed')) {
            body.classList.remove('collapsed');
            if(toggle) toggle.innerText = '▼';
        } else {
            body.classList.add('collapsed');
            if(toggle) toggle.innerText = '▶';
        }
    }
};

window.toggleAllLineage = function() {
    const btn = document.getElementById('btnToggleAllLineage');
    const container = document.getElementById('lineageTreeContainer');
    if(!container || !btn) return;

    if (btn.innerText === '전체펼치기') {
        container.querySelectorAll('.tree-body').forEach(el => el.classList.remove('collapsed'));
        container.querySelectorAll('.th-toggle').forEach(el => { if(el.innerText === '▶') el.innerText = '▼'; });
        btn.innerText = '전체접기';
    } else {
        const rootBody = document.querySelector('#lineageTreeContainer > .tree-node > .tree-body');
        if(rootBody) {
            rootBody.querySelectorAll('.tree-body').forEach(el => el.classList.add('collapsed'));
            rootBody.querySelectorAll('.th-toggle').forEach(el => { if(el.innerText === '▼') el.innerText = '▶'; });
        }
        btn.innerText = '전체펼치기';
    }
};

function isCostSameAsRecipe(uid) {
    const u = unitMap.get(uid);
    if(!u || !u.parsedRecipe || u.parsedRecipe.length === 0) return true;
    for(let pr of u.parsedRecipe) {
        let childU = unitMap.get(pr.id);
        if(childU && childU.parsedRecipe && childU.parsedRecipe.length > 0) return false;
    }
    return true;
}

function getLineageRecipeText(u, multiplier = 1) {
    if(!u.parsedRecipe || u.parsedRecipe.length === 0) return '';
    let parts = u.parsedRecipe.map(pr => {
        let childU = unitMap.get(pr.id);
        let origName = childU ? childU.name : pr.id;
        let color = childU ? gradeColorsRaw[childU.grade] : 'var(--text)';
        let nameStr = `<span style="color:${color}; font-weight:bold;">${origName}</span>`;
        let condStr = pr.cond ? `(<span style="color:var(--text-sub);">${pr.cond}</span>)` : '';

        let childReqQty = (u.id === '로리스완' && pr.id === '낮까마귀') ? 1 : pr.qty * multiplier;
        let qtyStr = `[${childReqQty}]`;
        return `${nameStr}${condStr}${qtyStr}`;
    });
    return `<div class="td-line"><span class="td-label">재료:</span> ${parts.join('+')}</div>`;
}

function getLineageMagicCostText(uid, multiplier = 1) {
    const u = unitMap.get(uid);
    if(!u || !u.parsedCost || u.parsedCost.length === 0) return '';

    let totalMap={}; dashboardAtoms.forEach(a=>{if(a==="갓오타/메시브")totalMap[a]={갓오타:0,메시브:0};else totalMap[a]=0;});
    u.parsedCost.forEach(pc => {
        if(pc.type === 'special') totalMap['갓오타/메시브'][pc.key] += pc.qty * multiplier;
        else totalMap[pc.key] = (totalMap[pc.key] || 0) + pc.qty * multiplier;
    });

    let costArr = [];
    dashboardAtoms.forEach(a => {
        if (a === "갓오타/메시브") {
            if (totalMap[a].갓오타 > 0) costArr.push(`<span style="color:var(--g); font-weight:bold;">갓오타[${totalMap[a].갓오타}]</span>`);
            if (totalMap[a].메시브 > 0) costArr.push(`<span style="color:var(--g); font-weight:bold;">메시브[${totalMap[a].메시브}]</span>`);
        } else {
            if (totalMap[a] > 0) costArr.push(`<span style="color:var(--g); font-weight:bold;">${a}[${totalMap[a]}]</span>`);
        }
    });

    if(costArr.length === 0) return '';
    return `<div class="td-line" style="color:var(--g); font-weight:bold;"><span class="td-label" style="color:var(--g);">매직:</span> ${costArr.join(',')}</div>`;
}

function buildLineageTree(uid, reqQty=1, cond='', depth=0, isRoot=false) {
    const u = unitMap.get(uid) || { id: uid, name: uid, grade: "일반", parsedRecipe: [] };
    const hasChildren = u.parsedRecipe && u.parsedRecipe.length > 0;
    const color = gradeColorsRaw[u.grade] || "var(--text-sub)";

    let isExpanded = isRoot;
    let html = `<div class="tree-node" data-depth="${depth}">`;

    html += `<div class="tree-header-row">`;
    html += `<div class="tree-header-box" style="border-color:${color}66;" ${hasChildren ? `onclick="toggleLineageNode(this)"` : ''}>`;

    html += `<div class="th-thumb-lg" style="border-color:${color}88;">
                <img src="https://sldbox.github.io/site/image/ctg/${u.name}.png" alt="${u.name}" onerror="this.parentElement.style.display='none'">
             </div>`;
    html += `<div class="th-info">`;
    html += `    <span class="gtag th-badge" style="border-color:${color}88; color:${color};">${u.grade}</span>`;
    html += `    <span class="th-name-lg" style="color:${color};">${u.name}</span>`;
    html += `</div>`;

    if (hasChildren) {
        html += `<span class="th-toggle">${isExpanded ? '▼' : '▶'}</span>`;
    }
    html += `</div>`;

    if (!isRoot) {
        if (cond) html += `<span class="th-cond">${cond}</span>`;
        html += `<span class="th-qty">[${reqQty}]</span>`;
    }
    html += `</div>`;

    let hasMagicCost = !isCostSameAsRecipe(uid) && getLineageMagicCostText(uid, reqQty) !== '';

    if (hasChildren || hasMagicCost) {
        html += `<div class="tree-body ${isExpanded ? '' : 'collapsed'}">`;

        if (hasChildren || hasMagicCost) {
            html += `<div class="tree-details">`;
            if (hasChildren) html += getLineageRecipeText(u, reqQty);
            if (hasMagicCost) {
                let tc = getLineageMagicCostText(uid, reqQty);
                if(tc) html += tc;
            }
            html += `</div>`;
        }

        if (hasChildren) {
            html += `<div class="tree-children">`;
            u.parsedRecipe.forEach(child => {
                let childReqQty = (u.id === '로리스완' && child.id === '낮까마귀') ? 1 : child.qty * reqQty;
                html += buildLineageTree(child.id, childReqQty, child.cond, depth + 1, false);
            });
            html += `</div>`;
        }
        html += `</div>`;
    }
    html += `</div>`;
    return html;
}

window.openLineage = function(uid) {
    const layout = document.getElementById('mainLayout');

    if (layout.classList.contains('view-lineage') && _currentLineageId === uid) {
        closeLineage();
        return;
    }

    const u = unitMap.get(uid);
    if (!u) return;

    _currentLineageId = uid;

    layout.classList.add('view-lineage');
    if(layout.classList.contains('view-jewel')) layout.classList.remove('view-jewel');

    const contentEl = document.getElementById('lineageContent');
    contentEl.scrollTop = 0;

    const titleEl = document.getElementById('lineageTitle');
    titleEl.innerHTML = `<span style="color:${gradeColorsRaw[u.grade]}; font-size:0.9rem; vertical-align:middle; border:1px solid currentColor; padding:2px 6px; border-radius:6px; margin-right:6px;">${u.grade}</span> ${u.name} 계보`;

    let html = '';

    if (u.grade === "히든" || u.grade === "레전드") {
        let parents = [];
        unitMap.forEach(parent => {
            if (["슈퍼히든", "히든"].includes(parent.grade) && parent.parsedRecipe) {
                if (parent.parsedRecipe.some(pr => pr.id === uid)) parents.push(parent);
            }
        });
        if (parents.length > 0) {
            parents.sort((a, b) => GRADE_ORDER.indexOf(b.grade) - GRADE_ORDER.indexOf(a.grade));
            html += `<div class="lineage-parents-section">
                        <div class="lp-title">🔼 상위 진화 트리</div>
                        <div class="lp-list">`;
            parents.forEach(p => {
                html += `<button class="lineage-nav-up" onclick="openLineage('${p.id}')">
                            <span class="lp-grade" style="color:${gradeColorsRaw[p.grade]}; border-color:${gradeColorsRaw[p.grade]}44;">${p.grade}</span>
                            <span>${p.name} (으)로 이동</span>
                         </button>`;
            });
            html += `</div></div>`;
        }
    }

    html += `<div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:12px;">
                <div style="font-size:1.1rem; color:var(--grade-super); font-weight:900; letter-spacing:0.5px; font-family:var(--font-display);">${u.name}</div>
                <div class="lineage-ctrl-btns">
                    <button class="l-ctrl-btn" id="btnToggleAllLineage" onclick="toggleAllLineage()">전체펼치기</button>
                </div>
             </div>`;

    html += `<div class="lineage-tree" id="lineageTreeContainer">`;
    html += buildLineageTree(uid, 1, '', 0, true);
    html += `</div>`;

    contentEl.innerHTML = html;
};

window.closeLineage = function() {
    const layout = document.getElementById('mainLayout');
    layout.classList.remove('view-lineage');
    _currentLineageId = null;
};

let searchTimeout = null;
const ALIAS_MAP = {
    "타커": "타이커스", "타이": "타이커스", "닥템": "암흑기사", "닼템": "암흑기사", "다칸": "암흑집정관",
    "스투": "스투코프", "디젯": "디제스터", "메십": "메시브", "마랩": "마스터랩", "히페": "히페리온",
    "고전순": "고르곤전투순양함", "특레": "특공대레이너", "드레천": "드라켄레이저천공기",
    "공허": "공허포격기", "분수": "분노수호자", "원히": "원시히드라리스크"
};

function setupSearchEngine() {
    const inputEl = document.getElementById('unitSearchInput');
    if(!inputEl) return;
    inputEl.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        const val = e.target.value;
        searchTimeout = setTimeout(() => performSearch(val), 150);
    });
    inputEl.addEventListener('keydown', (e) => { if(e.key === 'Enter') { e.preventDefault(); processCommand(e.target.value); } });
    document.addEventListener('click', (e) => { const sr = document.getElementById('searchResults'); if(sr && !e.target.closest('#searchWrap')) sr.classList.remove('active'); });
}

function findUnitFlexible(rawName) {
    let qClean = clean(rawName); if(!qClean) return null;
    let aliased = ALIAS_MAP[rawName] || ALIAS_MAP[qClean];
    if(aliased) qClean = clean(aliased);

    for(let [id, u] of unitMap) {
        let uClean = clean(u.name);
        if(uClean === qClean || id === qClean) return u;
    }

    for(let [id, u] of unitMap) {
        let uClean = clean(u.name);
        if(uClean.includes(qClean)) return u;
    }
    return null;
}

function performSearch(query) {
    const sr = document.getElementById('searchResults'); if(!query.trim()) { sr.classList.remove('active'); return; }
    const parts = query.split('/'); let currentQuery = parts[parts.length - 1].trim(); if(!currentQuery) { sr.classList.remove('active'); return; }

    let searchName = currentQuery.split('*')[0].trim(); let qClean = clean(searchName);

    let exactMatches = [];
    let partialMatches = [];

    unitMap.forEach(u => {
        if(isTargetGrade(u)) {
            let uClean = clean(u.name);
            let aliasClean = ALIAS_MAP[searchName] ? clean(ALIAS_MAP[searchName]) : null;

            if (uClean === qClean || (aliasClean && uClean === aliasClean)) {
                exactMatches.push(u);
            } else if(uClean.includes(qClean) || (aliasClean && uClean.includes(aliasClean))) {
                partialMatches.push(u);
            }
        }
    });

    exactMatches.sort((a,b) => GRADE_ORDER.indexOf(b.grade) - GRADE_ORDER.indexOf(a.grade));
    partialMatches.sort((a,b) => GRADE_ORDER.indexOf(b.grade) - GRADE_ORDER.indexOf(a.grade));

    let combined = [...exactMatches, ...partialMatches].slice(0, 10);

    if(combined.length > 0) {
        sr.innerHTML = combined.map(u => `
            <div class="sr-item" onclick="applySearchAutocomplete('${u.name}')">
                <div style="display:flex; align-items:center; gap:8px;">
                    <span style="color:${gradeColorsRaw[u.grade]}; font-size:0.8rem; font-weight:900;">[${u.grade}]</span>
                    <span class="sr-name" style="color:var(--text);">${u.name}</span>
                </div>
                <span class="sr-cmd">↵ 자동완성</span>
            </div>
        `).join('');
        sr.classList.add('active');
    } else {
        sr.innerHTML = `<div style="padding:15px; text-align:center; color:var(--text-muted); font-size:0.9rem;">해당 등급(슈퍼히든,히든,레전드) 결과 없음</div>`;
        sr.classList.add('active');
    }
}

function applySearchAutocomplete(unitName) {
    const inputEl = document.getElementById('unitSearchInput');
    let val = inputEl.value;
    let parts = val.split('/');
    let lastPart = parts[parts.length - 1];
    let multiplierMatch = lastPart.match(/\*\d+/);
    let multiplier = multiplierMatch ? multiplierMatch[0] : '*1';

    parts[parts.length - 1] = unitName + multiplier;
    inputEl.value = parts.join('/');
    inputEl.focus();
    document.getElementById('searchResults').classList.remove('active');
}

function processCommand(val) {
    if(!val.trim()) return;
    const commands = val.split('/'); let successCount = 0;

    commands.forEach(cmd => {
        let targetName = cmd.trim(); let qty = 1;
        if(cmd.includes('*')) { const parts = cmd.split('*'); targetName = parts[0].trim(); let parsedQty = parseInt(parts[1]); if(!isNaN(parsedQty) && parsedQty > 0) qty = parsedQty; }
        const match = findUnitFlexible(targetName);

        if(match) {
            let currentQty = activeUnits.get(match.id) || 0; let newQty = currentQty + qty;
            if(newQty > 16 && !isOneTime(match)) newQty = 16;
            if(isOneTime(match)) newQty = 1;
            activeUnits.set(match.id, newQty); successCount++;
        }
    });

    if(successCount > 0) {
        debouncedUpdateAllPanels(); showToast(`<span class="t-icon">⚡</span> ${successCount}건의 커맨드 등록 완료`);
        const inputEl = document.getElementById('unitSearchInput'); if(inputEl) inputEl.value = '';
        document.getElementById('searchResults').classList.remove('active');
        if(_currentViewMode === 'deduct') switchLayout('codex');
    } else { showToast(`<span class="t-icon">⚠</span> 유효한 유닛을 찾을 수 없습니다.`, true); }
}

function showToast(msg, isError = false) {
    const container = document.getElementById('toastContainer'); if(!container) return;
    const t = document.createElement('div'); t.className = 'toast' + (isError ? ' error' : ''); t.innerHTML = msg;
    container.appendChild(t); setTimeout(() => { if(t.parentElement) t.remove(); }, 2100);
}

window.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        hideRecipeTooltip();
        const layout = document.getElementById('mainLayout');

        if (layout && layout.classList.contains('view-jewel')) {
            closeJewelPanel();
        }
        if (layout && layout.classList.contains('view-lineage')) {
            closeLineage();
        }

        const searchEl = document.getElementById('unitSearchInput');
        if (document.activeElement === searchEl) {
            searchEl.value = '';
            document.getElementById('searchResults').classList.remove('active');
            searchEl.blur();
        }
    }
});

document.addEventListener('click', (e) => {
    if (_currentHighlight && !e.target.closest('.deduct-slot') && !e.target.closest('.d-reason-tag') && !e.target.closest('#recipeTooltip')) {
        toggleHighlight(null);
    }
});

let repeatTimer = null, repeatDelayTimer = null;
let _lastInteractionTime = 0;

function startSmartChange(id, delta, type, event) {
    if(event) {
        if(event.type === 'touchstart') {
            _lastInteractionTime = Date.now();
        } else if(event.type === 'mousedown' && Date.now() - _lastInteractionTime < 300) {
            return;
        }
        event.preventDefault();
        event.stopPropagation();
    }
    stopSmartChange();
    triggerHaptic();

    let shiftMulti = (event && event.shiftKey) ? 5 : 1;
    let finalDelta = delta * shiftMulti;

    const action = () => {
        let current = activeUnits.get(id) || 0;
        if(current === 0 && finalDelta > 0) toggleUnitSelection(id, finalDelta);
        else setUnitQty(id, current + finalDelta);
    };
    action();
    repeatDelayTimer = setTimeout(() => { repeatTimer = setInterval(() => { triggerHaptic(); action(); }, 80); }, 400);
}

function stopSmartChange() { clearTimeout(repeatDelayTimer); clearInterval(repeatTimer); repeatDelayTimer = null; repeatTimer = null; }
document.addEventListener('mouseup', stopSmartChange);
document.addEventListener('touchend', stopSmartChange);
window.addEventListener('mouseleave', stopSmartChange);

function showRecipeTooltip(id, event, isDeduction = false) {
    if(event && event.type !== 'mousemove') event.stopPropagation();
    const u = unitMap.get(id); if(!u) return;
    let multi = 1;
    if(isDeduction) { const reqEl = document.getElementById(`d-req-${id}`); if(reqEl) { let reqVal = parseInt(reqEl.innerText); if(reqVal > 1) multi = reqVal; } }
    const tt = document.getElementById('recipeTooltip');
    tt.innerHTML = `<div class="tooltip-header" style="color:${gradeColorsRaw[u.grade]}">${u.name} 조합법 ${multi > 1 ? `<span style="font-size:0.8rem; color:var(--text-sub);">(${multi}개 기준)</span>` : ''}</div><div class="tooltip-body">${formatRecipeTooltip(u, multi)}</div><div class="tooltip-footer">화면을 터치하거나 외부 클릭 시 닫힙니다.</div>`;
    tt.classList.add('active');

    let x = event.pageX || (event.touches && event.touches[0].pageX) || window.innerWidth/2;
    let y = event.pageY || (event.touches && event.touches[0].pageY) || window.innerHeight/2;
    if(x + 280 > window.innerWidth) x = window.innerWidth - 290;
    tt.style.left = Math.max(10, x + 15) + 'px'; tt.style.top = (y + 15) + 'px';
}
function hideRecipeTooltip() { const tt = document.getElementById('recipeTooltip'); if(tt) tt.classList.remove('active'); }
document.addEventListener('click', hideRecipeTooltip); document.addEventListener('touchstart', hideRecipeTooltip);

function toggleUnitSelection(id, forceQty){
    if(activeUnits.has(id)){
        activeUnits.delete(id);
    } else {
        const u = unitMap.get(id); const initQty = isOneTime(u) ? 1 : (forceQty || 1);
        activeUnits.set(id, initQty);
    }
    debouncedUpdateAllPanels();
}

function setUnitQty(id, val) {
    let q = parseInt(val);
    if (q === 0 || isNaN(q) || q < 1) {
        if (activeUnits.has(id)) { activeUnits.delete(id); }
        debouncedUpdateAllPanels();
        return;
    }
    const u = unitMap.get(id); if (!u || isOneTime(u)) return;
    if (q > 16) q = 16;
    activeUnits.set(id, q); debouncedUpdateAllPanels();
}

function getDependencies(uid, deps = new Set()) {
    if(deps.has(uid)) return deps;
    deps.add(uid);
    const u = unitMap.get(uid);
    if (u && u.parsedRecipe) {
        u.parsedRecipe.forEach(child => {
            if (child.id) getDependencies(child.id, deps);
        });
    }
    if (u && u.parsedCost) {
        u.parsedCost.forEach(pc => {
            if(pc.key === '갓오타' || pc.key === '메시브') deps.add(pc.key);
        });
    }
    return deps;
}

function toggleHighlight(uid, event) {
    if(event) { event.preventDefault(); event.stopPropagation(); }
    const board = document.getElementById('deductionBoard');
    if(!board) return;

    if(!uid || _currentHighlight === uid) {
        _currentHighlight = null;
        board.classList.remove('highlight-mode');
        document.querySelectorAll('.deduct-slot').forEach(el => el.classList.remove('highlighted-tree'));
        return;
    }

    _currentHighlight = uid;
    board.classList.add('highlight-mode');
    document.querySelectorAll('.deduct-slot').forEach(el => el.classList.remove('highlighted-tree'));

    const deps = getDependencies(uid);
    deps.forEach(depId => {
        const el = document.getElementById(`d-slot-wrap-${depId}`);
        if(el) el.classList.add('highlighted-tree');
    });
}

// [개선] 절대 지도(BaseMap)와 순수 필요량(NetMap) 분리 계산
function calculateDeductedRequirements() {
    let reqMap = new Map();
    let baseMap = new Map();
    let reasonMap = new Map();
    let specialReq = { 갓오타: 0, 메시브: 0 };
    let baseSpecialReq = { 갓오타: 0, 메시브: 0 };
    let specialReason = { 갓오타: new Map(), 메시브: new Map() };

    let deficits = new Map();
    let baseDeficits = new Map();
    let rootTracking = new Map();

    activeUnits.forEach((qty, uid) => {
        deficits.set(uid, (deficits.get(uid) || 0) + qty);
        baseDeficits.set(uid, (baseDeficits.get(uid) || 0) + qty);
        let rm = new Map();
        rm.set(uid, { id: uid, text: '목표 유닛' });
        rootTracking.set(uid, rm);
    });

    let usedCompleted = new Map();

    // 1. BaseMap (절대 지도 - 비활성 상태 보존용)
    let baseQueue = Array.from(activeUnits.keys());
    let baseGuard = 0;
    while(baseQueue.length > 0 && baseGuard < 1000) {
        baseGuard++;
        let currentLevel = baseQueue.slice();
        baseQueue = [];
        currentLevel.forEach(uid => {
            const u = unitMap.get(uid);
            if (!u) return;
            let needed = baseDeficits.get(uid) || 0;

            if (uid === '로리스완') {
                let toolNeeded = needed > 0 ? 1 : 0;
                if (toolNeeded > (baseDeficits.get('낮까마귀') || 0)) {
                    baseDeficits.set('낮까마귀', toolNeeded);
                    if (!baseQueue.includes('낮까마귀')) baseQueue.push('낮까마귀');
                }
            }

            if (needed > 0 && u.parsedRecipe) {
                u.parsedRecipe.forEach(child => {
                    if (child.id && unitMap.has(child.id)) {
                        let isTool = (uid === '로리스완' && child.id === '낮까마귀');
                        if (!isTool) {
                            let childNeed = needed * child.qty;
                            baseDeficits.set(child.id, (baseDeficits.get(child.id) || 0) + childNeed);
                            if (!baseQueue.includes(child.id)) baseQueue.push(child.id);
                        }
                    }
                });
            }
        });
    }
    baseDeficits.forEach((val, k) => { if (val > 0) baseMap.set(k, val); });

    // 2. ReqMap (순수 필요 지도 - 완료된 수량 차감)
    let processQueue = Array.from(activeUnits.keys());
    let safeGuard = 0;
    while (processQueue.length > 0 && safeGuard < 1000) {
        safeGuard++;
        let currentLevel = processQueue.slice();
        processQueue = [];

        currentLevel.forEach(uid => {
            const u = unitMap.get(uid);
            if (!u) return;

            let needed = deficits.get(uid) || 0;
            let completed = completedUnits.get(uid) || 0;
            let consume = Math.min(completed, needed);
            let remaining = needed - consume;

            if (uid === '로리스완') {
                let toolNeeded = remaining > 0 ? 1 : 0;
                let currentTool = deficits.get('낮까마귀') || 0;
                if (toolNeeded > currentTool) {
                    deficits.set('낮까마귀', toolNeeded);
                    if (!processQueue.includes('낮까마귀')) processQueue.push('낮까마귀');
                }
            }

            if (remaining > 0 && u.parsedRecipe) {
                u.parsedRecipe.forEach(child => {
                    if (child.id && unitMap.has(child.id)) {
                        let isTool = (uid === '로리스완' && child.id === '낮까마귀');

                        if (!rootTracking.has(child.id)) rootTracking.set(child.id, new Map());
                        let childRoots = rootTracking.get(child.id);
                        let parentRoots = rootTracking.get(uid);

                        if (parentRoots) {
                            parentRoots.forEach((rootInfo, rootId) => {
                                let rootUnit = unitMap.get(rootId);
                                let baseName = rootUnit ? rootUnit.name : rootId;
                                let newText = baseName;
                                if (isTool) newText += ` <span style="margin-left:4px; font-size:0.75rem; color:#10b981; font-weight:900; text-shadow:0 0 4px rgba(16,185,129,0.4);">[도구]</span>`;
                                else if (child.cond) newText += ` <span style="margin-left:4px; font-size:0.75rem; color:#fde047; font-weight:900; text-shadow:0 0 4px rgba(253,224,71,0.4);">[${child.cond}]</span>`;
                                childRoots.set(rootId, { id: rootId, text: newText });
                            });
                        }

                        if (!isTool) {
                            let childNeed = remaining * child.qty;
                            deficits.set(child.id, (deficits.get(child.id) || 0) + childNeed);
                            if (!processQueue.includes(child.id)) processQueue.push(child.id);
                        }
                    }
                });
            }
        });
    }

    deficits.forEach((needed, uid) => {
        if (needed > 0) {
            let comp = completedUnits.get(uid) || 0;
            let net = Math.max(0, needed - comp);
            reqMap.set(uid, net);
        }
    });

    // Special Needs
    baseDeficits.forEach((needed, uid) => {
        const u = unitMap.get(uid);
        if (u && u.parsedCost) {
            u.parsedCost.forEach(pc => {
                if (pc.key === '갓오타' || pc.key === '메시브') {
                    baseSpecialReq[pc.key] += pc.qty * needed;
                }
            });
        }
    });

    deficits.forEach((needed, uid) => {
        const u = unitMap.get(uid);
        if (u && u.parsedCost) {
            u.parsedCost.forEach(pc => {
                if (pc.key === '갓오타' || pc.key === '메시브') {
                    specialReq[pc.key] += pc.qty * needed;
                    if(activeUnits.has(uid)) specialReason[pc.key].set(uid, `${u.name}`);
                }
            });
        }
    });

    specialReq['갓오타'] = Math.max(0, specialReq['갓오타'] - (completedUnits.get('갓오타') || 0));
    specialReq['메시브'] = Math.max(0, specialReq['메시브'] - (completedUnits.get('메시브') || 0));

    rootTracking.forEach((rootsMap, childId) => {
        let rMap = new Map();
        if (activeUnits.has(childId)) {
            rMap.set(childId, '목표 유닛');
        } else {
            rootsMap.forEach((info, rootId) => { rMap.set(rootId, info.text); });
        }
        reasonMap.set(childId, rMap);
    });

    return { reqMap, baseMap, reasonMap, specialReq, baseSpecialReq, specialReason };
}

// [개선] 딥 스캔(Deep Scan): 연결된 모든 하위 재료의 완료 여부를 확인
function getDeepCompleted(uid, visited = new Set()) {
    if (visited.has(uid)) return 0;
    visited.add(uid);
    let count = 0;
    const u = unitMap.get(uid);
    if (u && u.parsedRecipe) {
        u.parsedRecipe.forEach(pr => {
            if (pr.id && !(uid === '로리스완' && pr.id === '낮까마귀')) {
                count += completedUnits.get(pr.id) || 0;
                count += getDeepCompleted(pr.id, visited);
            }
        });
    }
    if (u && u.parsedCost) {
        u.parsedCost.forEach(pc => {
            if (pc.key === '갓오타' || pc.key === '메시브') {
                count += completedUnits.get(pc.key) || 0;
            }
        });
    }
    return count;
}

function attemptAutoMerge() {
    let merged = false;
    let loopCount = 0;

    do {
        merged = false;
        let { reqMap } = calculateDeductedRequirements();

        unitMap.forEach((u, uid) => {
            // 타겟 유닛은 유저가 직접 [최종 완료]를 누르게 하도록 자동머지에서 제외
            if (activeUnits.has(uid)) return;
            if (!u.parsedRecipe || u.parsedRecipe.length === 0) return;

            let netNeeded = reqMap.get(uid) || 0;
            if (netNeeded <= 0) return;

            let maxCraftable = 999;
            let canCraft = true;

            u.parsedRecipe.forEach(child => {
                if (child.id) {
                    let comp = completedUnits.get(child.id) || 0;
                    if (uid === '로리스완' && child.id === '낮까마귀') {
                        if (comp < 1) { canCraft = false; maxCraftable = 0; }
                    } else {
                        let possible = Math.floor(comp / child.qty);
                        if (possible < maxCraftable) maxCraftable = possible;
                        if (comp < child.qty) canCraft = false;
                    }
                }
            });

            if (u.parsedCost) {
                u.parsedCost.forEach(pc => {
                    if (pc.key === '갓오타' || pc.key === '메시브') {
                        let comp = completedUnits.get(pc.key) || 0;
                        let possible = Math.floor(comp / pc.qty);
                        if (possible < maxCraftable) maxCraftable = possible;
                        if (comp < pc.qty) canCraft = false;
                    }
                });
            }

            if (canCraft && maxCraftable > 0) {
                let mergeAmount = Math.min(maxCraftable, netNeeded);
                if (mergeAmount > 0) {
                    u.parsedRecipe.forEach(child => {
                        if (child.id && !(uid === '로리스완' && child.id === '낮까마귀')) {
                            completedUnits.set(child.id, (completedUnits.get(child.id) || 0) - (child.qty * mergeAmount));
                        }
                    });
                    if (u.parsedCost) {
                        u.parsedCost.forEach(pc => {
                            if (pc.key === '갓오타' || pc.key === '메시브') {
                                completedUnits.set(pc.key, (completedUnits.get(pc.key) || 0) - (pc.qty * mergeAmount));
                            }
                        });
                    }
                    completedUnits.set(uid, (completedUnits.get(uid) || 0) + mergeAmount);
                    merged = true;
                }
            }
        });
        loopCount++;
    } while (merged && loopCount < 30);
}

function consumeCompletedRecipe(uid, multiplier) {
    const u = unitMap.get(uid);
    if (!u) return;

    if (u.parsedRecipe) {
        u.parsedRecipe.forEach(child => {
            if (child.id) {
                if (uid === '로리스완' && child.id === '낮까마귀') return;

                let needed = child.qty * multiplier;
                let currentlyCompleted = completedUnits.get(child.id) || 0;
                let consumeAmount = Math.min(needed, currentlyCompleted);

                if (consumeAmount > 0) {
                    completedUnits.set(child.id, currentlyCompleted - consumeAmount);
                    needed -= consumeAmount;
                }

                if (needed > 0) {
                    consumeCompletedRecipe(child.id, needed);
                }
            }
        });
    }

    if (u.parsedCost) {
        u.parsedCost.forEach(pc => {
            if (pc.key === '갓오타' || pc.key === '메시브') {
                let needed = pc.qty * multiplier;
                let currentlyCompleted = completedUnits.get(pc.key) || 0;
                let consumeAmount = Math.min(needed, currentlyCompleted);
                if (consumeAmount > 0) {
                    completedUnits.set(pc.key, currentlyCompleted - consumeAmount);
                }
            }
        });
    }
}

window.completeUnit = function(uid) {
    const reqEl = document.getElementById(`d-req-${uid}`);
    const reqVal = reqEl ? parseInt(reqEl.innerText) : 0;

    if (reqVal > 0) {
        consumeCompletedRecipe(uid, reqVal);

        let current = completedUnits.get(uid) || 0;
        completedUnits.set(uid, current + reqVal);

        if (_currentHighlight) toggleHighlight(null);

        attemptAutoMerge();
        triggerHaptic();
        debouncedUpdateAllPanels();
    }
}

function renderActiveRoster() {
    const roster = document.getElementById('activeRoster');
    if(!roster) return;

    let html = '';
    activeUnits.forEach((qty, id) => {
        const u = unitMap.get(id);
        if(u) {
            html += `<div class="roster-tag" onclick="toggleUnitSelection('${id}')" style="border-color:${gradeColorsRaw[u.grade]}66;">
                <div style="width:20px;height:20px;border-radius:4px;overflow:hidden;flex-shrink:0;">
                    <img src="https://sldbox.github.io/site/image/ctg/${u.name}.png" style="width:100%;height:100%;object-fit:cover;clip-path:inset(1px);transform:scale(1.1);" onerror="this.style.display='none'">
                </div>
                <span style="color:${gradeColorsRaw[u.grade]}; font-weight:bold;">${u.name}</span>
                <span class="roster-qty">×${qty}</span>
            </div>`;
        }
    });

    if(html === '') roster.innerHTML = '<span style="color:var(--text-muted); font-size:0.85rem;">선택된 유닛 대기열 (검색 후 엔터)</span>';
    else roster.innerHTML = html;
}

let updateTimer = null;
function debouncedUpdateAllPanels() {
    if (updateTimer) cancelAnimationFrame(updateTimer);
    updateTimer = requestAnimationFrame(() => {
        updateMagicDashboard();
        updateEssence();
        updateTabsUI();
        updateTabContentUI();
        updateDeductionBoard();
        renderActiveRoster();
    });
}

function renderDeductionBoard() {
    if (!DOM.deductionBoard) return;

    const renderSlot = (id, name, grade, parentId) => {
        const color = gradeColorsRaw[grade] || "var(--text)";
        return `<div class="deduct-slot" id="d-slot-wrap-${id}" data-orig-parent="${parentId}" style="display:none;" onclick="toggleHighlight('${id}', event)">
            <div class="d-reason-wrap" id="d-reason-${id}" style="display:none;"></div>
            <div class="d-name" style="color: ${color}; cursor:help;" onclick="showRecipeTooltip('${id}', event, true); event.stopPropagation();">
                <span class="gtag" style="border-color:${color}44; color:${color}; margin-right:6px;">${grade}</span>${name}
            </div>
            <div class="d-bottom-area" style="padding: 10px 12px; display: flex; align-items: center; justify-content: space-between; background: rgba(0,0,0,0.4); border-top: 1px solid rgba(255,255,255,0.05);">
                <div class="req-text" style="font-family: var(--font-mono); font-size: 1.2rem; color: #fbbf24; font-weight: 900; text-shadow: 0 1px 3px rgba(0,0,0,1);">
                    <span id="d-req-${id}">0</span><span style="font-size:0.8rem; color:var(--text-sub); margin-left:4px;">필요</span>
                </div>
                <div id="craft-wrap-${id}"></div>
            </div>
        </div>`;
    };

    let h = '';
    h += `<div id="deduct-empty-msg" style="text-align:center; padding:40px 20px; color:var(--text-sub); font-weight:bold; width:100%; display:none; line-height:1.6; font-size:1.05rem;">
            <div style="font-size:2rem; margin-bottom:12px; color:var(--g-dim);">✨</div>
            목표 유닛을 선택하면<br>필요한 재료 목록이 이곳에 생성됩니다.
          </div>`;

    h += `<div class="deduct-group" id="group-special" style="border-color:rgba(251,191,36,0.3); background:linear-gradient(to bottom, rgba(30,25,10,0.6), rgba(15,10,5,0.8));">
            <div class="deduct-group-title" style="color:var(--grade-super); border-bottom-color:rgba(251,191,36,0.2);">
                <span style="color:var(--grade-super); text-shadow:0 0 10px var(--grade-super);">✦</span> 목표 유닛 및 직속 재료
            </div>
            <div class="deduct-grid" id="grid-special">
                ${renderSlot('갓오타', '갓오타', '레어', 'grid-special')}
                ${renderSlot('메시브', '메시브', '유니크', 'grid-special')}
                ${renderSlot('자동포탑', '자동포탑', '매직', 'grid-special')}
            </div>
          </div>`;

    const specialIds = ['갓오타', '메시브', '자동포탑'];
    let hiddenItems = Array.from(unitMap.values()).filter(u => u.grade === "히든" && !specialIds.includes(u.id));
    h += `<div class="deduct-group" id="group-hidden">
            <div class="deduct-group-title"><span style="color:var(--grade-hidden);">♦</span> 히든 등급 재료</div>
            <div class="deduct-grid" id="grid-hidden">
                ${hiddenItems.map(u => renderSlot(u.id, u.name, u.grade, 'grid-hidden')).join('')}
            </div>
          </div>`;

    const topGrades = ["슈퍼히든", "레전드", "헬", "유니크", "에픽", "레어"];
    let topItems = Array.from(unitMap.values()).filter(u => topGrades.includes(u.grade) && !specialIds.includes(u.id));
    topItems.sort((a, b) => GRADE_ORDER.indexOf(b.grade) - GRADE_ORDER.indexOf(a.grade));

    h += `<div class="deduct-group" id="group-top" style="margin-bottom:0;">
            <div class="deduct-group-title"><span style="color:var(--grade-legend);">▲</span> 레어 - 레전드 재료</div>
            <div class="deduct-grid" id="grid-top">
                ${topItems.map(u => renderSlot(u.id, u.name, u.grade, 'grid-top')).join('')}
            </div>
          </div>`;

    DOM.deductionBoard.innerHTML = h;
}

function updateDeductionBoard() {
    if (!DOM.deductionBoard) return;

    const { reqMap, baseMap, reasonMap, specialReq, baseSpecialReq, specialReason } = calculateDeductedRequirements();

    const directMaterials = new Set();
    activeUnits.forEach((qty, uid) => {
        const u = unitMap.get(uid);
        if(u && u.parsedRecipe) {
            u.parsedRecipe.forEach(pr => { if(pr.id) directMaterials.add(pr.id); });
        }
    });

    const updateSlot = (id, netReq, baseReq, reasons) => {
        const reqEl = document.getElementById(`d-req-${id}`), wrapEl = document.getElementById(`d-slot-wrap-${id}`), reasonContainer = document.getElementById(`d-reason-${id}`);
        if(reqEl && wrapEl) {

            // [개선] BaseReq(절대 지도)에 포함되어 있다면 슬롯 무조건 렌더링 (사라짐 방지)
            if (baseReq > 0) {
                wrapEl.style.display = 'flex';
                wrapEl.classList.add('is-visible');

                if (reasonContainer) {
                    if (reasons && reasons.size > 0 && netReq > 0) {
                        let rHtml = Array.from(reasons.entries()).map(([rootId, text]) =>
                            `<span class="d-reason-tag" onclick="toggleHighlight('${rootId}', event)">${text}</span>`
                        ).join('');
                        reasonContainer.innerHTML = rHtml;
                        reasonContainer.style.display = 'flex';
                    }
                    else { reasonContainer.style.display = 'none'; reasonContainer.innerHTML = ''; }
                }

                const isTarget = activeUnits.has(id);
                const isDirect = directMaterials.has(id);
                const isSpecial = (id === '갓오타' || id === '메시브' || id === '자동포탑');

                if(isTarget) wrapEl.style.order = "-999";
                else wrapEl.style.order = isSpecial ? "999" : "-1";

                let craftWrap = document.getElementById('craft-wrap-' + id);

                if (netReq > 0) {
                    // --- 활성 상태 (진행중) ---
                    wrapEl.classList.remove('is-completed');
                    wrapEl.classList.add('has-target');
                    reqEl.innerText = netReq;

                    if (craftWrap) {
                        const u = unitMap.get(id);
                        let deepComp = getDeepCompleted(id); // 하위 트리에 완료된 재료가 하나라도 있는지 딥스캔

                        if (isTarget) {
                            let isTargetReady = true;
                            if (u && u.parsedRecipe) {
                                u.parsedRecipe.forEach(pr => {
                                    if (pr.id) {
                                        let cId = pr.id;
                                        if (id === '로리스완' && cId === '낮까마귀') return;
                                        let comp = completedUnits.get(cId) || 0;
                                        if (comp < pr.qty * netReq) isTargetReady = false;
                                    }
                                });
                            }
                            if (u && u.parsedCost) {
                                u.parsedCost.forEach(pc => {
                                    if (pc.key === '갓오타' || pc.key === '메시브') {
                                        let comp = completedUnits.get(pc.key) || 0;
                                        if (comp < pc.qty * netReq) isTargetReady = false;
                                    }
                                });
                            }

                            if (isTargetReady) {
                                craftWrap.innerHTML = `<button class="btn-complete final-target" onclick="completeUnit('${id}'); event.stopPropagation();">✨ 최종 제작 완료</button>`;
                            } else {
                                craftWrap.innerHTML = `<button class="btn-complete" onclick="completeUnit('${id}'); event.stopPropagation();">✔ 완료</button>`;
                            }
                        } else {
                            // [오류] 해결: 스마트 은닉 로직 해제 (하위 재료가 진행중이어도 완료 버튼이 사라지지 않게 처리)
                            craftWrap.innerHTML = `<button class="btn-complete" onclick="completeUnit('${id}'); event.stopPropagation();">✔ 완료</button>`;
                        }
                    }
                } else {
                    // --- 비활성 상태 (Ghost/완료) ---
                    wrapEl.classList.add('is-completed');
                    wrapEl.classList.remove('has-target');
                    reqEl.innerText = '0';
                    if (craftWrap) {
                        craftWrap.innerHTML = `<span style="font-size:0.85rem; color:var(--g-dim); font-weight:bold; text-shadow:0 0 5px var(--g-faint); padding-right:4px;">✨ 완료됨</span>`;
                    }
                }

                if (isDirect || isTarget) {
                    const finalGrid = document.getElementById('grid-special');
                    if (finalGrid && wrapEl.parentElement !== finalGrid) finalGrid.appendChild(wrapEl);
                } else {
                    const origParentId = wrapEl.getAttribute('data-orig-parent');
                    const origParent = document.getElementById(origParentId);
                    if (origParent && wrapEl.parentElement !== origParent) origParent.appendChild(wrapEl);
                }

            } else {
                wrapEl.style.display = 'none';
                wrapEl.classList.remove('is-visible');
            }
        }
    };

    updateSlot('갓오타', specialReq.갓오타, baseSpecialReq.갓오타, specialReason.갓오타);
    updateSlot('메시브', specialReq.메시브, baseSpecialReq.메시브, specialReason.메시브);
    updateSlot('자동포탑', reqMap.get('자동포탑') || 0, baseMap.get('자동포탑') || 0, reasonMap.get('자동포탑'));

    const targetGrades = ["레어", "에픽", "유니크", "헬", "레전드", "히든", "슈퍼히든"];
    unitMap.forEach(u => {
        if(targetGrades.includes(u.grade) && u.id !== '자동포탑') {
            updateSlot(u.id, reqMap.get(u.id) || 0, baseMap.get(u.id) || 0, reasonMap.get(u.id));
        }
    });

    let hasAnyVisible = false;
    document.querySelectorAll('.deduct-group').forEach(group => {
        const visibleSlots = group.querySelectorAll('.deduct-slot.is-visible');
        if (visibleSlots.length === 0) group.style.display = 'none';
        else { group.style.display = 'block'; hasAnyVisible = true; }
    });

    if(_currentHighlight) {
        const deps = getDependencies(_currentHighlight);
        document.querySelectorAll('.deduct-slot').forEach(el => {
            const id = el.id.replace('d-slot-wrap-', '');
            if(deps.has(id)) el.classList.add('highlighted-tree');
            else el.classList.remove('highlighted-tree');
        });
    }

    const emptyMsg = document.getElementById('deduct-empty-msg');
    if (emptyMsg) {
        if (!hasAnyVisible) {
            emptyMsg.style.display = 'block';
        } else {
            emptyMsg.style.display = 'none';
        }
    }
}

function renderTabs(){
    if (!DOM.codexTabs) return;
    let h='';
    TAB_CATEGORIES.forEach((cat,idx)=>{
        h+=`<button id="tab-btn-${idx}" class="tab-btn" onclick="selectTab(${idx})">
                <span class="tab-sym" style="font-size:1.1rem; padding:2px 5px; border-radius:3px; background:rgba(0,0,0,0.3); border:1px solid var(--border-light); color:var(--text-sub);">${cat.sym}</span>
                <span>${cat.name}</span>
            </button>`;
    });
    DOM.codexTabs.innerHTML=h;
    updateTabsUI();
}

function updateTabsUI() {
    TAB_CATEGORIES.forEach((cat, idx) => {
        let hasSelected = false;
        activeUnits.forEach((qty, id) => { const u = unitMap.get(id); if(u && u.category === cat.key) hasSelected = true; });
        const btn = document.getElementById(`tab-btn-${idx}`);
        if(!btn) return;

        if(idx === _activeTabIdx) btn.classList.add('active'); else btn.classList.remove('active');
        if(hasSelected) btn.classList.add('has-active'); else btn.classList.remove('has-active');

        const sym = btn.querySelector('.tab-sym');
        if(sym) {
            if(hasSelected) {
                sym.style.color = 'var(--g)'; sym.style.borderColor = 'var(--g-border)'; sym.style.boxShadow = '0 0 5px var(--g-faint)'; sym.style.textShadow = '0 0 5px var(--g-glow)';
            } else {
                sym.style.color = 'var(--text-sub)'; sym.style.borderColor = 'var(--border-light)'; sym.style.boxShadow = 'none'; sym.style.textShadow = 'none';
            }
        }
    });
}

function formatRecipe(item, multiplier = 1, showSeparator = false) {
    if (!item.recipe || IGNORE_PARSE_RECIPES.includes(item.recipe)) return `<div style="color:var(--text-muted);font-size:0.85rem;">정보 없음</div>`;
    const wrapClass = showSeparator ? '' : 'recipe-vertical';
    const wrapStyle = showSeparator ? 'display:flex; flex-wrap:wrap; gap:6px; align-items:center;' : '';
    let html = `<div class="${wrapClass}" style="${wrapStyle}">`;
    item.recipe.split(/\+(?![^()]*\))/).forEach((part, index, arr) => {
        const match = part.trim().match(/^([^(\[]+)(?:\(([^)]+)\))?(?:\[(\d+)\])?/);
        if (match) {
            const rawKo = match[1].trim(), u = unitMap.get(getUnitId(rawKo));
            let condTxt = match[2] ? `(${match[2]})` : '';
            let baseQty = match[3] ? parseFloat(match[3]) : 1; let finalQty = baseQty * multiplier; let qtyTxt = `[${finalQty}]`;
            const color = u && gradeColorsRaw[u.grade] ? gradeColorsRaw[u.grade] : "var(--text)";
            html += `<div class="recipe-badge" style="color:${color}; border-color:${color}44;">${rawKo} <span class="badge-cond">${condTxt}${qtyTxt}</span></div>`;
        } else { html += `<div style="color:var(--text-sub); font-size:0.85rem; white-space:nowrap;">${part}</div>`; }
        if (showSeparator && index < arr.length - 1) { html += `<div style="color:var(--text-muted); font-size:0.9rem; font-weight:bold;">+</div>`; }
    });
    return html + '</div>';
}
function formatRecipeHorizontal(item, multiplier = 1) { return formatRecipe(item, multiplier, false); }
function formatRecipeTooltip(item, multiplier = 1) { return formatRecipe(item, multiplier, true); }

function selectTab(idx){
    _activeTabIdx=idx;
    updateTabsUI();
    renderCurrentTabContent();

    closeLineage();
    if (_jewelPanelOpen) closeJewelPanel();
}

function renderCurrentTabContent() {
    const catKey = TAB_CATEGORIES[_activeTabIdx].key;
    let items = Array.from(unitMap.values()).filter(u => isTargetGrade(u) && u.category === catKey);

    items.sort((a,b) => {
        const getOrder = (u) => {
            if (u.name === "아몬") return 100;
            if (u.name === "어두운목소리") return 99;
            if (u.name === "나루드") return 97;
            if (u.name === "유물") return 96;
            return 0;
        };
        let aOrder = getOrder(a);
        let bOrder = getOrder(b);
        if (aOrder !== bOrder && (aOrder > 0 || bOrder > 0)) {
            return bOrder - aOrder;
        }

        const aOne = isOneTime(a);
        const bOne = isOneTime(b);
        if (aOne && !bOne) return -1;
        if (!aOne && bOne) return 1;

        if(a.grade !== b.grade) return GRADE_ORDER.indexOf(b.grade) - GRADE_ORDER.indexOf(a.grade);
        return calculateTotalCostScore(b.cost) - calculateTotalCostScore(a.cost);
    });

    let h='<div style="display:flex;flex-direction:column;gap:4px;">';
    if (items.length === 0) h += `<div style="text-align:center; padding:30px; color:var(--text-sub); font-weight:bold; font-size:1.05rem;">해당 분류에 유닛이 없습니다.</div>`;

    items.forEach((item, index) => {
        let gradeHtml = `<span class="gtag" style="border-color:${gradeColorsRaw[item.grade]}44; color:${gradeColorsRaw[item.grade]};">${item.grade}</span>`;

        let rightControls = '';
        const lineageBtn = `<button id="btn-lineage-${item.id}" class="btn-lineage pulse" onclick="openLineage('${item.id}'); event.stopPropagation();">⎇ 계보</button>`;

        if (!isOneTime(item)) {
            rightControls = `<div class="uc-ctrl" onclick="event.stopPropagation()">
                ${lineageBtn}
                <div class="smart-stepper active-stepper">
                    <button id="btn-minus-${item.id}" onmousedown="startSmartChange('${item.id}', -1, 'active', event)" ontouchstart="startSmartChange('${item.id}', -1, 'active', event)">-</button>
                    <div class="ss-val" id="val-${item.id}">-</div>
                    <button id="btn-plus-${item.id}" onmousedown="startSmartChange('${item.id}', 1, 'active', event)" ontouchstart="startSmartChange('${item.id}', 1, 'active', event)">+</button>
                </div>
            </div>`;
        } else {
            rightControls = `<div class="uc-ctrl" onclick="event.stopPropagation()">
                ${lineageBtn}
            </div>`;
        }

        h+=`<div id="card-${item.id}" class="unit-card" style="animation-delay:${index * 0.03}s" onclick="toggleUnitSelection('${item.id}', 1)">
            <div class="uc-wrap">
                <div class="uc-thumb-box">
                    <img src="https://sldbox.github.io/site/image/ctg/${item.name}.png" alt="${item.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" style="width:100%;height:100%;object-fit:cover;clip-path:inset(1px);transform:scale(1.08);">
                    <div style="display:none;width:100%;height:100%;align-items:center;justify-content:center;color:${gradeColorsRaw[item.grade]};opacity:0.3;">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
                    </div>
                </div>
                <div class="uc-identity">
                    <div class="uc-grade">${gradeHtml}</div>
                    <div class="uc-name-row" style="color:${gradeColorsRaw[item.grade]};">${item.name}</div>
                </div>
                <div class="uc-recipe-col">${formatRecipeHorizontal(item)}</div>
                ${rightControls}
            </div>
        </div>`;
    });
    h+='</div>'; DOM.tabContent.innerHTML=h;

    updateTabContentUI();
}

function updateTabContentUI() {
    const catKey = TAB_CATEGORIES[_activeTabIdx].key;
    unitMap.forEach(item => {
        if(item.category !== catKey) return;
        const card = document.getElementById(`card-${item.id}`);
        if(!card) return;

        const isActive = activeUnits.has(item.id);
        const qty = activeUnits.get(item.id) || 0;

        if(isActive) card.classList.add('active'); else card.classList.remove('active');

        const lineageBtnEl = document.getElementById(`btn-lineage-${item.id}`);
        if(lineageBtnEl) {
            if(isActive) {
                lineageBtnEl.classList.remove('pulse');
                lineageBtnEl.classList.add('muted');
            } else {
                lineageBtnEl.classList.add('pulse');
                lineageBtnEl.classList.remove('muted');
            }
        }

        if(!isOneTime(item)) {
            const valEl = document.getElementById(`val-${item.id}`);
            if(valEl) valEl.innerText = isActive ? qty : '-';

            const btnMinus = document.getElementById(`btn-minus-${item.id}`);
            const btnPlus = document.getElementById(`btn-plus-${item.id}`);
            if(btnMinus) btnMinus.disabled = !isActive;
            if(btnPlus) btnPlus.disabled = !isActive;
        }
    });
}

function renderDashboardAtoms(){
    DOM.magicDashboard.innerHTML=`
        <div class="cost-slot total" id="slot-total-essence">
            <div class="cost-val" id="essence-total-val">0</div>
            <div class="cost-name">총 정수 코스트</div>
        </div>
        <div class="cost-slot" id="slot-coral">
            <div class="cost-val" id="val-coral" style="color:#FF6B6B;">0</div>
            <div class="cost-sub" id="sub-coral" style="font-size:0.75rem; color:var(--text-sub); margin:-4px 0 4px; height:12px; font-family:var(--font-mono); letter-spacing:1px; line-height:1;"></div>
            <div class="cost-name">코랄</div>
        </div>
        <div class="cost-slot" id="slot-aiur">
            <div class="cost-val" id="val-aiur" style="color:var(--grade-rare);">0</div>
            <div class="cost-sub" id="sub-aiur" style="font-size:0.75rem; color:var(--text-sub); margin:-4px 0 4px; height:12px; font-family:var(--font-mono); letter-spacing:1px; line-height:1;"></div>
            <div class="cost-name">아이어</div>
        </div>
        <div class="cost-slot" id="slot-zerus">
            <div class="cost-val" id="val-zerus" style="color:var(--grade-legend);">0</div>
            <div class="cost-sub" id="sub-zerus" style="font-size:0.75rem; color:var(--text-sub); margin:-4px 0 4px; height:12px; font-family:var(--font-mono); letter-spacing:1px; line-height:1;"></div>
            <div class="cost-name">제루스</div>
        </div>
        <div class="cost-slot" id="slot-hybrid">
            <div class="cost-val" id="val-hybrid" style="color:var(--g);">0</div>
            <div class="cost-sub" id="sub-hybrid" style="font-size:0.75rem; color:var(--text-sub); margin:-4px 0 4px; height:12px; font-family:var(--font-mono); letter-spacing:1px; line-height:1;"></div>
            <div class="cost-name">혼종</div>
        </div>
    `;
    dashboardAtoms.forEach(a=>{
        const isSkill = (a === "갓오타/메시브"), isMagic = !isSkill;
        const d=document.createElement('div');
        d.className='cost-slot'+(isMagic?' is-magic-slot':'')+(isSkill?' is-skill-slot':''); d.id=`vslot-${clean(a)}`;
        d.innerHTML=`<div class="cost-val"></div><div class="cost-name" id="name-${clean(a)}">${a}</div>`;
        DOM.magicDashboard.appendChild(d);
    });
}

function renderJewelMiniGrid(){
    const g=document.getElementById('jewelMiniGrid');
    if(!g || g.dataset.rendered) return;
    if (typeof JEWEL_DATABASE === 'undefined') return;
    g.dataset.rendered = '1';

    const url="https://sldbox.github.io/site/image/jw/";
    let h='';
    JEWEL_DATABASE.forEach((koArr) => {
        const kr=koArr[0], krLeg=koArr[1], krMyth=koArr[2], imgName=koArr[3]||kr;
        const c = typeof JEWEL_COLORS !== 'undefined' && JEWEL_COLORS[kr] ? JEWEL_COLORS[kr] : "#ffffff";
        const cA = c + '22';
        const hasMythic = krMyth && krMyth.trim() !== "";
        h += `<div class="jwm-item" style="--jw-color:${c};--jw-color-a:${cA};">
            <div class="jwm-img-wrap">
                <img src="${url}${imgName}.png" alt="${kr}" onerror="this.style.opacity='0'">
            </div>
            <div class="jwm-name">${kr}</div>
            <div class="jwm-stat legend"><span>${krLeg}</span></div>
            ${hasMythic ? `<div class="jwm-stat mythic"><span>✦ ${krMyth}</span></div>` : ''}
        </div>`;
    });
    g.innerHTML = h;
}

document.addEventListener('DOMContentLoaded', () => {
    try {
        document.documentElement.lang = 'ko'; document.documentElement.setAttribute('data-theme', 'dark');
        DOM.tabContent = document.getElementById('tabContent'); DOM.deductionBoard = document.getElementById('deductionBoard');
        DOM.codexTabs = document.getElementById('codexTabs'); DOM.magicDashboard = document.getElementById('magicDashboard');
        if (typeof UNIT_DATABASE === 'undefined') { console.error("[오류] 데이터베이스 로드 실패"); return; }

        UNIT_DATABASE.forEach((kArr) => { const g = kArr[1] || "매직", cat = kArr[2] || "테바테메"; unitMap.set(clean(kArr[0]), { id:clean(kArr[0]), name:kArr[0], grade:g, category:cat, recipe:kArr[3], cost:kArr[4] }); });

        initializeCacheEngine();

        renderDashboardAtoms();
        renderDeductionBoard();
        renderTabs();
        selectTab(0);
        debouncedUpdateAllPanels();

        setupSearchEngine();
        setupInitialView();

        let touchStartX = 0; let touchEndX = 0;
        const swipeArea = document.getElementById('tabContent');
        if(swipeArea) {
            swipeArea.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, {passive: true});
            swipeArea.addEventListener('touchend', e => {
                touchEndX = e.changedTouches[0].screenX;
                const diff = touchEndX - touchStartX;
                if (Math.abs(diff) > 70) {
                    if (diff > 0 && _activeTabIdx > 0) selectTab(_activeTabIdx - 1);
                    else if (diff < 0 && _activeTabIdx < TAB_CATEGORIES.length - 1) selectTab(_activeTabIdx + 1);
                }
            }, {passive: true});
        }

    } catch (err) { console.error("[오류] 넥서스 초기화 중 에러 발생:", err); }
});