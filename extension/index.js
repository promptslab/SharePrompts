let isRequesting = false;

const API_URL = "http://localhost:3000/api/conversations";
const PAGE_URL = "http://localhost:3000/share/";
// const API_URL = "https://shareprompts.ai/api/conversations";
// const PAGE_URL = "https://shareprompts.ai/share/";

function init() {
  const shareButton = createBtn();

  function appendShareButton() {
    try{
      const buttonsWrapper = document.querySelector(
        "#__next main form > div div:nth-of-type(1) > div"
      );
  
      // if(! buttonsWrapper) return;
    
      buttonsWrapper.appendChild(shareButton);
    }
    catch{}
  }

  appendShareButton();

  const id = setInterval(() => {
    if (
      !document.querySelector("#export-button") ||
      document.querySelector("#export-button").style.display === "none"
    ) {
      appendShareButton();
    }
  }, 500);

  const textareaElement = document.querySelector("#__next main form textarea");
  if(!textareaElement) return;

  const submitButton = textareaElement.nextElementSibling;

  shareButton.addEventListener("click", async () => {
    if (isRequesting) return;
    isRequesting = true;
    shareButton.textContent = "Sharing...";
    shareButton.style.cursor = "initial";

    const threadContainer = document.getElementsByClassName(
      "flex flex-col text-sm dark:bg-gray-800"
    )[0];

    // show the model for chatgpt+ users
    let model;

    const chatGptPlusElement = document.querySelector(".gold-new-button");
    const isNotChatGptPlus =
      chatGptPlusElement && chatGptPlusElement.innerText.includes("Upgrade");

    if (!isNotChatGptPlus) {
      const modelElement = threadContainer.firstChild;
      model = modelElement.innerText;
    }

    const conversationData = {
      title: document.title,
      avatarUrl: getAvatarImage(),
      model,
      items: [],
    };

    for (const node of threadContainer.children) {
      const markdown = node.querySelector(".markdown");

      // tailwind class indicates human or gpt
      if ([...node.classList].includes("dark:bg-gray-800")) {
        const warning = node.querySelector(".text-orange-500");
        if (warning) {
          conversationData.items.push({
            from: "human",
            value: warning.innerText.split("\n")[0],
          });
        } else {
          const text = node.querySelector(".whitespace-pre-wrap");
          conversationData.items.push({
            from: "human",
            value: text.textContent,
          });
        }
        // if it's a GPT response, it might contain code blocks
      } else if (markdown) {
        conversationData.items.push({
          from: "gpt",
          value: markdown.outerHTML,
        });
      }
    }

    const res = await fetch(API_URL, {
      body: JSON.stringify(conversationData),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    }).catch((err) => {
      isRequesting = false;
      alert(`Error saving conversation: ${err.message}`);
    });
    const { id } = await res.json();
    const url = PAGE_URL + id;

    window.open(url, "_blank");

    setTimeout(() => {
      shareButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3 h-3">
      <path stroke-linecap="round" stroke-linejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
    </svg>Share`;
      shareButton.style.cursor = "pointer";
      isRequesting = false;
    }, 1000);
  });
}

function getAvatarImage() {
  // Create a canvas element
  try {
    const canvas = document.createElement("canvas");

    const image = document.querySelectorAll("img")[0];

    // Set the canvas size to 30x30 pixels
    canvas.width = 48;
    canvas.height = 48;

    // Draw the img onto the canvas
    canvas.getContext("2d").drawImage(image, 0, 0);

    // Convert the canvas to a base64 string as a JPEG image
    const base64 = canvas.toDataURL("image/jpeg");

    return base64;
  } catch (error) {
    console.log("Error generating avatar image.");
    return null;
  }
}

function createBtn() {
  const button = document.createElement("button");

  button.id = "export-button";

  button.classList.add("btn", "flex", "gap-2", "justify-center", "btn-neutral");

  button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3 h-3">
  <path stroke-linecap="round" stroke-linejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
</svg>Share`;

  return button;
}

function showIfNotLoading(loadingElement, newElement) {
  const timerId = setInterval(() => {
    if (loadingElement.disabled) {
      isLoading = true;
      newElement.style.display = "none";
    } else {
      isLoading = false;
      newElement.style.display = "flex";
      clearInterval(timerId);
    }
  }, 100);
}

function createBtnSpd() {
  const button = document.createElement("button");

  button.id = "share-button";

  button.classList.add("btn", "flex", "gap-2", "justify-center", "btn-neutral");

  button.innerHTML = `<svg width="0.75rem" height="0.75rem" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="black" class="w-3 h-3">
  <path stroke-linecap="round" stroke-linejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
</svg><span>Share<span>`;

  button.style.display = 'flex';
  button.style.alignItems = 'center';
  button.style.margin = '.5rem';
  button.style.outline = 'none';
  button.style.border = "1px solid rgb(0, 82, 204)";
  button.style.borderRadius = ".3rem";
  button.style.background = "transparent";
  button.style.position = 'absolute';
  button.style.top = "0";
  button.style.right = '10px'
  return button;
}

const sleep = (ms) => {
  return new Promise((resolve) => {
    return setTimeout(resolve, ms)
  })
}

// Initialization for bard
let isBardConversationSharing = false;

async function initBard(){

  let inputCnt = document.querySelector(".input-area-container");
  while(inputCnt === null){
    await sleep(500);
    inputCnt = document.querySelector(".input-area-container");
  }

  const btn = createBardShareBtn()
  inputCnt.appendChild(btn);

  createTitleModal();

}

async function shareConversation() {
  if(isBardConversationSharing) return;
  isBardConversationSharing = true;

  document.querySelector(".share-prompt-modal").style.display = "none";
  document.querySelector(".main-share-btn span.share-prompt-btn-text").innerText = "Sharing....";

  const conversationData = getConversation();

  const res = await fetch(API_URL, {
    body: JSON.stringify(conversationData),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  }).catch((err) => {
    isRequesting = false;
    alert(`Error saving conversation: ${err.message}`);
  });
  const { id } = await res.json();
  const url = PAGE_URL + id;

  
  document.querySelector(".main-share-btn span.share-prompt-btn-text").innerText = "Share";
  isBardConversationSharing = false;

  window.open(url, "_blank");
}

function getConversation () {
  const conversationContainers = document.querySelectorAll(".conversation-container");

  const conversationData = {
    title: document.getElementById("prompt-title-inp").value,
    avatarUrl: document.querySelector("img.gb_n.gbii")?.src ?? null,
    model: "Bard",
    source: "bard",
    items: [],
  };

  conversationContainers.forEach(cnt => {
    const humanValue = cnt.querySelector("user-query .query-text");
    const bardResponse = cnt.querySelectorAll("model-response .markdown.markdown-main-panel");

    const human = {
      from: "human",
      value: humanValue.innerText
    }
    const bard = {
      from: "gpt",
      value: bardResponse[bardResponse.length  - 1].outerHTML
    }

    conversationData.items.push(human);
    conversationData.items.push(bard);
  });

  return conversationData
}

function createTitleModal () {
  const titleCnt = document.createElement("div");

  titleCnt.classList.add("share-prompt-modal");

  titleCnt.style.position = "absolute";
  titleCnt.style.zIndex = "1000";
  titleCnt.style.top = "50%";
  titleCnt.style.right = "50%";
  titleCnt.style.transform = "translate(50%, 50%)";
  titleCnt.style.border = "1px solid #DDD";  
  titleCnt.style.padding = "1rem";  
  titleCnt.style.backgroundColor = "#292929";  
  titleCnt.style.borderRadius = "1rem";  
  titleCnt.style.display = "none";  
  titleCnt.style.flexDirection = "column";  
  titleCnt.style.alignItems = "center";  
  titleCnt.style.justifyContent = "center";  
  titleCnt.style.gap = "1rem";  

  const btnStyle = `
  background-color: #131313;
  outline: none;
  border: 1px solid #AAA;
  color: #FFF;
  border-radius: 0.5rem;
  padding: 0.3rem 1rem;
  cursor: pointer;
  margin: 0 .5rem;`

  titleCnt.innerHTML = `<input type="text" value="untitled" placeholder="Enter Prompt Title" id="prompt-title-inp" style="
                            padding: .5rem;
                            border-radius: .5rem;
                            outline: none;
                            border: 1px solid #AAA;
                            background-color: #131313;
                            color: #FFF;
                            font-size: 1.2rem;
                        ">
                        <div>
                          <button class="share-prompt" style="${btnStyle}">Share</button>
                          <button class="close-prompt" style="${btnStyle}">Cancel</button>
                        </div>`;

  document.body.appendChild(titleCnt);

  document.querySelector("button.share-prompt").addEventListener("click", shareConversation);
  document.querySelector("button.close-prompt").addEventListener("click", () => {
    titleCnt.style.display = "none";
  });

}

function createBardShareBtn () {
  const btn = document.createElement("button");

  btn.classList.add("main-share-btn")

  btn.style.display = 'flex';
  btn.style.alignItems = 'center';
  btn.style.gap = '.5rem';
  btn.style.position = "absolute";
  btn.style.top = "0";
  btn.style.right = "0";
  btn.style.margin = "0 20px";
  btn.style.color = "#FFF";
  btn.style.backgroundColor = "#131313";
  btn.style.outline = "none";
  btn.style.border = "1px solid #AAA";
  btn.style.borderRadius = "0.5rem";
  btn.style.padding = "0.3rem 1rem";
  btn.style.fontSize = "0.9rem";
  btn.style.cursor = "pointer";

  btn.addEventListener("click", () => {
    const promptModal = document.querySelector(".share-prompt-modal");
    promptModal.style.display = "flex";
  })

  btn.innerHTML = `<svg width="0.75rem" height="0.75rem" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#FFF" viewBox="0 0 24 24" stroke-width="1.5" stroke="black" class="w-3 h-3">
  <path stroke-linecap="round" stroke-linejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
</svg><span class='share-prompt-btn-text'>Share<span>`

  return btn
}

// starting point
function main(){
  const url = window.location.href;

  if(url.match(/https:\/\/bard\.google\.com.*/))
    initBard();
  else if(url.match(/https:\/\/chat\.openai\.com.*/))
    init();
}

main();
// init();


