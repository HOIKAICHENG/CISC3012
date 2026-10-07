window.NOTES_ZH = [
  {
    "title": "CISC3012 學習筆記：Chapter 1–3",
    "sections": [
      {
        "title": "本節提要",
        "html": "<p>本筆記依課程投影片整理，涵蓋文字、圖表、公式與例子。英文術語保留投影片原詞，方便對照考試用詞。</p>\n<p>課程主線：</p>\n<ol><li><strong>Chapter 1</strong>：AI 是什麼、能做什麼、怎樣做、風險在哪裡。結論是本課把 AI 當成 <strong>rational agent（理性智能體）</strong> 來學。</li><li><strong>Chapter 2</strong>：怎樣描述一個理性智能體（理性、性能量度、PEAS、環境性質、五種 agent program）。</li><li><strong>Chapter 3</strong>：實用系統多用 goal-based agent，用 <strong>搜尋樹</strong> 找出從初始狀態到目標的動作序列；本章學 <strong>uninformed search（盲目搜尋）</strong>。Informed / heuristic search 留到 Chapter 4。</li></ol>\n<hr>",
        "id": "c1-s1",
        "exam": false
      }
    ],
    "id": "c1"
  },
  {
    "title": "Chapter 1　Artificial Intelligence (AI)",
    "sections": [
      {
        "title": "1. 這章要回答的問題",
        "html": "<ul><li>What is AI?</li><li>What can AI do?</li><li>What ways to implement AI?</li><li>What can we imagine for AI?</li></ul>",
        "id": "c2-s1",
        "exam": false
      },
      {
        "title": "2. AI 簡史（投影片時間線）",
        "html": "<div class='table-wrap'><table><thead><tr><th>時期</th><th>年份</th><th>代表</th><th>要點</th></tr></thead><tbody><tr><td>Beginnings</td><td>1943</td><td>McCulloch &amp; Pitts，Thresholded Logic Unit</td><td>用閾值邏輯單元模擬神經元；可做 AND / OR / NOT</td></tr><tr><td></td><td>1957</td><td>Rosenblatt，Perceptron</td><td>輸入 × 權重，再經單元步階函數（unit step function）</td></tr><tr><td></td><td>1960</td><td>Widrow &amp; Hoff，Adaline</td><td>自適應線性單元</td></tr><tr><td>1st Neural Winter</td><td>1969</td><td>Minsky &amp; Papert，XOR Problem</td><td>單層感知器是線性分類器，解不了 XOR，神經網路研究進入低潮</td></tr><tr><td></td><td>1982</td><td>Werbos；其後 Rumelhart, Hinton, Williams</td><td>Multilayer Backprop：誤差反向傳播，隱藏層讓網路能學非線性</td></tr><tr><td></td><td>1986</td><td>LeCun 等</td><td>CNNs（卷積神經網路）</td></tr><tr><td></td><td>1989 / 1997</td><td>Schmidhuber 等</td><td>LSTMs</td></tr><tr><td>2nd Neural Winter</td><td>1995</td><td>Cortes &amp; Vapnik，SVMs</td><td>支持向量機興起，神經網路再次相對失勢</td></tr><tr><td>GPU Era</td><td>2006</td><td>Hinton 等，Deep Nets</td><td>深度網路回潮</td></tr><tr><td></td><td>2012</td><td>Krizhevsky, Sutskever, Hinton，AlexNet</td><td>GPU 訓練大型 CNN，深度學習成為主流</td></tr></tbody></table></div>\n<h3>線性可分：AND、OR 可以，XOR 不行</h3>\n<p>AND / OR 的四個點可以用一條直線分開（輸出 1 的點在線的一側，輸出 0 在另一側），所以單層線性單元做得到。</p>\n<p>XOR 真值表：</p>\n<div class='table-wrap'><table><thead><tr><th>I1</th><th>I2</th><th>out</th></tr></thead><tbody><tr><td>0</td><td>0</td><td>0</td></tr><tr><td>0</td><td>1</td><td>1</td></tr><tr><td>1</td><td>0</td><td>1</td></tr><tr><td>1</td><td>1</td><td>0</td></tr></tbody></table></div>\n<p>(0,1) 與 (1,0) 為 1，(0,0) 與 (1,1) 為 0。這四點 <strong>不是線性可分</strong> 的，一條直線分不開，需要 <strong>nonlinear</strong> 決策邊界。這就是 1969 年 XOR 問題、以及後來多層網路存在的原因。</p>",
        "id": "c2-s2",
        "exam": false
      },
      {
        "title": "3. 兩種實現 AI 的方式",
        "html": "<p>結構都是：<strong>INPUT →（中間的處理，AI 要填的部分）→ OUTPUT</strong>。</p>\n<h3>Model-based（模型法）</h3>\n<p>人先理解問題，寫出數學模型。投影片用生長模型當例子，由一個兩參數通式往下特化：</p>\n<p>通式：<span class=\"math\">V&#x27; = aV<sup>α</sup> - bV<sup>β</sup></span></p>\n<ul><li>若 <span class=\"math\">α = β</span>：Generalized Gompertz，<span class=\"math\">V&#x27; = aV<sup>α</sup> - bV<sup>α</sup>ln V</span><ul><li>再令 <span class=\"math\">α = 1</span>：Gompertz，<span class=\"math\">V&#x27; = aV - bVln V</span></li></ul></li><li>若 <span class=\"math\">β = 1</span>：Generalized Bertalanffy-logistic<ul><li><span class=\"math\">α &lt; 1</span>：<span class=\"math\">V&#x27; = aV<sup>α</sup> - bV</span></li><li><span class=\"math\">α = 1</span>：<span class=\"math\">V&#x27; = aV - bVln V</span></li><li><span class=\"math\">α &gt; 1</span>：<span class=\"math\">V&#x27; = aV - bV<sup>α</sup></span></li><li><span class=\"math\">α = 2</span>：Logistic，<span class=\"math\">V&#x27; = aV - bV<sup>2</sup></span></li><li><span class=\"math\">α = 2/3</span>：Bertalanffy，<span class=\"math\">V&#x27; = aV<sup>2/3</sup> - bV</span></li></ul></li></ul>\n<p>要點：模型由人設計。人如果不懂這個問題，就寫不出模型。</p>\n<h3>Data-based / Statistics（數據法，當前主流）</h3>\n<ul><li>Big Data</li><li>Machine Learning (AI)</li><li>最後仍然得到一個 Model</li></ul>\n<p>數據夠，就可以在人不完全理解機制的情況下，直接從數據學出模型。模型可以是一組邏輯規則（例如樹），也可以是神經網路。</p>",
        "id": "c2-s3",
        "exam": false
      },
      {
        "title": "4. AI 能做什麼，限度在哪裡",
        "html": "<ul><li><strong>應用範圍沒有限制</strong>：哪裡有人做事，哪裡就可能用 AI。</li><li>可以取代很多 <strong>labor-intensive（勞動密集）</strong> 工作。</li><li><strong>能力有限度</strong>：目前只達到人類智能的某一層次，不是全部，也不是全面超越。</li><li><strong>intelligence-intensive / knowledge-intensive（智力或知識密集）</strong> 的工作，人仍然做得比機器好。</li></ul>\n<h3>尖端水平（state of the art）例子</h3>\n<div class='table-wrap'><table><thead><tr><th>角色</th><th>例子</th><th>要記住的點</th></tr></thead><tbody><tr><td>技工 Mechanic</td><td>火星探測器</td><td>監控、偵測、診斷、修復（monitoring, detecting, diagnosing, recovering）</td></tr><tr><td>玩家 Player</td><td>Google DeepMind 下圍棋</td><td>可以勝過人類冠軍</td></tr><tr><td>司機 Driver</td><td>自動駕駛</td><td>例：電腦駕車橫跨美國約 2,850 英里</td></tr><tr><td>規劃者 Planner</td><td>物流規劃與排程</td><td>一次處理多達約 50,000 輛車、貨物與人員；規劃時間從數週降到數小時</td></tr><tr><td>外科醫生</td><td>機器人手術</td><td>用 computer vision 協助分析</td></tr><tr><td>視覺</td><td>圖像分類 vs 目標檢測</td><td>分類：整張圖一個標籤（CAT）。檢測：框出多個物體並分別標籤（CAT, DOG, DUCK）</td></tr><tr><td>教育場景</td><td>Classroom Attention Monitoring</td><td>偵測人臉、頭部姿態／視線角度，用來判斷是否在看前方</td></tr><tr><td>安防</td><td>Video Surveillance</td><td>在畫面中框出行人並畫出移動軌跡</td></tr><tr><td>幾何</td><td>3D Modelling</td><td>單目圖像 → 立體對齊、半稠密深度圖、相機姿態、g2o 圖優化 → 半稠密三維重建</td></tr><tr><td>語言</td><td>填字遊戲、機器翻譯</td><td>用大量舊題與多種資訊源解填字，可以勝過人類；翻譯例子：English ↔ Chinese ↔ Portuguese</td></tr><tr><td>生成式</td><td>Generative AI</td><td>由文字生成畫（例：「超現實主義：牛仔站在月球表面」）、讓靜態圖動起來、Deepfake 影片、對話</td></tr></tbody></table></div>\n<p>生成式例子還包括 websim.ai：用自然語言 prompt 叫 LLM agent 直接生成可互動的網頁原型（例如 Game Boy 模擬器），人再用後續 prompt 改按鈕位置、開機方式等。</p>",
        "id": "c2-s4",
        "exam": false
      },
      {
        "title": "5. 新工作：AI prompt engineering",
        "html": "<ul><li>不再只靠寫程式，改用自然語言（英語／中文）告訴 LLM 要生成什麼，並加上約束。</li><li>LLM 先給草稿／原型，人再打磨。打磨、想像、判斷好壞，是人擅長的部分。</li><li>把花在程式細節上的力氣，轉到想像與規格上。</li></ul>\n<p>程式抽象層次的演進：</p>\n<div class='table-wrap'><table><thead><tr><th>工具</th><th>轉換</th></tr></thead><tbody><tr><td>Assembler</td><td>組合語言 → 機器碼</td></tr><tr><td>Compiler</td><td>高階語言 → 機器碼</td></tr><tr><td>AI LLM agent</td><td>自然語言 → 機器碼</td></tr></tbody></table></div>\n<p>還要不要學寫程式？要。但不必再把全部精力放在語法與實作細節上，要更專注於想法、創意，以及軟件的性質與設計。</p>",
        "id": "c2-s5",
        "exam": false
      },
      {
        "title": "6. AI 的定義：沒有統一定義",
        "html": "<p>定義依觀點而異，整理成 2×2：縱軸 <strong>Thought / Behavior</strong>，橫軸 <strong>Human / Ideal</strong>。</p>\n<div class='table-wrap'><table><thead><tr><th></th><th>Human（像人）</th><th>Ideal（理性、理想）</th></tr></thead><tbody><tr><td><strong>Thought（思考）</strong></td><td>Systems that think like humans. Haugeland (1985)：讓電腦以完整、字面的意義「有心智地思考」。Bellman (1978)：把決策、解題、學習等與人類思考相關的活動自動化。</td><td>Systems that think rationally. Charniak &amp; McDermott (1985)：用計算模型研究心智能力。Winston (1992)：研究使感知、推理、行動成為可能的計算。</td></tr><tr><td><strong>Behavior（行為）</strong></td><td>Systems that act like humans. Kurzweil (1990)：製造出在人做來需要智力的功能上也能表現的機器。Rich &amp; Knight (1991)：研究如何讓電腦做那些目前人做得更好的事。</td><td>Systems that act rationally. Schalkoff (1990)：用計算過程解釋並模擬智能行為。Luger &amp; Stubblefield (1993)：自動化智能行為的計算機科學分支。</td></tr></tbody></table></div>\n<p>由此分成兩類系統：</p>\n<h3>Humanly：像人一樣想、像人一樣做</h3>\n<ul><li>要模仿人的方法。問題是：人自己常常也不知道大腦怎麼做。</li><li>人會做不理性的事，所以「像人」本身 <strong>不可靠</strong>。</li><li>課程結論：至少在目前，<strong>像人一樣建造 AI 是做不到的</strong>，因為沒有精確的 mind theory，我們對自己了解很少。</li></ul>\n<h3>Rationally：合理地想、合理地做</h3>\n<ul><li>不計較方法是否像人，只計較結果是否正確。</li><li>通常用數學與邏輯模型。</li><li><strong>可靠</strong> = 大多數時候正確且理性。</li><li>本課採用這條路，名稱是 <strong>Rational Agent</strong>，第 2 章正式展開。</li></ul>",
        "id": "c2-s6",
        "exam": false
      },
      {
        "title": "7. Turing Test（怎樣判斷「做得像人」）",
        "html": "<p>標準：透過電傳打字（teletype），也就是像 WhatsApp、WeChat 這種遠端文字對話。若提問的人分不出回答者是電腦還是人，就認為電腦表現出智能行為。</p>\n<p>「智能行為」要求在 <strong>所有認知任務（cognitive tasks）</strong> 上都達到人的水準。四項：</p>\n<ol><li><strong>Natural language processing</strong>：English ↔ 內部資料結構，用來和人溝通。</li><li><strong>Knowledge representation</strong>：Data ↔ knowledge，有效率地儲存與取出資訊。</li><li><strong>Automated reasoning（自動推理）</strong>：用已有知識推出問題的答案。</li><li><strong>Machine learning</strong>：題目裡帶有大量資訊；對話之後，要能回答先前沒見過的問題。</li></ol>\n<h3>Total Turing Test</h3>\n<p>普通 Turing Test 只測「腦」（文字問答）。Total Turing Test 還要身體，多兩項：</p>\n<ol><li><strong>Computer vision</strong>：看見、感知物體。</li><li><strong>Robotics</strong>：移動物體（手臂、腿、聲音），也就是行動。</li></ol>\n<p>核心困難仍然是：人的思考與行動在大腦裡對應什麼邏輯／演算法？目前不知道。</p>",
        "id": "c2-s7",
        "exam": false
      },
      {
        "title": "8. Rational Agent（本章給出的工作定義）",
        "html": "<p>Agent 是任何（通常是電腦）能夠：</p>\n<ul><li>從環境 <strong>perceive（感應）</strong> 輸入；</li><li>對環境輸出正確 <strong>actions</strong>。</li></ul>\n<p>它是 rational 的條件：給定 facts（輸入），它所做的 actions（輸出）是為了達成給定的 goals。中間的推理演算法由人設計，方法不限，通常是數學與邏輯。</p>\n<p>和第 1 節的總結構對上：Facts →（推理）→ Actions。AI 要填的就是中間那一塊。</p>",
        "id": "c2-s8",
        "exam": false
      },
      {
        "title": "9. AI 的風險",
        "html": "<ol><li><strong>假新聞</strong>：人寫一段 system prompt，模型可以接出一整篇看起來像新聞的虛構文章（投影片例子：安第斯山脈裡會說英語的獨角獸）。</li><li><strong>不可靠與對抗樣本</strong>：DNN 很會認圖，也很容易被騙。<ul><li>在 Stop 標誌上貼貼紙，系統把它讀成 Speed limit 45。</li><li>人類看成抽象噪點的圖，網路卻高信心地認成 King penguin 或 Starfish。</li></ul></li><li><strong>濫用</strong>：聲音 deepfake 曾被用來詐騙，新聞例子是 CEO 被騙走 243,000 美元（模仿 Joe Rogan 聲音的研究也一併作為聲音合成的例子）。</li><li><strong>對人的挑戰</strong>：<ul><li>企業用 AI 判斷裁員。</li><li>生成式模型可以從頭到腳生成寫實時裝模特，取代部分真人拍攝。</li></ul></li></ol>",
        "id": "c2-s9",
        "exam": false
      },
      {
        "title": "10. 為什麼用 AI、用在哪裡、會不會完全取代人",
        "html": "<p>為什麼用：人力、人口老化、成本、危險環境下的安全、專業性。</p>\n<p>用在哪裡：有人的地方就有需求；尤其是大量重複工作與大數據。</p>\n<p>目的：取代或減輕人類勞動。</p>\n<p>會不會完全取代？不會完全取代，但會大幅取代，主要落在勞動密集工作。</p>\n<p>英國國家統計局（BBC 圖）中，被自動化取代機率高的多是勞動密集職位，低的多是知識密集職位：</p>\n<div class='table-wrap'><table><thead><tr><th>較高（勞動密集）</th><th>機率</th><th>較低（知識密集）</th><th>機率</th></tr></thead><tbody><tr><td>Waiters</td><td>73%</td><td>Dental practitioners</td><td>21%</td></tr><tr><td>Shelf fillers</td><td>72%</td><td>Secondary school teachers</td><td>21%</td></tr><tr><td>Elementary sales</td><td>71%</td><td>Senior professionals in education</td><td>21%</td></tr><tr><td>Bar staff</td><td>71%</td><td>Higher education teachers</td><td>20%</td></tr><tr><td>Kitchen and catering assistants</td><td>69%</td><td>Medical practitioners</td><td>18%</td></tr></tbody></table></div>\n<p>投影片把這個對比收成兩個角色：</p>\n<ul><li>Labor intensive：例如 Programmer（實作、重複編碼更容易被工具吃掉）</li><li>Intelligence or knowledge intensive：例如 System analyst（分析、判斷、定義問題）</li></ul>\n<p>另一個類比：人力車 → 汽車。技術取代的是舊的勞動方式，人轉去操作更高一層的系統。</p>",
        "id": "c2-s10",
        "exam": false
      },
      {
        "title": "11. 本章總結：AI 程式 vs 傳統演算法",
        "html": "<div class='table-wrap'><table><thead><tr><th></th><th>傳統程式</th><th>AI 程式</th></tr></thead><tbody><tr><td>本質</td><td>program = algorithm = logic</td><td>直接從數據學習／生成</td></tr><tr><td>設計者</td><td>人</td><td>數據 + 學習過程</td></tr><tr><td>人不會解時</td><td>演算法也寫不出來</td><td>只要有數據，可以在人不完全理解的情況下解題</td></tr><tr><td>產物形式</td><td>人寫的邏輯</td><td>邏輯規則（樹）或神經網路</td></tr></tbody></table></div>\n<hr>",
        "id": "c2-s11",
        "exam": false
      }
    ],
    "id": "c2"
  },
  {
    "title": "Chapter 2　Intelligent Agents",
    "sections": [
      {
        "title": "1. Agent 是什麼",
        "html": "<p>Agent 可以是人，也可以是機器人。它：</p>\n<ul><li>用 <strong>sensors</strong> 感知環境 → 輸入，叫做 <strong>percepts</strong></li><li>用 <strong>actuators</strong> 作用於環境 → 輸出，叫做 <strong>actions</strong></li></ul>\n<p>圖的四塊：Environment、Percepts（Input）、中間的 <strong>?</strong>（Processing）、Actions（Output）。</p>\n<p><strong>AI 要填的就是那個 ?。</strong></p>",
        "id": "c3-s1",
        "exam": false
      },
      {
        "title": "2. 貫穿全課的例子：Vacuum-cleaner world（真空吸塵世界）",
        "html": "<p>兩個格子 A、B。</p>\n<p>Percepts：</p>\n<ul><li>自己在哪一格（A 或 B）</li><li>當前格是 Clean 還是 Dirty</li></ul>\n<p>Actions：</p>\n<ul><li>Move left（L）</li><li>Move right（R）</li><li>Suck（S）</li><li>Do nothing / NoOp（N）</li></ul>",
        "id": "c3-s2",
        "exam": false
      },
      {
        "title": "3. 「?」不能用查找表實現",
        "html": "<p>最簡單的想法：把每一種可能的 percept 組合對到一個動作，做成 lookup table。</p>\n<p>感知序列可以任意長，組合是無限的，表永遠寫不完，實際上造不出來。</p>\n<p>所以 ? 要用 <strong>agent program</strong>（演算法、程式碼）來實現，用程式取代那張無限的表。</p>",
        "id": "c3-s3",
        "exam": false
      },
      {
        "title": "4. 做 agent program 之前要先定三件事",
        "html": "<ol><li>Concept of rationality（什麼叫理性）</li><li>Performance measure（怎樣打分）</li><li>Task environment（任務環境）</li></ol>\n<h3>理性與傳統程式的差別</h3>\n<p>傳統程式：人寫出正確演算法 → 動作正確。</p>\n<p>Agent / AI 程式：演算法本身可能是學出來的，人未必能事先保證它正確。所以改為 <strong>只檢查輸出</strong>：用 performance measure 看動作產生的結果。結果正確，這個 agent 就是 rational。</p>\n<h3>Performance measure</h3>\n<p>一個函數 <span class=\"math\">P</span>，根據結果判斷 agent 有多成功，例如 90% 或 30%。</p>\n<p>鏈條：</p>\n<p>Percepts → agent (?) → actions → 環境進入新結果 → <strong>Score = P(Result)</strong>，而 Result = action(Env)。</p>\n<p>分數高，動作就是可取的（desirable），agent 就是在正確地、理性地做事。<span class=\"math\">P</span> 必須按應用目標來設計。</p>\n<p>吸塵例子：目標是地板變乾淨。無論中間怎麼走，最後地板乾淨，這個 agent 才算理性。左右來回走卻不清掃，分數低，就不理性。</p>\n<h3>理性取決於四件事</h3>\n<ol><li><strong>Performance measure <span class=\"math\">P</span></strong>：成功的標準。</li><li><strong>Prior knowledge of the environment</strong>：事先知道環境是什麼樣、可能有哪些 percept。</li><li><strong>Actions</strong>：它實際能做哪些動作。</li><li><strong>Percept sequence to date（到目前為止的感知序列，也就是記憶）</strong>。</li></ol>\n<p>缺任何一項，都不能判斷某個動作算不算理性。理性是相對於這四項而言的，不是絕對的。</p>\n<h3>把吸塵 agent 按這四項寫完整</h3>\n<ol><li><strong>P</strong>：跑 10,000 個 time step；每步、每一格乾淨得 1 分。兩格，滿分 <span class=\"math\">10000 × 2 = 20000</span>。</li><li><strong>先驗知識</strong>：環境地理只有 2 格；percept 是 (Location, Clean or Dirty)。</li><li><strong>動作</strong>：Left, Right, Suck, NoOp，以及這些動作對世界的效果。</li><li><strong>當前感知與感知序列</strong>：現在在哪、這格有沒有灰。若兩格已經乾淨一段時間，記憶讓它可以選 NoOp，而不是繼續空轉。</li></ol>\n<p>在這四項之下，這個 agent 與其性能量度是匹配的，因此是 rational。</p>",
        "id": "c3-s4",
        "exam": false
      },
      {
        "title": "5. Task environment 與 PEAS",
        "html": "<p>理性 agent 是為某個環境設計的。描述一個任務環境用 <strong>PEAS</strong>：</p>\n<div class='table-wrap'><table><thead><tr><th>字母</th><th>含義</th><th>問的問題</th></tr></thead><tbody><tr><td><strong>P</strong></td><td>Performance measure</td><td>怎樣算成功</td></tr><tr><td><strong>E</strong></td><td>Environment</td><td>領域知識、它要面對的世界</td></tr><tr><td><strong>A</strong></td><td>Actuators</td><td>能輸出什麼動作</td></tr><tr><td><strong>S</strong></td><td>Sensors</td><td>能感知什麼</td></tr></tbody></table></div>\n<h3>自動計程車（automated taxi driver）</h3>\n<p><strong>P</strong> 要同時考慮：到達正確目的地、省油、縮短時間與費用、少違規、安全、舒適，以及圖中的 maximize profits。沒有單一指標，後面 utility 就是為了處理這種多目標。</p>\n<p><strong>E</strong>：各種道路、交通燈、其他車輛、行人、走失的動物、道路施工、警車、說不同語言的乘客。</p>\n<p><strong>A</strong>：方向盤（steering）、油門（accelerator）、煞車（brake）、轉向燈（signal）、喇叭（horn）、用來和乘客溝通的 display。</p>\n<p><strong>S</strong>：偵測其他車輛與路況的攝影機、聲納；speedometer、GPS、odometer、accelerometer、引擎感測器、keyboard（與乘客互動）。</p>\n<p>PEAS 表（Figure 2.4） compact 版：</p>\n<div class='table-wrap'><table><thead><tr><th>Agent</th><th>Performance</th><th>Environment</th><th>Actuators</th><th>Sensors</th></tr></thead><tbody><tr><td>Taxi driver</td><td>Safe, fast, legal, comfortable trip, maximize profits</td><td>Roads, other traffic, pedestrians, customers</td><td>Steering, accelerator, brake, signal, horn, display</td><td>Cameras, sonar, speedometer, GPS, odometer, accelerometer, engine sensors, keyboard</td></tr></tbody></table></div>",
        "id": "c3-s5",
        "exam": false
      },
      {
        "title": "6. 環境的 6 對性質（12 種類型）",
        "html": "<h3>(1) Fully observable vs Partially observable</h3>\n<ul><li><strong>Fully</strong>：感測器能拿到世界的完整狀態。吸塵機若同時知道兩格是否乾淨，就是 fully。</li><li><strong>Partially</strong>：只能看到局部。只有「當前格有沒有灰」的感測器，就不知道另一格。</li></ul>\n<h3>(2) Deterministic vs Stochastic（另有 Strategic）</h3>\n<ul><li><strong>Deterministic</strong>：下一狀態完全由當前狀態 + agent 的動作決定。</li><li><strong>Stochastic</strong>：有雜訊或觀察不到的因素，下一狀態不確定。計程車是 stochastic。</li><li><strong>Strategic</strong>：環境裡其他 agent 的行為不確定，但除此之外是確定的。棋鐘象棋、撲克屬於這一類（表中寫 Strategic，不是 Stochastic）。雙陸棋有骰子，所以是 Stochastic。</li></ul>\n<h3>(3) Episodic（獨立事件）vs Sequential</h3>\n<ul><li>一個 <strong>episode</strong> = 一次「感知 + 動作」。</li><li><strong>Episodic</strong>：這次動作的好壞不依賴別的 episode，彼此獨立，比較簡單。</li><li><strong>Sequential</strong>：當前動作會影響以後所有決策。棋、組裝都是 sequential。</li></ul>\n<h3>(4) Static vs Dynamic（另有 Semi）</h3>\n<ul><li><strong>Dynamic</strong>：環境自己會隨時間變，agent 還在想的時候世界已經變了。</li><li><strong>Static</strong>：不會自己變。</li><li><strong>Semi</strong>：環境狀態本身不變，但成績和時間有關（例如有棋鐘的棋、圖像分析要在時限內做完）。</li></ul>\n<h3>(5) Discrete vs Continuous</h3>\n<ul><li><strong>Discrete</strong>：percept 和 action 的個數有限且分得清。例如 2 格、乾淨或髒。</li><li><strong>Continuous</strong>：量在實數區間裡連續變化，例如 0 到 1 之間還有無窮多個實數。計程車的速度、方向是 continuous。</li></ul>\n<h3>(6) Single agent vs Multiagent</h3>\n<ul><li>填字：single。</li><li>下棋：兩個 agent，而且是 <strong>competitive（競爭式）</strong>。</li><li>自動計程車：multi，而且是 <strong>cooperative（合作式）</strong>，例如互相避撞。</li></ul>\n<h3>環境例子總表（Figure 2.6，考試常考）</h3>\n<div class='table-wrap'><table><thead><tr><th>Task environment</th><th>Observable</th><th>Deterministic</th><th>Episodic</th><th>Static</th><th>Discrete</th><th>Agents</th></tr></thead><tbody><tr><td>Crossword puzzle</td><td>Fully</td><td>Deterministic</td><td>Sequential</td><td>Static</td><td>Discrete</td><td>Single</td></tr><tr><td>Chess with a clock</td><td>Fully</td><td>Strategic</td><td>Sequential</td><td>Semi</td><td>Discrete</td><td>Multi</td></tr><tr><td>Poker</td><td>Partially</td><td>Strategic</td><td>Sequential</td><td>Static</td><td>Discrete</td><td>Multi</td></tr><tr><td>Backgammon</td><td>Fully</td><td>Stochastic</td><td>Sequential</td><td>Static</td><td>Discrete</td><td>Multi</td></tr><tr><td>Taxi driving</td><td>Partially</td><td>Stochastic</td><td>Sequential</td><td>Dynamic</td><td>Continuous</td><td>Multi</td></tr><tr><td>Medical diagnosis</td><td>Partially</td><td>Stochastic</td><td>Sequential</td><td>Dynamic</td><td>Continuous</td><td>Single</td></tr><tr><td>Image analysis</td><td>Fully</td><td>Deterministic</td><td>Episodic</td><td>Semi</td><td>Continuous</td><td>Single</td></tr><tr><td>Part-picking robot</td><td>Partially</td><td>Stochastic</td><td>Episodic</td><td>Dynamic</td><td>Continuous</td><td>Single</td></tr><tr><td>Refinery controller</td><td>Partially</td><td>Stochastic</td><td>Sequential</td><td>Dynamic</td><td>Continuous</td><td>Single</td></tr><tr><td>Interactive English tutor</td><td>Partially</td><td>Stochastic</td><td>Sequential</td><td>Dynamic</td><td>Discrete</td><td>Multi</td></tr></tbody></table></div>\n<p>記憶線索：</p>\n<ul><li>只有填字是「全知 + 確定 + 靜態 + 離散 + 單人」，但是 sequential（前面填的字影響後面）。</li><li>圖像分析是少數 episodic 的例子：每張圖可以獨立判斷。</li><li>撲克 partially 是因為看不到對手的牌；雙陸棋 fully 但 stochastic 是因為骰子。</li><li>互動英語導師雖然是教學，表上仍是 Multi（學生也是 agent）。</li></ul>\n<p>第 3 章的搜尋 agent 只能舒服地工作在最容易的那一端：<strong>Static、Fully observable、Discrete、Deterministic</strong>。</p>",
        "id": "c3-s6",
        "exam": false
      },
      {
        "title": "7. 五種 agent program",
        "html": "<p>由簡單到能處理更難的環境：</p>\n<ol><li>Simple reflex agents</li><li>Model-based reflex agents</li><li>Goal-based agents</li><li>Utility-based agents</li><li>Learning agents</li></ol>\n<h3>7.1 Simple reflex agents</h3>\n<p>只用 <strong>condition-action rules</strong>（也叫 production rules），形式是 if … then …。</p>\n<pre><code>function SIMPLE-REFLEX-AGENT(percept) returns action\n    static: rules\n    state  ← INTERPRET-INPUT(percept)     // percept → 內部表示：「世界現在是什麼樣」\n    rule   ← RULE-MATCH(state, rules)\n    action ← RULE-ACTION[rule]            // 「我現在該做什麼」\n    return action</code></pre>\n<p>結構：Sensors → What the world is like now →（對照 condition-action rules）→ What action I should do now → Actuators。沒有記憶。</p>\n<p>吸塵規則例子：</p>\n<div class='table-wrap'><table><thead><tr><th>Percept</th><th>Action</th></tr></thead><tbody><tr><td>[A, Clean]</td><td>Right</td></tr><tr><td>[A, Dirty]</td><td>Suck</td></tr><tr><td>[B, Clean]</td><td>Left</td></tr><tr><td>[B, Dirty]</td><td>Suck</td></tr></tbody></table></div>\n<p>特點：效率高，適用範圍窄。規則常常無法明確寫出。<strong>只在 fully observable 的環境能正常工作</strong>（例如能看到整盤棋的棋盤）。部分可觀察時，只看當前一下會做錯。</p>\n<h3>7.2 Model-based reflex agents</h3>\n<p>世界若 partially observable，就要靠 <strong>內部狀態</strong> 記住感知歷史，用它補上現在看不到的部分。</p>\n<p>需要兩種知識，合起來就是 <strong>model</strong>：</p>\n<ol><li>How the world evolves independently of the agent（世界自己怎麼變）</li><li>How the agent’s actions affect the world（我的動作會怎樣改變世界）</li></ol>\n<pre><code>function REFLEX-AGENT-WITH-STATE(percept) returns action\n    static: state, rules\n    state  ← UPDATE-STATE(state, percept)\n    rule   ← RULE-MATCH(state, rules)\n    action ← RULE-ACTION[rule]\n    state  ← UPDATE-STATE(state, action)   // 用「動作的效果」再更新記憶\n    return action</code></pre>\n<p>一句話：這個 agent <strong>有知識／有記憶（internal state）</strong>。投影片把這塊 model 對應到 system，也可以類比人腦。</p>\n<h3>7.3 Goal-based agents</h3>\n<p>在內部狀態之上再加一個 <strong>goal</strong>。理性／正確的判斷標準變成：所選動作是否朝目標前進。選擇依據是當前內部狀態 + 當前 percept。</p>\n<p>圖：從狀態問「如果我做動作 A，世界會變成什麼樣」，再看那個未來狀態是不是更接近 Goals。</p>\n<p>搜尋樹上，S0 經 A/B/C 到 S1/S2/S3，再問哪一條能到 G。很多動作要逐一檢查，所以 <strong>比 reflex agent 慢</strong>。實用系統仍多用它，因為 reflex 只夠非常簡單的應用。第 3 章就是在實現這種 agent。</p>\n<h3>7.4 Utility-based agents</h3>\n<p>只有「到不到目標」不夠，因為很多條路都能到目標，有的好、有的差。</p>\n<ul><li>Goal = 成功與否（有沒有吃飽）</li><li>Utility = 成功的程度（這餐讓我有多滿意）</li></ul>\n<p>食堂：便宜但難吃。酒店：貴但好吃。目標都是「吃飽」，utility 按錢包裡的錢做取捨。</p>\n<p>Utility 是把一個 <strong>state 映射成實數</strong> 的函數，也就是 Score = P(Result) 那一層。圖上三條路的效用可以是 0.7、0.4、0.6，於是選 0.7 那條，即使三條都能到 G。</p>\n<p>兩個好處：</p>\n<ol><li><strong>目標互相衝突、不能全達成</strong> 時，utility 給出合適的折衷。</li><li><strong>多個目標都沒有把握一定達成</strong> 時，utility 提供決策方法：選效用更高的那個。</li></ol>\n<h3>7.5 Learning agents</h3>\n<p>程式寫完當下未必就完美，會做錯。它從環境的 <strong>feedback</strong> 學習，調整以後的決策，使同一個問題下次做得更好。</p>\n<p>這比前四種更難：必須事先把學習能力寫進程式，用 machine learning。</p>\n<p>圖上可見的部分：有一個 <strong>performance standard（性能標準）</strong>，<strong>Critic（評論器）</strong> 拿感測結果和標準比較，產生 feedback，用來改進 agent。</p>\n<p>五種的遞進可以記成：</p>\n<div class='table-wrap'><table><thead><tr><th>類型</th><th>多出來的東西</th><th>能處理的情況</th></tr></thead><tbody><tr><td>Simple reflex</td><td>if-then</td><td>完全可觀察、規則寫得出</td></tr><tr><td>Model-based reflex</td><td>內部狀態 + 世界模型</td><td>部分可觀察</td></tr><tr><td>Goal-based</td><td>目標 + 對未來的考慮</td><td>要規劃動作序列</td></tr><tr><td>Utility-based</td><td>效用函數</td><td>多條路都能達標，要選較好的；目標衝突</td></tr><tr><td>Learning</td><td>從反饋中改自己</td><td>一開始不完美，要越做越好</td></tr></tbody></table></div>\n<hr>",
        "id": "c3-s7",
        "exam": false
      }
    ],
    "id": "c3"
  },
  {
    "title": "Chapter 3　Rational Agent by Searching",
    "sections": [
      {
        "title": "1. 為什麼用搜尋",
        "html": "<p>多數實用問題不用 reflex agent（快，但只適合極簡單的應用）。實用上用 <strong>goal-based</strong>（或 utility-based）agent，它可以實現成一棵 <strong>search tree</strong>。</p>\n<p>給定：</p>\n<ul><li>初始狀態 S（來自 percept）</li><li>目標狀態 G（來自 objectives），G 也可以是一組狀態</li><li>一組可做的動作，例如 up、left、down</li></ul>\n<p>目標寫成：</p>\n<p><strong>Goal = Actions(Initial state)</strong></p>\n<p>也就是找出一串動作，使初始狀態變成目標狀態。</p>",
        "id": "c4-s1",
        "exam": false
      },
      {
        "title": "2. 三步構造",
        "html": "<ol><li><strong>Goal formulation</strong>：先定義目標狀態集合 G。</li><li><strong>定義 Actions</strong>：動作是算子／函數，造成世界狀態之間的轉移。例如 up 把 S 變成另一個狀態。</li><li><strong>Problem formulation</strong>：Initial state + Actions + Goal states = 一棵搜尋樹。</li></ol>\n<p>搜尋樹 = {States, Actions}。這棵樹就是 rational agent 的 agent program 要搜的東西。</p>\n<p>小問題（例如 100 個節點）可以事先把所有狀態列出來。大問題（例如 10 億個節點）不行，必須在執行時生成：</p>\n<p><strong>新狀態 = action(舊狀態)</strong></p>\n<p>例如 <code>right([1,0,0]) → [0,1,0]</code>，以及 <code>A = up(S)</code>、<code>B = left(S)</code>、<code>C = right(S)</code>。</p>\n<h3>Solution（解）</h3>\n<p>到達同一個 G 往往有很多條路徑。在一個節點上有多個選擇時，agent 檢查不同的動作序列，選最好的那條。</p>\n<p>最好的那條是一個動作列表，叫做 <strong>solution</strong>。例如 <code>{up, left}</code>。</p>",
        "id": "c4-s2",
        "exam": false
      },
      {
        "title": "3. 這種 agent 適合的環境",
        "html": "<p>搜尋在做問題形式化與求解時，假設世界具有：</p>\n<div class='table-wrap'><table><thead><tr><th>性質</th><th>對搜尋的意義</th></tr></thead><tbody><tr><td>Static</td><td>規劃期間環境不變，不用邊算邊追變化</td></tr><tr><td>Fully observable</td><td>agent 知道自己的初始狀態</td></tr><tr><td>Discrete</td><td>動作個數有限，可以逐個定義</td></tr><tr><td>Deterministic</td><td>每個動作的效果已知且唯一。<code>up: S → A</code>，不會忽然變成別的結果</td></tr></tbody></table></div>\n<p>因此它處理的是最容易的那一類環境。後面「部分資訊的問題」就是在放寬這些假設。</p>",
        "id": "c4-s3",
        "exam": false
      },
      {
        "title": "4. Well-defined problem：四個組成",
        "html": "<p>一個問題由四樣東西定義：</p>\n<ol><li><strong>Initial state</strong>：agent 從哪裡開始。</li><li><strong>Successor function</strong>：所有可能動作。對一個狀態施加後得到後繼狀態。<ul><li>這兩項合起來定義 <strong>state space（狀態空間）</strong> = 從初始狀態能到達的全部狀態，也就是整棵搜尋樹。</li><li><strong>path</strong>：狀態空間裡的任一動作序列，例如 <code>{up, left}</code>，把一個狀態帶到另一個狀態。</li></ul></li><li><strong>Goal test</strong>：對「當前狀態」做的測試，判斷是不是已經在目標裡。<ul><li>為什麼不直接列出 goal states？因為目標有時只用性質描述，列不盡。</li><li>國際象棋：下一步能吃掉對方的王，無論對方怎麼走，都算贏。無法事先寫出每一個這樣的棋盤。</li></ul></li><li><strong>Path cost function <span class=\"math\">g</span></strong>：給每條路徑一個數值代價，就是性能量度。<ul><li>通常 <span class=\"math\">g</span> = 路徑上各步 step cost 之和。</li></ul></li></ol>\n<p><strong>解</strong>：從初始狀態走到某個通過 goal test 的狀態的一條路徑。</p>\n<p><strong>最優解（optimal solution）</strong>：所有解裡路徑代價最低的那條。</p>",
        "id": "c4-s4",
        "exam": false
      },
      {
        "title": "5. 節點、擴展、邊緣、隊列",
        "html": "<h3>搜尋策略的共同骨架</h3>\n<ul><li><strong>Expand（擴展）</strong>：選一個節點，對它套用 successor function，生成一組新狀態。例：S → {A, B, C}，A → G，B → G。</li><li>第一個選擇若不對，其餘選項留著以後再查。</li><li>所有搜尋方法都是這個骨架。差別只在：<strong>下一個擴展哪一個節點。</strong></li><li>選得靠近目標 → 做的功少 → 更快。</li></ul>\n<h3>術語</h3>\n<div class='table-wrap'><table><thead><tr><th>術語</th><th>意思</th></tr></thead><tbody><tr><td>Expanding</td><td>對當前狀態套 successor function，產生新狀態</td></tr><tr><td>Leaf node / Terminal</td><td>沒有後繼的狀態（例如已是 G），或還沒被擴展的節點</td></tr><tr><td>Fringe</td><td>尚未擴展的葉節點（unexpanded leaf nodes）</td></tr></tbody></table></div>\n<h3>一個節點的五個欄位</h3>\n<ol><li><strong>STATE</strong>：它在狀態空間裡是哪個狀態</li><li><strong>PARENT-NODE</strong>：它由哪個節點生成</li><li><strong>ACTION</strong>：對父節點施加了哪個動作才生成它</li><li><strong>PATH-COST</strong>：從初始狀態到自己的代價 <span class=\"math\">g(n)</span></li><li><strong>DEPTH</strong>：從初始狀態沿路徑走了多少步</li></ol>\n<p>例子：某節點 STATE 是一個 8-puzzle 盤面，ACTION = right，DEPTH = 6，PATH-COST = 6（每步代價為 1 時，代價等於深度）。</p>\n<h3>Queue</h3>\n<p>Fringe 用一個 <strong>queue</strong> 組織起來。每種搜尋策略都用隊列，差別是插入與取出的順序（FIFO、LIFO，或按代價排序）。</p>",
        "id": "c4-s5",
        "exam": false
      },
      {
        "title": "6. 三個例題（一定要會自己重寫 formulation）",
        "html": "<h3>6.1 Vacuum world</h3>\n<p>8 個狀態 = 2 個位置 × A 乾淨與否 × B 乾淨與否。投影片編號：</p>\n<div class='table-wrap'><table><thead><tr><th>編號</th><th>代理人位置</th><th>A</th><th>B</th><th>是否目標</th></tr></thead><tbody><tr><td>1</td><td>A（左）</td><td>Dirty</td><td>Dirty</td><td></td></tr><tr><td>2</td><td>B（右）</td><td>Dirty</td><td>Dirty</td><td></td></tr><tr><td>3</td><td>A</td><td>Dirty</td><td>Clean</td><td></td></tr><tr><td>4</td><td>B</td><td>Dirty</td><td>Clean</td><td></td></tr><tr><td>5</td><td>A</td><td>Clean</td><td>Dirty</td><td></td></tr><tr><td>6</td><td>B</td><td>Clean</td><td>Dirty</td><td></td></tr><tr><td>7</td><td>A</td><td>Clean</td><td>Clean</td><td>目標</td></tr><tr><td>8</td><td>B</td><td>Clean</td><td>Clean</td><td>目標</td></tr></tbody></table></div>\n<ul><li>Initial state：8 個裡任何一個</li><li>Actions：4 個，left, right, suck, noOp</li><li>Goal：清掉所有灰塵；goal states = {7, 8}</li><li>Path cost：每步 1，noOp 為 0</li><li>狀態數：8</li></ul>\n<p>狀態圖上的轉移：L、R 在兩格之間移動（走到牆時停在原地，圖上是自環），S 清掉當前所在格的灰。</p>\n<h3>6.2 The 8-puzzle</h3>\n<ul><li><strong>States</strong>：8 塊牌與 1 個空格在 9 個位置上的擺法</li><li><strong>Initial state</strong>：狀態空間裡任何一個狀態。投影片起始例：</li></ul>\n<pre><code>7  2  4\n5     6\n8  3  1</code></pre>\n<ul><li><strong>Successor function</strong>：空格 Left、Right、Up、Down（也就是把空格旁的牌移進空格）</li><li><strong>Goal test</strong>：當前盤面與給定的目標配置完全相同</li><li><strong>Path cost</strong>：每步 1，所以路徑代價就是路徑長度</li></ul>\n<h3>6.3 The 8-queens</h3>\n<p>兩種 formulation 的共同部分：</p>\n<ul><li>Goal test：8 個皇后都在棋盤上，且兩兩不互相攻擊（不同行、列、對角線）</li><li>Path cost：0（只在乎找到合法擺法，不在乎走了幾步）</li></ul>\n<p><strong>(1) Incremental formulation（增量式）</strong></p>\n<p>從空棋盤開始，每個動作放一隻皇后。</p>\n<ul><li>States：棋盤上 0 到 8 隻皇后的任意擺法</li><li>Initial state：空棋盤</li><li>Successor：在任意空格放一隻皇后</li><li>狀態空間大小：<span class=\"math\">64 × 63 × 62 × 61 × 60 × 59 × 58 × 57 ≈ 2<sup>48</sup> = 256</span> Tera 量級</li></ul>\n<p><strong>(2) Complete-state formulation（完整狀態式）</strong></p>\n<p>一開始 8 隻皇后就都在棋盤上，再逐隻移動。投影片的限制是：每列最多一隻，且只放在最左邊若干列這種逐步安排（標準講法是每列一隻皇后）。</p>\n<ul><li>Operators：把一隻正被攻擊的皇后移到某一行，使它不被其他皇后攻擊</li><li>狀態數：最多 <span class=\"math\">7 × 6 × 5 × 4 × 3 × 2 × 1 = 7! = 5040 ≈ 2<sup>12</sup></span></li></ul>\n<p>結論（這是這題真正要考的）：<strong>formulation 選對，搜尋空間的大小可以差非常多。</strong> 同一題，增量式是天文數字，完整狀態式只有幾千個狀態。</p>",
        "id": "c4-s6",
        "exam": true
      },
      {
        "title": "7. Uninformed search vs Informed search",
        "html": "<p><strong>Uninformed search（盲目搜尋）</strong>：沒有「離目標還有多遠、還要多少代價」的資訊，等於把樹建起來盲搜。</p>\n<p><strong>Informed / heuristic search</strong>：利用當前狀態已有的資訊，朝目標方向搜。Chapter 4 才講。</p>\n<p>本章的 uninformed 策略：</p>\n<ul><li>Breadth-first search（BFS）<ul><li>變體：Uniform cost search</li></ul></li><li>Depth-first search（DFS）<ul><li>變體：Depth-limited search</li><li>變體：Iterative deepening search</li><li>變體：Iterative lengthening search</li></ul></li><li>Bidirectional search</li></ul>",
        "id": "c4-s7",
        "exam": false
      },
      {
        "title": "8. 評價搜尋策略的四個標準",
        "html": "<div class='table-wrap'><table><thead><tr><th>標準</th><th>問的問題</th></tr></thead><tbody><tr><td>Completeness</td><td>只要有解，最終一定找得到嗎？能否避開重複狀態、迴圈</td></tr><tr><td>Optimality</td><td>找到的是所有解裡最好的嗎</td></tr><tr><td>Time complexity</td><td>要花多少時間</td></tr><tr><td>Space complexity</td><td>要花多少記憶體</td></tr></tbody></table></div>\n<p>符號（比較表與 BFS 那張時間表都用這套）：</p>\n<div class='table-wrap'><table><thead><tr><th>符號</th><th>意思</th></tr></thead><tbody><tr><td><span class=\"math\">b</span></td><td>branching factor，一個節點的平均分支數</td></tr><tr><td><span class=\"math\">d</span></td><td>最淺解的深度</td></tr><tr><td><span class=\"math\">m</span></td><td>搜尋樹的最大深度</td></tr><tr><td><span class=\"math\">ℓ</span></td><td>深度限制</td></tr><tr><td><span class=\"math\">C<sup>*</sup></span></td><td>最優解的路徑代價</td></tr><tr><td><span class=\"math\">ε</span></td><td>每步代價的正下界</td></tr></tbody></table></div>",
        "id": "c4-s8",
        "exam": false
      },
      {
        "title": "9. Breadth-first search（BFS）",
        "html": "<p>根先擴展，再擴展根生成的全部節點，再下一層，如此一層層往下。隊列是 <strong>FIFO</strong>。</p>\n<p>同一棵樹的隊列變化（先擴左邊）：</p>\n<div class='table-wrap'><table><thead><tr><th>步驟</th><th>隊列（即將擴展的在左）</th></tr></thead><tbody><tr><td>開始</td><td>{A}</td></tr><tr><td>擴展 A</td><td>{B, C}</td></tr><tr><td>擴展 B</td><td>{C, D, E}</td></tr><tr><td>擴展 C</td><td>{D, E, F, G}</td></tr></tbody></table></div>\n<h3>評價</h3>\n<ul><li><strong>Complete</strong>：有限分支時最終找得到。</li><li><strong>Optimal 的條件</strong>：路徑代價是節點深度的非遞減函數。每步代價相同（例如都是 1）時成立。</li><li>若步代價不同，BFS 找到的是 <strong>最淺</strong> 的目標，不一定是 <strong>最便宜</strong> 的。投影片的反例：從 S 出發，一條邊代價 1 卻通向較貴的目標，另一條邊代價 5 通向更便宜的目標，還有代價 15 的分支。最淺 ≠ 最優。</li></ul>\n<h3>時間與空間都是瓶頸</h3>\n<p>分支因子大時，即使問題不大（如下棋），時間和空間都會爆。</p>\n<p>假設 <span class=\"math\">b = 10</span>，每秒處理 10,000 個節點，每節點 1KB：</p>\n<div class='table-wrap'><table><thead><tr><th>Depth</th><th>Nodes</th><th>Time</th><th>Memory</th></tr></thead><tbody><tr><td>2</td><td>1,100</td><td>0.11 秒</td><td>1 MB</td></tr><tr><td>4</td><td>111,100</td><td>11 秒</td><td>106 MB</td></tr><tr><td>6</td><td><span class=\"math\">10<sup>7</sup></span></td><td>19 分鐘</td><td>10 GB</td></tr><tr><td>8</td><td><span class=\"math\">10<sup>9</sup></span></td><td>31 小時</td><td>1 TB</td></tr><tr><td>10</td><td><span class=\"math\">10<sup>11</sup></span></td><td>129 天</td><td>101 TB</td></tr><tr><td>12</td><td><span class=\"math\">10<sup>13</sup></span></td><td>35 年</td><td>10 PB</td></tr><tr><td>14</td><td><span class=\"math\">10<sup>15</sup></span></td><td>3,523 年</td><td>1 EB</td></tr></tbody></table></div>\n<p>時間、空間都是 <span class=\"math\">O(b<sup>d+1</sup>)</span>。BFS 的實用障礙首先是記憶體。</p>",
        "id": "c4-s9",
        "exam": false
      },
      {
        "title": "10. Uniform cost search（UCS）",
        "html": "<p>BFS 在步代價相等時才最優。UCS 修改 BFS：<strong>每次擴展路徑代價 <span class=\"math\">g(n)</span> 最低的節點</strong>（優先隊列，不是純 FIFO）。</p>\n<ul><li>第一個被找到的解保證是最便宜的。</li><li>深度意義上不一定最淺（這點和 BFS 不同）；在代價處處相等時，它和 BFS 一樣。</li><li>條件：路徑代價非遞減，也就是每步代價 <span class=\"math\">≥ 0</span>。</li><li><strong>負代價的動作不能用 UCS</strong>（代價可以無限降，最便宜的解沒有意義，也無法在第一次碰到目標時就停）。</li></ul>\n<p>複雜度 <span class=\"math\">O(b<sup>⌈ C<sup>*</sup>/ε ⌉</sup>)</span>，時間和空間都是。</p>",
        "id": "c4-s10",
        "exam": false
      },
      {
        "title": "11. Depth-first search（DFS）",
        "html": "<p>總是擴展樹裡 <strong>最深</strong> 的那個節點，隊列是 <strong>LIFO（堆疊）</strong>。走到死路（leaf 但不是 goal）才回溯，去擴展較淺的節點。</p>\n<p>隊列變化：</p>\n<div class='table-wrap'><table><thead><tr><th>步驟</th><th>堆疊（左端是下一個要擴展的）</th></tr></thead><tbody><tr><td>開始</td><td>{A}</td></tr><tr><td>擴展 A，先壓入 B</td><td>{B, C}</td></tr><tr><td>擴展 B</td><td>{D, E, C}</td></tr><tr><td>擴展 D</td><td>{H, I, E, C}</td></tr><tr><td>H 是死路，彈出</td><td>{I, E, C}</td></tr><tr><td>I 也是死路</td><td>{E, C}</td></tr></tbody></table></div>\n<p><strong>Backtracking search</strong>（PROLOG 的做法）是 DFS 的更省記憶體版本：擴展時一次只生成一個後繼，而不是一次生成全部後繼。</p>\n<h3>評價</h3>\n<ul><li><strong>不 complete</strong>：某一條路可能無限長或形成迴圈，於是永遠不回溯去試別的分支。</li><li><strong>不 optimal</strong>：不保證第一個找到的是最好的解。</li><li>時間、空間比 BFS 好處理得多。空間是 <span class=\"math\">O(bm)</span>：沿著一條深度為 <span class=\"math\">m</span> 的路徑，每層保留約 <span class=\"math\">b</span> 個兄弟。時間仍是 <span class=\"math\">O(b<sup>m</sup>)</span>，最壞要走到最深。</li></ul>",
        "id": "c4-s11",
        "exam": false
      },
      {
        "title": "12. Depth-limited search（DLS）",
        "html": "<p>DFS 加上事先定好的最大深度 <span class=\"math\">ℓ</span>。</p>\n<ul><li><span class=\"math\">ℓ</span> 太小：解在限制之下，找不到。</li><li><span class=\"math\">ℓ</span> 太大：和 DFS 同樣的問題又回來。</li><li>因為樹被截斷、大小有限，不會無限搜下去；投影片因此說它 complete，但 <strong>仍然不是 optimal</strong>。</li><li>考試時要補上條件：只有解的深度 <span class=\"math\">≤ ℓ</span> 時才找得到。表上的標準答案是：<strong>Complete? No</strong>（沒有這個深度保證），<strong>Optimal? No</strong>，時間 <span class=\"math\">O(b<sup>ℓ</sup>)</span>，空間 <span class=\"math\">O(bℓ)</span>。</li></ul>",
        "id": "c4-s12",
        "exam": false
      },
      {
        "title": "13. Iterative deepening search（IDS）",
        "html": "<p>深度限制不事先猜。從 <span class=\"math\">d = 0</span> 做一次 DLS，然後 <span class=\"math\">d = 1, 2, 3, …</span>，直到找到解。</p>\n<p>它把兩者的好處合在一起：</p>\n<ul><li>像 DFS：每一輪只佔 DFS 的記憶體，空間 <span class=\"math\">O(bd)</span>。</li><li>像 BFS：先檢查淺層，所以在每步代價為 1 時，第一個找到的是最淺解，因此 <strong>optimal</strong>，也 <strong>complete</strong>（<span class=\"math\">b</span> 有限時）。</li></ul>\n<p>時間 <span class=\"math\">O(b<sup>d</sup>)</span>。淺層會被重複擴展很多次，但節點數主要集中在最底層，重複的代價相對不大，所以時間和 BFS 同一個量級，空間卻小得多。</p>\n<p>適合：狀態空間很大，而且不知道解的深度 <span class=\"math\">d</span>。</p>",
        "id": "c4-s13",
        "exam": false
      },
      {
        "title": "14. Iterative lengthening search（ILS）",
        "html": "<p>IDS 的限制是深度（隱含每步代價 = 1）。ILS 的限制是 <strong>路徑代價 <span class=\"math\">p</span></strong>：代價 <span class=\"math\">&lt; p</span> 的節點才擴展，否則先放下。</p>\n<p>它是 UCS 的迭代版本：有 UCS「按代價、能找到最便宜解」的優點，同時避開 UCS 要把整層前沿都放在記憶體裡的需求。代價是計算量明顯大於直接做 UCS。</p>",
        "id": "c4-s14",
        "exam": false
      },
      {
        "title": "15. Bidirectional search（雙向搜尋）",
        "html": "<p>同時跑兩個搜尋：一個從初始狀態向前，一個從目標向後，兩者相遇就停。</p>\n<p>若兩個方向都用 BFS，時間和空間都是 <span class=\"math\">O(b<sup>d/2</sup>)</span>，比單向的 <span class=\"math\">O(b<sup>d</sup>)</span> 小一個平方根的指數。</p>\n<p>前提是反向搜尋做得到，而這常常做不到：</p>\n<ul><li>目標狀態可能非常多，不知道從哪一個往回走。</li><li>在目標狀態上，不知道是哪些動作把它生成出來的。</li><li>動作未必可逆：若 <span class=\"math\">G = f(B)</span>，需要存在 <span class=\"math\">f<sup>-1</sup></span> 才能算前驅。</li></ul>\n<p>Complete 與 Optimal 的條件：兩個方向都用 BFS，且步代價一致時才最優。</p>",
        "id": "c4-s15",
        "exam": false
      },
      {
        "title": "16. 六種策略對照（Figure 3.17，整張要背）",
        "html": "<div class='table-wrap'><table><thead><tr><th>Criterion</th><th>BFS</th><th>Uniform-Cost</th><th>DFS</th><th>Depth-Limited</th><th>Iterative Deepening</th><th>Bidirectional</th></tr></thead><tbody><tr><td>Complete?</td><td>Yes <span class=\"math\"><sup>a</sup></span></td><td>Yes <span class=\"math\"><sup>a,b</sup></span></td><td>No</td><td>No</td><td>Yes <span class=\"math\"><sup>a</sup></span></td><td>Yes <span class=\"math\"><sup>a,d</sup></span></td></tr><tr><td>Time</td><td><span class=\"math\">O(b<sup>d+1</sup>)</span></td><td><span class=\"math\">O(b<sup>⌈ C<sup>*</sup>/ε ⌉</sup>)</span></td><td><span class=\"math\">O(b<sup>m</sup>)</span></td><td><span class=\"math\">O(b<sup>ℓ</sup>)</span></td><td><span class=\"math\">O(b<sup>d</sup>)</span></td><td><span class=\"math\">O(b<sup>d/2</sup>)</span></td></tr><tr><td>Space</td><td><span class=\"math\">O(b<sup>d+1</sup>)</span></td><td><span class=\"math\">O(b<sup>⌈ C<sup>*</sup>/ε ⌉</sup>)</span></td><td><span class=\"math\">O(bm)</span></td><td><span class=\"math\">O(bℓ)</span></td><td><span class=\"math\">O(bd)</span></td><td><span class=\"math\">O(b<sup>d/2</sup>)</span></td></tr><tr><td>Optimal?</td><td>Yes <span class=\"math\"><sup>c</sup></span></td><td>Yes</td><td>No</td><td>No</td><td>Yes <span class=\"math\"><sup>c</sup></span></td><td>Yes <span class=\"math\"><sup>c,d</sup></span></td></tr></tbody></table></div>\n<p>上標：</p>\n<ul><li><span class=\"math\">a</span>：<span class=\"math\">b</span> 有限時才 complete</li><li><span class=\"math\">b</span>：每步代價 <span class=\"math\">≥ ε</span>，<span class=\"math\">ε &gt; 0</span>，才 complete</li><li><span class=\"math\">c</span>：所有步代價都相同時才 optimal</li><li><span class=\"math\">d</span>：兩個方向都使用 breadth-first 才成立</li></ul>\n<p>UCS 的 Optimal 沒有 <span class=\"math\">c</span>，因為它本來就是按代價擴展，步代價可以不同（只要非負）。</p>",
        "id": "c4-s16",
        "exam": true
      },
      {
        "title": "17. 避免重複狀態",
        "html": "<p><strong>Repeated state</strong>：這個狀態以前遇過或擴展過，哪怕是在另一條路徑上。</p>\n<p>所有策略都可能遇到。後果：路徑變成無限長，永遠打轉；即使有限，也會把搜尋變得非常沒效率（同一狀態長出一整棵重複的子樹）。</p>\n<p>三種處理，難度遞增：</p>\n<ol><li><strong>不要立刻走回剛來的狀態</strong>  </li></ol>\n<p>拒絕生成與 <strong>父節點</strong> 相同的後繼。只能擋住 A → B → A 這種一步回頭。</p>\n<ol><li><strong>不要製造有環的路徑</strong>  </li></ol>\n<p>拒絕生成與 <strong>任一祖先</strong> 相同的後繼。能擋住這條路徑上的圈，擋不住從別的分支又生成同一個狀態。</p>\n<ol><li><strong>不要再生成任何已經生成過的狀態</strong>  </li></ol>\n<p>不只比祖先，還要比對所有已經擴展過的狀態。能消掉圖中那種「左邊一棵 B，右邊又長出一棵 B」的重複子樹。檢查代價最高。</p>\n<p>實現第 3 種用 <strong>closed list</strong>：一個集合，存放至今每個已擴展節點的狀態。當前節點若已在 closed 裡，丟掉。</p>\n<p>Graph-search 就是在一般樹搜尋上加這張表：</p>\n<pre><code>function GRAPH-SEARCH(problem, fringe) returns a solution, or failure\n    closed ← empty set\n    fringe ← INSERT(MAKE-NODE(INITIAL-STATE[problem]), fringe)\n    loop do\n        if EMPTY?(fringe) then return failure\n        node ← REMOVE-FIRST(fringe)\n        if GOAL-TEST(problem)(STATE[node]) then return SOLUTION(node)\n        if STATE[node] is not in closed then\n            add STATE[node] to closed\n            fringe ← INSERT-ALL(EXPAND(node, problem), fringe)</code></pre>\n<p><code>REMOVE-FIRST</code> 的順序由 fringe 的隊列種類決定，所以這份虛擬碼同時覆蓋 BFS、DFS、UCS：換的是隊列，不是這段邏輯。</p>",
        "id": "c4-s17",
        "exam": false
      },
      {
        "title": "18. 資訊不完整時的三類問題",
        "html": "<p>前面所有 formulation 都假設：初始狀態已知（fully observable），動作效果確定（deterministic）。知識不完整時分成三種，對應拿掉哪條假設：</p>\n<div class='table-wrap'><table><thead><tr><th>類型</th><th>缺什麼</th><th>投影片標記</th></tr></thead><tbody><tr><td>Sensorless / conformant problems</td><td>沒有感測，不知道初始狀態</td><td>缺第 1 條</td></tr><tr><td>Contingency / nondeterministic problems</td><td>動作效果不確定</td><td>缺第 2 條</td></tr><tr><td>Exploration problems</td><td>狀態與動作效果都不知道</td><td>兩條都缺</td></tr></tbody></table></div>\n<h3>Sensorless（無感測）</h3>\n<p>沒有感測器就不知道初始狀態。搜尋樹 = 初始狀態 + 動作；沒有單一初始狀態，普通的樹建不起來。</p>\n<p>此時初始狀態是一個 <strong>集合</strong>。每個動作把一組狀態映到一組可能的後繼。這些後繼集合叫做 <strong>belief states（信念狀態）</strong>：我們相信 agent 可能位於其中的那些狀態。</p>\n<p>吸塵世界的圖就是在信念狀態上搜尋：一個節點裡同時畫著好幾種可能的 (位置, 灰塵) 組合；L、R、S 作用在整個集合上。無感測時仍然可以有策略，例如「先吸、再向右、再吸」，無論一開始在哪都能把兩格吸乾淨。搜尋的對象從單個狀態變成信念狀態。</p>\n<h3>Contingency（應變 / 非確定）</h3>\n<p>動作效果不確定。要建一棵能表示「同一個動作有多種可能結果」的樹，這些分支就是 contingencies。</p>\n<p>Agent 不能再「先整段搜完，再一次性執行」。它必須 <strong>search, execute, search, execute, …</strong> 交替進行：做一步，看實際發生了哪一種結果，再接著規劃。</p>\n<h3>Exploration（探索）</h3>\n<p>環境裡有哪些狀態、動作有什麼效果，兩者都不知道。Agent 必須做實驗：執行一些動作，觀察兩件事——進入了什麼狀態、動作產生了什麼效果。</p>\n<p>某些狀態裡實驗有真正的危險，動作可能損壞 agent。如果它活下來，就學到了環境與動作效果，再用這些知識解後面的問題。這已經接上第 2 章的 learning agent。</p>\n<hr>",
        "id": "c4-s18",
        "exam": false
      }
    ],
    "id": "c4"
  },
  {
    "title": "三章串起來",
    "sections": [
      {
        "title": "本節提要",
        "html": "<pre><code>AI 沒有統一定義\n        │\n        ├─ 像人：Turing Test，但沒有 mind theory，目前做不到\n        │\n        └─ 理性：Rational Agent\n                 │\n                 ├─ PEAS 描述任務\n                 ├─ 6 對環境性質決定問題有多難\n                 │\n                 └─ 五種程式\n                      reflex：規則，只要當下\n                      model-based：加記憶\n                      goal-based：加目標 → 用搜尋樹找動作序列   ← 第 3 章\n                      utility-based：目標之外還要比較好壞\n                      learning：從環境反饋改自己\n                 │\n                 └─ 搜尋只適合 static + fully observable + discrete + deterministic\n                      四要素：初始狀態、後繼函數、目標測試、路徑代價 g\n                      盲目搜尋：BFS、UCS、DFS、DLS、IDS、ILS、雙向\n                      重複狀態用 closed list（graph-search）\n                      資訊殘缺：信念狀態 / 應變 / 探索</code></pre>",
        "id": "c5-s1",
        "exam": false
      }
    ],
    "id": "c5"
  },
  {
    "title": "容易混的對照",
    "sections": [
      {
        "title": "本節提要",
        "html": "<div class='table-wrap'><table><thead><tr><th>容易混</th><th>分開記</th></tr></thead><tbody><tr><td>Goal vs Utility</td><td>Goal 是到不到；Utility 是好到什麼程度（狀態 → 實數）</td></tr><tr><td>BFS vs UCS</td><td>BFS 擴最淺；UCS 擴 <span class=\"math\">g(n)</span> 最小。步代價相同時兩者一致</td></tr><tr><td>BFS optimal 的條件</td><td>路徑代價隨深度非遞減，通常就是每步代價相等</td></tr><tr><td>DFS 的空間</td><td><span class=\"math\">O(bm)</span>，不是 <span class=\"math\">O(b<sup>m</sup>)</span>。時間才是 <span class=\"math\">O(b<sup>m</sup>)</span></td></tr><tr><td>DLS vs IDS</td><td>DLS 的深度是人猜的；IDS 從 0 往上試所有深度</td></tr><tr><td>IDS vs ILS</td><td>IDS 限制深度；ILS 限制路徑代價，是 UCS 的迭代版</td></tr><tr><td>Complete-state vs Incremental（八皇后）</td><td>前者約 <span class=\"math\">7!</span>；後者約 <span class=\"math\">64!/(64-8)!</span>，formulation 決定空間大小</td></tr><tr><td>Strategic vs Stochastic</td><td>Strategic：不確定性只來自其他 agent（棋、撲克）。Stochastic：還有隨機因素（骰子、感測雜訊）</td></tr><tr><td>Episodic vs Sequential</td><td>填字是 sequential；圖像分析是 episodic</td></tr><tr><td>Humanly vs Rational</td><td>像人不可靠，因為人也不總是理性，而且我們不知道大腦演算法。本課學 rational</td></tr><tr><td>Model-based AI vs Data-based AI（第 1 章）</td><td>前者人寫方程；後者從大數據用機器學習得到模型</td></tr><tr><td>Model-based reflex（第 2 章）</td><td>與第 1 章的「模型法」不是同一個詞。這裡的 model 是「世界如何自行演變 + 我的動作如何改變世界」</td></tr><tr><td>Tree-search vs Graph-search</td><td>Graph-search 多一張 closed list，丟棄已擴展過的狀態</td></tr><tr><td>Sensorless vs Contingency</td><td>前者不知道自己在哪，搜尋 belief state；後者知道動作可能有多種結果，必須邊做邊重新規劃</td></tr></tbody></table></div>",
        "id": "c6-s1",
        "exam": false
      }
    ],
    "id": "c6"
  },
  {
    "title": "自測題（答案都在上文）",
    "sections": [
      {
        "title": "本節提要",
        "html": "<ol><li>寫出 AI 定義的四格，並說明本課選哪一格、為什麼不選 humanly。</li><li>Turing Test 的六項認知任務裡，哪四項屬於「腦」，哪兩項是 Total Turing Test 才加的？</li><li>理性的四個依賴項是什麼？用吸塵世界各舉一例。</li><li>寫出計程車的 PEAS。為什麼它需要 utility 而不只是 goal？</li><li>不看表，判斷：撲克、雙陸棋、有棋鐘的象棋、填字、圖像分析，各是 fully 還是 partially、deterministic / stochastic / strategic、episodic 還是 sequential。</li><li>五種 agent 各自比前一種多了什麼？simple reflex 為什麼要求 fully observable？</li><li>一個 well-defined problem 的四要素是什麼？解和最優解的差別？</li><li>為什麼 goal test 不一定是一張目標狀態清單？用象棋說明。</li><li>八皇后兩種 formulation 的狀態數大約差多少？這個例子說明什麼？</li><li>默寫六種搜尋的 Complete / Time / Space / Optimal，並寫出四個上標的條件。</li><li>給 <span class=\"math\">b=10</span>，解釋為什麼 BFS 在深度 8 以後幾乎不能用。瓶頸是時間還是空間？</li><li>負邊權為什麼不能用 UCS？</li><li>IDS 為什麼時間接近 BFS、空間接近 DFS？</li><li>避免重複狀態的三個層次分別擋住什麼？closed list 存在 graph-search 的哪一步？</li><li>無感測問題裡，搜尋節點為什麼從「一個狀態」變成「一組狀態」？這組狀態叫什麼？</li></ol>",
        "id": "c7-s1",
        "exam": false
      }
    ],
    "id": "c7"
  }
];
